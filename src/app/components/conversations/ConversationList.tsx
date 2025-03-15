'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchConversations } from '../../lib/api-client';
import { Conversation } from '../../types';

export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  useEffect(() => {
    async function loadConversations() {
      try {
        setLoading(true);
        const data = await fetchConversations();
        setConversations(data);
        
        // Check if we're using mock data
        if (data && data.length > 0 && 'is_mock' in data[0]) {
          setIsMockData(data[0].is_mock as boolean);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError('会話の読み込み中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, []);

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

  return (
    <div className="divide-y">
      {isMockData && (
        <div className="p-2 bg-yellow-50 text-yellow-700 text-sm text-center">
          <p>モックデータを表示中 - API接続に問題があります</p>
        </div>
      )}
      
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
                <h3 className="font-medium">{conversation.customer_name}</h3>
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
  );
}
