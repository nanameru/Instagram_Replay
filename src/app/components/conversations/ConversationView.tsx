'use client';

import React, { useState, useEffect } from 'react';
import { Conversation, Message, AIResponse } from '../../types';
import { fetchMessages, fetchLatestAIResponse } from '../../lib/api-client';
import { formatDistanceToNow } from 'date-fns';

interface ConversationViewProps {
  conversation: Conversation;
}

export default function ConversationView({ conversation }: ConversationViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConversationData() {
      try {
        setLoading(true);
        setError(null);
        
        // Load messages for this conversation
        const messagesData = await fetchMessages(conversation.id);
        setMessages(messagesData);
        
        // Load latest AI response
        const aiResponseData = await fetchLatestAIResponse(conversation.id);
        setAIResponse(aiResponseData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading conversation data:', error);
        setError('Failed to load conversation data');
        setLoading(false);
      }
    }

    if (conversation) {
      loadConversationData();
    }
  }, [conversation]);

  if (loading) {
    return <div className="p-4 text-center">Loading conversation...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  // Sort messages by timestamp (oldest first)
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold">{conversation.customer_name}</h2>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          {sortedMessages.length === 0 ? (
            <div className="text-center text-gray-500">No messages in this conversation</div>
          ) : (
            sortedMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.is_from_instagram ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.is_from_instagram
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className="text-xs mt-1 opacity-70">
                    {formatDistanceToNow(new Date(message.timestamp), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {aiResponse && (
          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-medium mb-2">AI Suggested Response</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">{aiResponse.suggested_response}</p>
              <p className="text-xs text-green-600 mt-2">
                Generated {formatDistanceToNow(new Date(aiResponse.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
