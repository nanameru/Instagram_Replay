'use client';

import React, { useState, useEffect } from 'react';

// Default API keys from environment variables - using placeholders for security
const DEFAULT_INSTAGRAM_TOKEN = 'INSTAGRAM_TOKEN_PLACEHOLDER';
const DEFAULT_OPENAI_KEY = 'OPENAI_KEY_PLACEHOLDER';

export default function SettingsPage() {
  const [instagramToken, setInstagramToken] = useState(DEFAULT_INSTAGRAM_TOKEN);
  const [openaiKey, setOpenaiKey] = useState(DEFAULT_OPENAI_KEY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showInstagramToken, setShowInstagramToken] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setMessage(null);
      
      // In a real app, this would save to a backend
      // For now, just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Settings saved successfully' });
      setSaving(false);
    } catch {
      setMessage({ type: 'error', text: 'Failed to save settings' });
      setSaving(false);
    }
  };

  const toggleInstagramTokenVisibility = () => {
    setShowInstagramToken(!showInstagramToken);
  };

  const toggleOpenaiKeyVisibility = () => {
    setShowOpenaiKey(!showOpenaiKey);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
        <p className="font-bold">Default API Keys Configured</p>
        <p>The application is pre-configured with default API keys for demonstration purposes.</p>
      </div>
      
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">API Credentials</h2>
          
          <div className="space-y-2">
            <label htmlFor="instagram-token" className="block text-sm font-medium text-gray-700">
              Instagram Access Token
            </label>
            <div className="relative">
              <input
                type={showInstagramToken ? "text" : "password"}
                id="instagram-token"
                value={instagramToken}
                onChange={(e) => setInstagramToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                placeholder="Enter your Instagram access token"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleInstagramTokenVisibility}
              >
                {showInstagramToken ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Default token is already configured for demonstration
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="openai-key" className="block text-sm font-medium text-gray-700">
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                type={showOpenaiKey ? "text" : "password"}
                id="openai-key"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                placeholder="Enter your OpenAI API key"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleOpenaiKeyVisibility}
              >
                {showOpenaiKey ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Default key is already configured for demonstration
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Webhook Configuration</h2>
          <div className="bg-gray-100 p-4 rounded-md">
            <p className="text-sm text-gray-700 mb-2">Webhook URL:</p>
            <code className="block p-2 bg-gray-800 text-white rounded text-sm overflow-auto">
              {typeof window !== 'undefined' ? `${window.location.origin}/api/instagram` : 'Loading...'}
            </code>
            <p className="text-xs text-gray-500 mt-2">
              Use this URL in your Instagram app webhook settings
            </p>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
