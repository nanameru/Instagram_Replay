import { Suspense } from 'react';
import ConversationView from '@/app/components/conversations/ConversationView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '会話詳細 | Instagram DMダッシュボード',
  description: 'Instagram DMの会話詳細とAI生成レスポンス',
};

interface ConversationPageProps {
  params: {
    id: string;
  };
}

export default function ConversationPage({ params }: ConversationPageProps) {
  const { id } = params;
  
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<div>読み込み中...</div>}>
        <ConversationView conversationId={id} />
      </Suspense>
    </div>
  );
}
