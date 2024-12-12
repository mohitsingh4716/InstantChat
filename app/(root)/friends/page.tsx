import ConversationFallback from '@/components/shared/conversation/ConversationFallback'
import ItemList from '@/components/shared/item-list/ItemList'
import React from 'react'

type Props = {}

export default function Friends(props: Props) {
    return (
        <>
            <ItemList title='Friends'>Friend page</ItemList>
            <ConversationFallback/>
        </>
    );
 };
