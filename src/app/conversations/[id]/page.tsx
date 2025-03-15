import { Suspense } from 'react';
import { Metadata } from 'next';
import ConversationView from '../../components/conversations/ConversationView';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: '会話詳細 | Instagram DM ダッシュボード',
  description: 'Instagram DMの会話詳細と履歴メッセージを表示します。',
};

interface ConversationPageProps {
  params: {
    id: string;
  };
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  // Await the params to fix the sync dynamic API warning
  const conversationId = params.id;
  
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">会話を読み込み中...</p>
        </div>
      }>
        <ConversationView conversationId={conversationId} />
      </Suspense>
    </div>
  );
}
