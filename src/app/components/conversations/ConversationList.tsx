'use client';

import React from 'react';
import { Conversation } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string | null;
}

export default function ConversationList({
  conversations,
  onSelectConversation,
  selectedConversationId,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return <div className="p-4 text-center text-gray-500">No conversations found</div>;
  }

  // Sort conversations by last message time (newest first)
  const sortedConversations = [...conversations].sort((a, b) => {
    if (!a.last_message_time) return 1;
    if (!b.last_message_time) return -1;
    return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
  });

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium mb-4">Conversations</h2>
      
      {sortedConversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedConversationId === conversation.id
              ? 'bg-blue-100 border-blue-300'
              : 'hover:bg-gray-100 border-transparent'
          } border`}
          onClick={() => onSelectConversation(conversation)}
        >
          <div className="flex justify-between items-center">
            <div className="font-medium">{conversation.customer_name}</div>
            {conversation.last_message_time && (
              <div className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(conversation.last_message_time), {
                  addSuffix: true,
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
