'use client';

import React, { useState, useEffect } from 'react';

interface EnvStatus {
  configured: boolean;
  value: string | null;
}

interface EnvStatusResponse {
  instagram_access_token: EnvStatus;
  instagram_app_token: EnvStatus;
  openai_api_key: EnvStatus;
}

export default function SettingsPage() {
  const [useRealApi, setUseRealApi] = useState(false);
  const [envStatus, setEnvStatus] = useState<EnvStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiTestResult, setApiTestResult] = useState<{
    profile: boolean;
    conversations: boolean;
    messages: boolean;
  } | null>(null);

  // Load settings from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSetting = localStorage.getItem('useRealApi');
      if (savedSetting) {
        setUseRealApi(savedSetting === 'true');
      }
    }
  }, []);

  // Fetch environment status
  useEffect(() => {
    async function fetchEnvStatus() {
      try {
        setLoading(true);
        const response = await fetch('/api/env-check');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        setEnvStatus(data.env_status);
        setError(null);
      } catch (err) {
        console.error('Error fetching environment status:', err);
        setError('環境変数の確認中にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    }

    fetchEnvStatus();
  }, []);

  // Handle toggle change
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setUseRealApi(newValue);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('useRealApi', newValue.toString());
    }
  };

  // Test API connections
  const testApiConnections = async () => {
    try {
      setLoading(true);
      
      // Test profile API
      let profileSuccess = false;
      try {
        const profileResponse = await fetch('/api/instagram/profile');
        profileSuccess = profileResponse.ok;
      } catch (err) {
        console.error('Profile API test failed:', err);
      }
      
      // Test conversations API
      let conversationsSuccess = false;
      try {
        const conversationsResponse = await fetch('/api/instagram/conversations');
        conversationsSuccess = conversationsResponse.ok;
      } catch (err) {
        console.error('Conversations API test failed:', err);
      }
      
      // Test messages API
      let messagesSuccess = false;
      try {
        const messagesResponse = await fetch('/api/instagram/messages');
        messagesSuccess = messagesResponse.ok;
      } catch (err) {
        console.error('Messages API test failed:', err);
      }
      
      setApiTestResult({
        profile: profileSuccess,
        conversations: conversationsSuccess,
        messages: messagesSuccess
      });
      
    } catch (err) {
      console.error('API test failed:', err);
      setError('API接続テスト中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !envStatus) {
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API設定</h2>
        
        {error && (
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <label htmlFor="api-toggle" className="font-medium text-gray-700">
              実際のAPIを使用する
            </label>
            <div className="relative inline-block w-12 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="api-toggle"
                checked={useRealApi}
                onChange={handleToggleChange}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="api-toggle"
                className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                  useRealApi ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              ></label>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {useRealApi
              ? 'Instagram APIから実際のデータを取得します。'
              : 'モックデータを使用します。'}
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">環境変数ステータス</h3>
          {envStatus ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-sm font-medium text-gray-500">Instagram Access Token</p>
                  <p className={`text-sm ${envStatus.instagram_access_token.configured ? 'text-green-600' : 'text-red-600'}`}>
                    {envStatus.instagram_access_token.configured ? '設定済み' : '未設定'}
                  </p>
                  {envStatus.instagram_access_token.value && (
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {envStatus.instagram_access_token.value}
                    </p>
                  )}
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-sm font-medium text-gray-500">Instagram App Token</p>
                  <p className={`text-sm ${envStatus.instagram_app_token.configured ? 'text-green-600' : 'text-red-600'}`}>
                    {envStatus.instagram_app_token.configured ? '設定済み' : '未設定'}
                  </p>
                  {envStatus.instagram_app_token.value && (
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {envStatus.instagram_app_token.value}
                    </p>
                  )}
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-sm font-medium text-gray-500">OpenAI API Key</p>
                  <p className={`text-sm ${envStatus.openai_api_key.configured ? 'text-green-600' : 'text-red-600'}`}>
                    {envStatus.openai_api_key.configured ? '設定済み' : '未設定'}
                  </p>
                  {envStatus.openai_api_key.value && (
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      {envStatus.openai_api_key.value}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">環境変数情報を取得できませんでした。</p>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">API接続テスト</h3>
          <button
            onClick={testApiConnections}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? '接続テスト中...' : 'API接続をテスト'}
          </button>
          
          {apiTestResult && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">プロフィールAPI</p>
                  <p className={`text-sm ${apiTestResult.profile ? 'text-green-600' : 'text-red-600'}`}>
                    {apiTestResult.profile ? '成功' : '失敗'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">会話API</p>
                  <p className={`text-sm ${apiTestResult.conversations ? 'text-green-600' : 'text-red-600'}`}>
                    {apiTestResult.conversations ? '成功' : '失敗'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">メッセージAPI</p>
                  <p className={`text-sm ${apiTestResult.messages ? 'text-green-600' : 'text-red-600'}`}>
                    {apiTestResult.messages ? '成功' : '失敗'}
                  </p>
                </div>
              </div>
              
              {(!apiTestResult.profile || !apiTestResult.conversations || !apiTestResult.messages) && (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 text-sm rounded">
                  <p>一部のAPIテストが失敗しました。これは権限の問題である可能性があります。</p>
                  <p className="mt-1">アプリケーションはモックデータにフォールバックします。</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">アプリケーション情報</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm font-medium text-gray-500">アプリケーション名</p>
            <p className="text-sm">Instagram DM ダッシュボード</p>
          </div>
          
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm font-medium text-gray-500">バージョン</p>
            <p className="text-sm">1.0.0</p>
          </div>
          
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">説明</p>
            <p className="text-sm">
              InstagramのDMを管理し、AIを使用して返信を生成するダッシュボードアプリケーションです。
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #3b82f6;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #3b82f6;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #ccc;
          transition: all 0.3s;
        }
        .toggle-label {
          transition: all 0.3s;
        }
      `}</style>
    </div>
  );
}
