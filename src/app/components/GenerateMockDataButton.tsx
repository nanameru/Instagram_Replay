'use client';

import React, { useState } from 'react';
import { generateMockData } from '../lib/api-client';

interface GenerateMockDataButtonProps {
  onSuccess?: () => void;
}

export default function GenerateMockDataButton({ onSuccess }: GenerateMockDataButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateMockData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use client-side mock data generation
      const result = await generateMockData(5, 10);
      console.log('Mock data generated:', result);
      
      // Store in localStorage to persist across page refreshes
      try {
        localStorage.setItem('mockDataGenerated', 'true');
      } catch (error) {
        console.error('Error setting localStorage:', error);
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Force a reload to show the data
      window.location.reload();
      
      setLoading(false);
    } catch (error) {
      console.error('Error generating mock data:', error);
      setError('Failed to generate mock data');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleGenerateMockData}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Mock Data'}
      </button>
      
      {error && (
        <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </>
  );
}
