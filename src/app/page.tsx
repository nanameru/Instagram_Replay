'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ConversationList from './components/conversations/ConversationList';
import ConversationView from './components/conversations/ConversationView';
import { Conversation } from './types';
import GenerateMockDataButton from './components/GenerateMockDataButton';
import { fetchConversations, fetchConversation } from './lib/api-client';

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mockDataGenerated, setMockDataGenerated] = useState(false);
  
  const searchParams = useSearchParams();
  const conversationId = searchParams?.get('conversation');

  // Check if mock data has been generated
  useEffect(() => {
    try {
      const hasGeneratedData = localStorage.getItem('mockDataGenerated') === 'true';
      if (hasGeneratedData) {
        setMockDataGenerated(true);
      }
    } catch (error) {
      console.error('Error checking localStorage:', error);
    }
  }, []);

  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      try {
        setLoading(true);
        const data = await fetchConversations();
        setConversations(data);
        
        // If conversationId is provided in URL, select that conversation
        if (conversationId) {
          const conversation = await fetchConversation(conversationId);
          if (conversation) {
            setSelectedConversation(conversation);
          }
        } else if (data.length > 0) {
          // Otherwise select the first conversation
          setSelectedConversation(data[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading conversations:', error);
        setError('Failed to load conversations');
        setLoading(false);
      }
    }

    loadConversations();
  }, [conversationId]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleMockDataSuccess = () => {
    setMockDataGenerated(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Instagram DM Dashboard</h1>
        <div className="flex space-x-4">
          <Link 
            href="/customers" 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            View Customers
          </Link>
          <Link 
            href="/settings" 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Settings
          </Link>
          <GenerateMockDataButton onSuccess={handleMockDataSuccess} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading conversations...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{error}</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
          <p className="font-bold">No conversations found</p>
          <p>
            {!mockDataGenerated 
              ? 'Generate mock data to get started' 
              : 'No conversations available. Try generating more mock data.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-4 rounded-lg border border-gray-200 overflow-auto">
            <ConversationList
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?.id}
            />
          </div>
          <div className="md:col-span-2 bg-white p-4 rounded-lg border border-gray-200 overflow-auto">
            {selectedConversation ? (
              <ConversationView conversation={selectedConversation} />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                Select a conversation to view
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
