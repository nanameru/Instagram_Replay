'use client';

import React, { useEffect, useState } from 'react';
import { Customer, Conversation } from '../../types';
import { fetchConversations } from '../../lib/api-client';
import { formatDistanceToNow } from 'date-fns';

interface CustomerDetailProps {
  customer: Customer;
  onSelectConversation: (conversation: Conversation) => void;
}

export default function CustomerDetail({
  customer,
  onSelectConversation,
}: CustomerDetailProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConversations() {
      try {
        setLoading(true);
        const allConversations = await fetchConversations();
        
        // Filter conversations for this customer
        const customerConversations = allConversations.filter(
          (conv) => conv.customer_id === customer.id
        );
        
        setConversations(customerConversations);
        setLoading(false);
      } catch (error) {
        console.error('Error loading conversations:', error);
        setError('Failed to load conversations');
        setLoading(false);
      }
    }

    if (customer) {
      loadConversations();
    }
  }, [customer]);

  if (!customer) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        {customer.profile_picture_url && (
          <img
            src={customer.profile_picture_url}
            alt={customer.name}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">{customer.name}</h2>
          {customer.username && (
            <p className="text-gray-500">@{customer.username}</p>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-4">Conversations</h3>
        
        {loading ? (
          <div className="p-4 text-center">Loading conversations...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No conversations found</div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectConversation(conversation)}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">Conversation</div>
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
        )}
      </div>
    </div>
  );
}
