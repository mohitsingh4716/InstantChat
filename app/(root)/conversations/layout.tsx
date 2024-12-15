"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import DMConversationItem from "./_components/DMConversationItem";
import { Loader2 } from "lucide-react";

type Props = React.PropsWithChildren<{
  children: React.ReactNode;
}>;

const ConversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);

  return (
    <>
      <ItemList title="Conversations">
        {" "}
        {conversations ? (
          conversations.length === 0 ? (
            <p className="w-full h-full flex justify-center items-center">
              {" "}
              No Conversations found{" "}
            </p>
          ) : (
            conversations.map((conversations) => {
              return conversations.conversation.isGroup ? null : (
                <DMConversationItem
                  key={conversations.conversation._id}
                  id={conversations.conversation._id}
                  imageUrl={conversations.otherMember?.imageUrl || ""}
                  username={conversations.otherMember?.username || ""}
                  lastMessageContent={conversations.lastMessage?.content}
                  lastMessageSender={conversations.lastMessage?.sender}
                  unseenCount={conversations.unseenCount}
                />
              );
            })
          )
        ) : (
          <Loader2 />
        )}
      </ItemList>

      {children}
    </>
  );
};

export default ConversationsLayout;
