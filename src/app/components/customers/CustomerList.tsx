'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchCustomers } from '../../lib/api-client';
import { Customer } from '../../types';

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      try {
        setLoading(true);
        const response = await fetch('/api/instagram/profile');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.profile) {
          setCustomers([data.profile]);
          setIsMockData(data.is_mock || false);
        } else {
          setCustomers([]);
        }
        
        if (data.error) {
          console.warn('API warning:', data.error);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading customers:', err);
        setError('顧客の読み込み中にエラーが発生しました。');
        
        // Fallback to client-side mock data
        const mockData = await fetchCustomers();
        setCustomers(mockData);
        setIsMockData(true);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
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
      
      {customers.length === 0 ? (
        <div className="p-4 text-center text-gray-500">顧客がありません</div>
      ) : (
        customers.map((customer) => (
          <Link 
            href={`/customers/${customer.id}`} 
            key={customer.id}
            className="block p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center">
              {customer.profile_picture_url && (
                <div className="mr-3">
                  <img 
                    src={customer.profile_picture_url} 
                    alt={customer.name} 
                    className="w-10 h-10 rounded-full"
                  />
                </div>
              )}
              <div>
                <h3 className="font-medium">{customer.name}</h3>
                {customer.username && (
                  <p className="text-sm text-gray-500">@{customer.username}</p>
                )}
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
