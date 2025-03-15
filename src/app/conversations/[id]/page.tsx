'use client';

import React from 'react';
import ConversationView from '../../components/conversations/ConversationView';
import { useParams } from 'next/navigation';

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = params?.id as string;

  if (!conversationId) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center text-red-500">
        会話IDが見つかりません。
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg h-[calc(100vh-12rem)]">
        <h2 className="text-xl font-semibold p-6 border-b">会話詳細</h2>
        <div className="h-[calc(100%-4rem)]">
          <ConversationView conversationId={conversationId} />
        </div>
      </div>
    </div>
  );
}
