'use client';

import React from 'react';
import ConversationList from '../components/conversations/ConversationList';

export default function ConversationsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold p-6 border-b">会話一覧</h2>
        <ConversationList />
      </div>
    </div>
  );
}
