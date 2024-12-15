import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";


export const get= query({
    args:{
        id:v.id("conversations"),
    },

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

        const conversation = await ctx.db.get(args.id);

        if(!conversation){
            throw new ConvexError("Conversation not found");
        }

        const membership= await ctx.db.query("conversationMembers")
          .withIndex("by_memberId_conversationId", q =>q.eq("memberId", currentUser._id).eq("conversationId", conversation._id)).unique();

         if(!membership){
            throw new ConvexError("You are not a member of this conversation");
         }

        const allConversationMemberships= await ctx.db
                .query("conversationMembers") 
                .withIndex("by_conversationId",
                (q)=>q.eq("conversationId",args.id)).collect();
      
       
        if(!conversation.isGroup){
            const otherMemberships = 
            allConversationMemberships.filter(membership => membership.memberId !== currentUser._id)[0];

            const otherMemberDetails = await ctx.db.get(otherMemberships.memberId);

            return {
                ...conversation,
                otherMember: {
                    ...otherMemberDetails,
                    lastSeenMessageId: otherMemberships.lastSeenMessage
                
                },
                // need to fixed for group chat
                otherMembers : null

            }
        }
         
    },

});


export const markRead= mutation({
    args:{
        conversationId:v.id("conversations"),
        messageId:v.id("messages"),
    },

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

        

        const membership= await ctx.db.query("conversationMembers")
          .withIndex("by_memberId_conversationId", q =>q.eq("memberId", currentUser._id).eq("conversationId",args.conversationId)).unique();

         if(!membership){
            throw new ConvexError("You are not a member of this conversation");
         }

       const lastMessage= await ctx.db.get(args.messageId);

       await ctx.db.patch(membership._id,{
              lastSeenMessage :lastMessage ?
              lastMessage._id: undefined,
       });
      
       
        
         
    },

});