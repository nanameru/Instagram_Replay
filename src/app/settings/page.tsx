'use client';

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [useRealApi, setUseRealApi] = useState(false);
  const [apiStatus, setApiStatus] = useState<{
    profile: boolean;
    messages: boolean;
    conversations: boolean;
  }>({
    profile: false,
    messages: false,
    conversations: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load setting from localStorage on component mount
    const savedSetting = localStorage.getItem('useRealApi');
    if (savedSetting) {
      setUseRealApi(savedSetting === 'true');
    }
    
    // Test API endpoints
    testApiEndpoints();
  }, []);

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setUseRealApi(newValue);
    localStorage.setItem('useRealApi', newValue.toString());
    
    // Test API endpoints after toggle
    testApiEndpoints();
  };

  const testApiEndpoints = async () => {
    setIsLoading(true);
    
    try {
      // Test profile endpoint
      const profileResponse = await fetch('/api/instagram/profile');
      const profileData = await profileResponse.json();
      setApiStatus(prev => ({ ...prev, profile: profileResponse.ok }));
      
      // Test messages endpoint
      const messagesResponse = await fetch('/api/instagram/messages');
      const messagesData = await messagesResponse.json();
      setApiStatus(prev => ({ ...prev, messages: messagesResponse.ok }));
      
      // Test conversations endpoint
      const conversationsResponse = await fetch('/api/instagram/conversations');
      const conversationsData = await conversationsResponse.json();
      setApiStatus(prev => ({ ...prev, conversations: conversationsResponse.ok }));
    } catch (error) {
      console.error('Error testing API endpoints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">設定</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API設定</h2>
        
        <div className="flex items-center mb-4">
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={useRealApi}
              onChange={handleToggleChange}
              disabled={isLoading}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900">
              {useRealApi ? '実際のAPIを使用' : 'モックデータを使用'}
            </span>
          </label>
          {isLoading && (
            <div className="ml-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          {useRealApi 
            ? 'InstagramのAPIから実際のデータを取得します。' 
            : 'モックデータを使用してアプリケーションをテストします。'}
        </p>
        
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">API接続ステータス:</h3>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${apiStatus.profile ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Instagram プロフィールAPI: {apiStatus.profile ? '接続成功' : '接続失敗'}</span>
            </li>
            <li className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${apiStatus.messages ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Instagram メッセージAPI: {apiStatus.messages ? '接続成功' : '接続失敗'}</span>
            </li>
            <li className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${apiStatus.conversations ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Instagram 会話API: {apiStatus.conversations ? '接続成功' : '接続失敗'}</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">環境変数</h2>
        <p className="text-sm text-gray-600 mb-2">
          以下の環境変数が設定されています:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>INSTAGRAM_ACCESS_TOKEN: {process.env.INSTAGRAM_ACCESS_TOKEN ? '設定済み' : '未設定'}</li>
          <li>INSTAGRAM_APP_TOKEN: {process.env.INSTAGRAM_APP_TOKEN ? '設定済み' : '未設定'}</li>
          <li>OPENAI_API_KEY: {process.env.OPENAI_API_KEY ? '設定済み' : '未設定'}</li>
        </ul>
      </div>
    </div>
  );
}
