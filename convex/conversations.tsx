import { ConvexError } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";


export const get= query({args:{},

  handler: async(ctx,args)=>{
        const identity= await ctx.auth.getUserIdentity();

        if(!identity){
        throw new ConvexError("You must be logged in to get requests/Unauthorized");
        }

        const currentUser= await getUserByClerkId({
            ctx, clerkId:identity.subject
        });

        if(!currentUser){
            throw new ConvexError("User not found");
        }

        const requests= await ctx.db
                .query("requests")
                .withIndex("by_receiver",(q)=>q.eq
                ("receiver",currentUser._id))
                .collect();

        const conversationMemberships=
         await ctx.db.query
         ("conversationMembers").withIndex
         ("by_memberId",(q)=>q.eq
         ("memberId",currentUser._id))
         .collect();

        const conversations= await Promise.all(
            conversationMemberships?.map
            (async (membership)=>{
                    const conversation= await ctx.db.get
                    (membership.conversationId);

                    if(!conversation){
                        throw new ConvexError("Conversation not found");
                    }

                    return conversation;
                
            })
        );

        const conversationsWithDetails=
         await Promise.all(conversations.map
            (async (conversation, index)=>{
                const allconversationMemberships=
                await ctx.db.query
                ("conversationMembers").withIndex
                ("by_conversationId",(q)=>q.eq
                ("conversationId",conversation?._id)).collect();

                if(conversation.isGroup){
                    return {conversation}
                }else{
                    const otherMembership= allconversationMemberships.filter
                    ((membership)=>membership.memberId !== currentUser._id)[0];

                    if(!otherMembership){
                        throw new ConvexError("Other membership not found");
                    }

                    const otherMember= await ctx.db.get
                    (otherMembership.memberId);

                    if(!otherMember){
                        throw new ConvexError("Other Member not found");
                    }

                    return {conversation, otherMember};
                }
            }));

        return conversationsWithDetails;
         
    },

});