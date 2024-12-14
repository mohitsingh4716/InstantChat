"use client";

import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React, { use, useState } from "react";
import Header from "./_components/Header";
import ChatInput from "./_components/input/ChatInput";
import Body from "./_components/body/Body";
import RemoveFriendDialog from "./_components/dialogs/RemoveFriendDialog";

type Props = {
  params: Promise<{
    conversationId: Id<"conversations">;
  }>;
};

const ConversationsPages = ({ params }: Props) => {
   const { conversationId } = use(params);
   
  const conversation = useQuery(api.conversation.get, { id: conversationId });

  const [removeFriendDialogOpen, setRemoveFriendDialogOpen] = useState(false);
  
  const[deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);

  const [leaveGroupDialogOpen, setLeaveGroupDialogOpen] = useState(false);

  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  
  return conversation === undefined ? (
    <div className="w-full h-full flex justify-center items-center">
      {" "}
      <Loader2 />{" "}
    </div>
  ) : conversation === null ? (
    <p className="w-full h-full flex items-center justify-center">
      {" "}
      conversation not found
    </p>
  ) : (
    <ConversationContainer>
      <RemoveFriendDialog conversationId={conversationId} 
      open={removeFriendDialogOpen} setOpen={setRemoveFriendDialogOpen}
      />
      <Header
        name={
          (conversation.isGroup
            ? conversation.name
            : conversation.otherMember.username) || ""
        }
        imageUrl={
          conversation.isGroup ? undefined : conversation.otherMember.imageUrl
        }
        options={conversation.isGroup ? [
          {
            label: "Delete Group",
            destructive: true,
            onClick: () => setDeleteGroupDialogOpen(true),
          },
          {
            label: "Leave Group",
            destructive: false,
            onClick: () => setLeaveGroupDialogOpen(true),
          }
        ] : [
          {
            label: "Remove Friend",
            destructive: true,
            onClick: () => setRemoveFriendDialogOpen(true),
          },
         
        ]}
      />
      <Body />
      <ChatInput />
    </ConversationContainer>
  );
};

export default ConversationsPages;
