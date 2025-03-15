'use client';

import React, { useState, useEffect } from 'react';
import { fetchMessages, fetchLatestAIResponse, generateAIResponse, sendMessage } from '../../lib/api-client';
import { Message, AIResponse } from '../../types';

interface ConversationViewProps {
  conversationId: string;
}

export default function ConversationView({ conversationId }: ConversationViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true);
        const response = await fetch(`/api/instagram/conversations/${conversationId}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMessages(data.messages || []);
        setIsMockData(data.is_mock || false);
        
        if (data.error) {
          console.warn('API warning:', data.error);
        }
        
        // Get the latest AI response
        const latestResponse = await fetchLatestAIResponse(conversationId);
        setAIResponse(latestResponse);
        
        setError(null);
      } catch (err) {
        console.error('Error loading messages:', err);
        setError('メッセージの読み込み中にエラーが発生しました。');
        
        // Fallback to client-side mock data
        const mockData = await fetchMessages(conversationId);
        setMessages(mockData);
        setIsMockData(true);
      } finally {
        setLoading(false);
      }
    }

    if (conversationId) {
      loadMessages();
    }
  }, [conversationId]);

  const handleGenerateResponse = async (messageId: string, messageText: string) => {
    try {
      const response = await generateAIResponse(conversationId, messageId, messageText);
      setAIResponse(response);
    } catch (err) {
      console.error('Error generating AI response:', err);
      setError('AI応答の生成中にエラーが発生しました。');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;
    
    try {
      setSendingMessage(true);
      
      // Get the recipient ID from the first message
      const recipientId = messages.length > 0 && messages[0].is_from_instagram 
        ? messages[0].sender_id 
        : conversationId;
      
      await sendMessage(conversationId, recipientId, newMessage);
      
      // Add the message to the local state
      const newMsg: Message = {
        id: `local-${Date.now()}`,
        sender_id: 'business',
        recipient_id: recipientId,
        text: newMessage,
        timestamp: new Date().toISOString(),
        is_from_instagram: false
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage('');
      setAIResponse(null);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('メッセージの送信中にエラーが発生しました。');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendAIResponse = async () => {
    if (!aiResponse) return;
    
    setNewMessage(aiResponse.suggested_response);
    setAIResponse(null);
  };

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
    <div className="flex flex-col h-full">
      {isMockData && (
        <div className="p-2 bg-yellow-50 text-yellow-700 text-sm text-center">
          <p>モックデータを表示中 - API接続に問題があります</p>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">メッセージがありません</div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id}
              className={`max-w-[80%] p-3 rounded-lg ${
                message.is_from_instagram 
                  ? 'bg-gray-100 self-start' 
                  : 'bg-blue-100 self-end ml-auto'
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleString('ja-JP', {
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              
              {message.is_from_instagram && (
                <button
                  onClick={() => handleGenerateResponse(message.id, message.text)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  AI応答を生成
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      {aiResponse && (
        <div className="border-t p-4">
          <h3 className="font-medium text-sm text-gray-700 mb-2">AI生成応答:</h3>
          <div className="bg-green-50 p-3 rounded-lg">
            <p>{aiResponse.suggested_response}</p>
          </div>
          <div className="mt-2 flex justify-end">
            <button 
              onClick={handleSendAIResponse}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              この応答を使用
            </button>
          </div>
        </div>
      )}
      
      <div className="border-t p-4">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={sendingMessage || !newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition disabled:opacity-50"
          >
            {sendingMessage ? '送信中...' : '送信'}
          </button>
        </div>
      </div>
    </div>
  );
}
