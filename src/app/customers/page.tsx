'use client';

import React, { useState, useEffect } from 'react';
import CustomerList from '../components/customers/CustomerList';
import CustomerDetail from '../components/customers/CustomerDetail';
import { Customer, Conversation } from '../types';
import { useRouter } from 'next/navigation';
import GenerateMockDataButton from '../components/GenerateMockDataButton';

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [mockDataGenerated, setMockDataGenerated] = useState(false);
  const router = useRouter();

  // Check if mock data has been generated
  React.useEffect(() => {
    try {
      const hasGeneratedData = localStorage.getItem('mockDataGenerated') === 'true';
      if (hasGeneratedData) {
        setMockDataGenerated(true);
      }
    } catch (error) {
      console.error('Error checking localStorage:', error);
    }
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    router.push(`/?conversation=${conversation.id}`);
  };

  const handleMockDataSuccess = () => {
    setMockDataGenerated(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <GenerateMockDataButton onSuccess={handleMockDataSuccess} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded-lg border border-gray-200 overflow-auto">
          <CustomerList
            onSelectCustomer={setSelectedCustomer}
            selectedCustomerId={selectedCustomer?.id}
          />
        </div>
        <div className="md:col-span-2 bg-white p-4 rounded-lg border border-gray-200 overflow-auto">
          {selectedCustomer ? (
            <CustomerDetail 
              customer={selectedCustomer} 
              onSelectConversation={handleSelectConversation}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              {!mockDataGenerated ? 'Generate mock data to get started' : 'Select a customer to view details'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
