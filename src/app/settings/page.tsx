'use client';

import React, { useState, useEffect } from 'react';
import { toggleUseRealApi, isUsingRealApi } from '../lib/api-client';

export default function SettingsPage() {
  const [useRealApi, setUseRealApi] = useState(false);
  const [apiStatus, setApiStatus] = useState({
    profile: { status: 'unknown', message: '確認中...' },
    conversations: { status: 'unknown', message: '確認中...' },
    messages: { status: 'unknown', message: '確認中...' }
  });
  const [envVars, setEnvVars] = useState({
    INSTAGRAM_ACCESS_TOKEN: '設定されていません',
    INSTAGRAM_APP_TOKEN: '設定されていません',
    OPENAI_API_KEY: '設定されていません'
  });

  // Initialize state from localStorage
  useEffect(() => {
    setUseRealApi(isUsingRealApi());
    checkApiStatus();
    checkEnvVars();
  }, []);

  // Function to check API status
  const checkApiStatus = async () => {
    // Check profile API
    try {
      const profileResponse = await fetch('/api/instagram/profile');
      const profileData = await profileResponse.json();
      
      setApiStatus(prev => ({
        ...prev,
        profile: {
          status: profileData.is_mock ? 'warning' : 'success',
          message: profileData.is_mock 
            ? 'モックデータを使用中' 
            : 'API接続成功',
          error: profileData.error
        }
      }));
    } catch (error) {
      setApiStatus(prev => ({
        ...prev,
        profile: {
          status: 'error',
          message: '接続エラー',
          error: error instanceof Error ? error.message : '不明なエラー'
        }
      }));
    }
    
    // Check conversations API
    try {
      const conversationsResponse = await fetch('/api/instagram/conversations');
      const conversationsData = await conversationsResponse.json();
      
      setApiStatus(prev => ({
        ...prev,
        conversations: {
          status: conversationsData.is_mock ? 'warning' : 'success',
          message: conversationsData.is_mock 
            ? 'モックデータを使用中' 
            : 'API接続成功',
          error: conversationsData.error
        }
      }));
    } catch (error) {
      setApiStatus(prev => ({
        ...prev,
        conversations: {
          status: 'error',
          message: '接続エラー',
          error: error instanceof Error ? error.message : '不明なエラー'
        }
      }));
    }
    
    // Check messages API
    try {
      const messagesResponse = await fetch('/api/instagram/messages');
      const messagesData = await messagesResponse.json();
      
      setApiStatus(prev => ({
        ...prev,
        messages: {
          status: messagesData.is_mock ? 'warning' : 'success',
          message: messagesData.is_mock 
            ? 'モックデータを使用中' 
            : 'API接続成功',
          error: messagesData.error
        }
      }));
    } catch (error) {
      setApiStatus(prev => ({
        ...prev,
        messages: {
          status: 'error',
          message: '接続エラー',
          error: error instanceof Error ? error.message : '不明なエラー'
        }
      }));
    }
  };

  // Function to check environment variables
  const checkEnvVars = async () => {
    try {
      const response = await fetch('/api/env-check');
      const data = await response.json();
      
      setEnvVars({
        INSTAGRAM_ACCESS_TOKEN: data.INSTAGRAM_ACCESS_TOKEN 
          ? '設定済み' + (data.INSTAGRAM_ACCESS_TOKEN.length > 20 
              ? ` (${data.INSTAGRAM_ACCESS_TOKEN.substring(0, 10)}...${data.INSTAGRAM_ACCESS_TOKEN.substring(data.INSTAGRAM_ACCESS_TOKEN.length - 5)})` 
              : '')
          : '設定されていません',
        INSTAGRAM_APP_TOKEN: data.INSTAGRAM_APP_TOKEN 
          ? '設定済み' + (data.INSTAGRAM_APP_TOKEN.length > 20 
              ? ` (${data.INSTAGRAM_APP_TOKEN.substring(0, 10)}...${data.INSTAGRAM_APP_TOKEN.substring(data.INSTAGRAM_APP_TOKEN.length - 5)})` 
              : '')
          : '設定されていません',
        OPENAI_API_KEY: data.OPENAI_API_KEY 
          ? '設定済み' + (data.OPENAI_API_KEY.length > 20 
              ? ` (${data.OPENAI_API_KEY.substring(0, 10)}...${data.OPENAI_API_KEY.substring(data.OPENAI_API_KEY.length - 5)})` 
              : '')
          : '設定されていません'
      });
    } catch (error) {
      console.error('Error checking environment variables:', error);
    }
  };

  // Handle toggle change
  const handleToggleChange = () => {
    const newValue = !useRealApi;
    setUseRealApi(newValue);
    toggleUseRealApi(newValue);
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">設定</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API設定</h2>
        
        <div className="flex items-center mb-6">
          <span className="mr-4">実際のInstagram APIを使用:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={useRealApi}
              onChange={handleToggleChange}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        <div className="mb-4">
          <button
            onClick={checkApiStatus}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            API接続状態を確認
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">プロフィールAPI</h3>
            <div className={`${getStatusColor(apiStatus.profile.status)}`}>
              {apiStatus.profile.message}
            </div>
            {apiStatus.profile.error && (
              <div className="text-sm text-gray-600 mt-1">
                エラー: {apiStatus.profile.error}
              </div>
            )}
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">会話API</h3>
            <div className={`${getStatusColor(apiStatus.conversations.status)}`}>
              {apiStatus.conversations.message}
            </div>
            {apiStatus.conversations.error && (
              <div className="text-sm text-gray-600 mt-1">
                エラー: {apiStatus.conversations.error}
              </div>
            )}
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">メッセージAPI</h3>
            <div className={`${getStatusColor(apiStatus.messages.status)}`}>
              {apiStatus.messages.message}
            </div>
            {apiStatus.messages.error && (
              <div className="text-sm text-gray-600 mt-1">
                エラー: {apiStatus.messages.error}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">環境変数</h2>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Instagram アクセストークン</h3>
            <div className="text-gray-700">{envVars.INSTAGRAM_ACCESS_TOKEN}</div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Instagram アプリトークン</h3>
            <div className="text-gray-700">{envVars.INSTAGRAM_APP_TOKEN}</div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">OpenAI APIキー</h3>
            <div className="text-gray-700">{envVars.OPENAI_API_KEY}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
