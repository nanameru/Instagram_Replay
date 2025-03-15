'use client';

import React, { useState, useEffect } from 'react';
import ConversationList from './components/conversations/ConversationList';
import CustomerList from './components/customers/CustomerList';
import { generateMockData } from './lib/api-client';

export default function HomePage() {
  const [useRealApi, setUseRealApi] = useState(false);
  const [generatingData, setGeneratingData] = useState(false);
  const [dataGenerated, setDataGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load settings from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSetting = localStorage.getItem('useRealApi');
      if (savedSetting) {
        setUseRealApi(savedSetting === 'true');
      }
    }
  }, []);

  const handleGenerateMockData = async () => {
    try {
      setGeneratingData(true);
      setError(null);
      
      const result = await generateMockData(5, 10);
      
      setDataGenerated(true);
      setTimeout(() => setDataGenerated(false), 3000);
    } catch (err) {
      console.error('Error generating mock data:', err);
      setError('モックデータの生成中にエラーが発生しました。');
    } finally {
      setGeneratingData(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">最近の会話</h2>
              <a href="/conversations" className="text-blue-600 hover:text-blue-800 text-sm">
                すべて表示
              </a>
            </div>
            <ConversationList />
          </div>
          
          {!useRealApi && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">モックデータ生成</h2>
              <p className="text-sm text-gray-600 mb-4">
                テスト用のモックデータを生成します。これは実際のInstagram DMデータではありません。
              </p>
              
              <button
                onClick={handleGenerateMockData}
                disabled={generatingData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {generatingData ? 'データ生成中...' : 'モックデータを生成'}
              </button>
              
              {dataGenerated && (
                <div className="mt-2 p-2 bg-green-50 text-green-700 text-sm rounded">
                  モックデータが正常に生成されました。
                </div>
              )}
              
              {error && (
                <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <div className="bg-white shadow rounded-lg">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">顧客一覧</h2>
              <a href="/customers" className="text-blue-600 hover:text-blue-800 text-sm">
                すべて表示
              </a>
            </div>
            <CustomerList />
          </div>
        </div>
      </div>
    </div>
  );
}
