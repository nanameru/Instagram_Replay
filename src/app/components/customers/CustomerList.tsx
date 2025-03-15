'use client';

import React, { useEffect, useState } from 'react';
import { fetchCustomers, generateMockData } from '../../lib/api-client';
import { Customer } from '../../types';

interface CustomerListProps {
  onSelectCustomer: (customer: Customer) => void;
  selectedCustomerId?: string | null;
}

export default function CustomerList({
  onSelectCustomer,
  selectedCustomerId,
}: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCustomers() {
      try {
        // Always try to load customers first
        const data = await fetchCustomers();
        console.log('Loaded customers:', data);
        
        // If no customers, generate mock data
        if (data.length === 0) {
          console.log('No customers found, generating mock data...');
          await generateMockData(5, 10);
          
          // Try loading again after generating
          const newData = await fetchCustomers();
          console.log('Loaded customers after generation:', newData);
          setCustomers(newData);
        } else {
          setCustomers(data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading customers:', error);
        setError('Failed to load customers');
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading customers...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (customers.length === 0) {
    return <div className="p-4 text-center">No customers found</div>;
  }

  return (
    <div className="space-y-2">
      {customers.map((customer) => (
        <div
          key={customer.id}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedCustomerId === customer.id
              ? 'bg-blue-100 border-blue-300'
              : 'hover:bg-gray-100 border-transparent'
          } border`}
          onClick={() => onSelectCustomer(customer)}
        >
          <div className="flex items-center">
            {customer.profile_picture_url && (
              <img
                src={customer.profile_picture_url}
                alt={customer.name}
                className="w-10 h-10 rounded-full mr-3"
              />
            )}
            <div>
              <div className="font-medium">{customer.name}</div>
              {customer.username && (
                <div className="text-sm text-gray-500">@{customer.username}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
