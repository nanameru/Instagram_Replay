'use client';

import React, { useState, useEffect } from 'react';
import { fetchCustomer, fetchConversations } from '../../lib/api-client';
import { Customer, Conversation } from '../../types';
import Link from 'next/link';

interface CustomerDetailProps {
  customerId: string;
}

export default function CustomerDetail({ customerId }: CustomerDetailProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  useEffect(() => {
    async function loadCustomerData() {
      try {
        setLoading(true);
        
        // Fetch customer profile
        const response = await fetch('/api/instagram/profile');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.profile) {
          setCustomer(data.profile);
          setIsMockData(data.is_mock || false);
        } else {
          setCustomer(null);
        }
        
        // Fetch conversations for this customer
        const conversationsResponse = await fetch('/api/instagram/conversations');
        
        if (conversationsResponse.ok) {
          const conversationsData = await conversationsResponse.json();
          const customerConversations = (conversationsData.conversations || [])
            .filter((conv: Conversation) => conv.customer_id === customerId);
          
          setConversations(customerConversations);
          
          // If conversations is mock data but profile isn't, set isMockData to true
          if (conversationsData.is_mock && !data.is_mock) {
            setIsMockData(true);
          }
        } else {
          setConversations([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading customer data:', err);
        setError('顧客データの読み込み中にエラーが発生しました。');
        
        // Fallback to client-side mock data
        const mockCustomer = await fetchCustomer(customerId);
        setCustomer(mockCustomer);
        
        const mockConversations = await fetchConversations();
        const customerConversations = mockConversations
          .filter(conv => conv.customer_id === customerId);
        setConversations(customerConversations);
        
        setIsMockData(true);
      } finally {
        setLoading(false);
      }
    }

    if (customerId) {
      loadCustomerData();
    }
  }, [customerId]);

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4 mx-auto"></div>
        </div>
        <p className="text-gray-500 mt-2">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-4 text-center text-gray-500">
        顧客が見つかりませんでした。
      </div>
    );
  }

  return (
    <div>
      {isMockData && (
        <div className="p-2 bg-yellow-50 text-yellow-700 text-sm text-center mb-4">
          <p>モックデータを表示中 - API接続に問題があります</p>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center">
          {customer.profile_picture_url && (
            <div className="mr-4">
              <img 
                src={customer.profile_picture_url} 
                alt={customer.name} 
                className="w-16 h-16 rounded-full"
              />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">{customer.name}</h2>
            {customer.username && (
              <p className="text-gray-500">@{customer.username}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">会話履歴</h3>
        
        <div className="divide-y">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">会話がありません</div>
          ) : (
            conversations.map((conversation) => (
              <Link 
                href={`/conversations/${conversation.id}`} 
                key={conversation.id}
                className="block p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {conversation.last_message || '新しい会話'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {conversation.last_message_time && 
                        new Date(conversation.last_message_time).toLocaleString('ja-JP', {
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      }
                    </p>
                    {conversation.unread_count > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-600 text-white text-xs rounded-full">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
