"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutationState } from "@/hooks/useMutationState";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type Props = {
  conversationId: Id<"conversations">;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const RemoveFriendDialog = ({ conversationId, open, setOpen }: Props) => {
  const { mutate: removeFriend, pending } = useMutationState(api.friend.remove);
  
  const handleRemoveFriends= async()=>{
     removeFriend({conversationId}).
        then(()=>{
            toast.success("Friend Removed Successfully");
        }).catch((error)=>{
            toast.error( error instanceof Error ? error.message : "Unexpected error occurred");
        })
  }
  return  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>
                Are you sure you want to remove this friend?
            </AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. All messages will be deleted and you will not be able to send messages to this user. All group chats will still work as normal. 
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={pending}  onClick={handleRemoveFriends}>Delete
            </AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>

    </AlertDialog>
};

export default RemoveFriendDialog;
