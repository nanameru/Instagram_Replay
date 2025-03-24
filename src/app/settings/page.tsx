import React from 'react';
import { Metadata } from 'next';
import ApiStatus from './api-status';
import TokenStatus from './token-status';

export const metadata: Metadata = {
  title: '設定 | Instagram DM ダッシュボード',
  description: 'Instagram DMダッシュボードの設定とAPI接続状態',
};

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">設定</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">API接続状態</h2>
          <ApiStatus />
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-4">アクセストークン</h2>
          <div className="mb-4">
            <TokenStatus />
          </div>
          <p className="text-muted-foreground mb-4">
            Instagram APIアクセストークンは環境変数として設定されています。
            トークンを更新するには、<code>.env.local</code>ファイルを編集するか、トークン更新ページを使用してください。
          </p>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm font-mono">
              # .env.local ファイル<br />
              INSTAGRAM_ACCESS_TOKEN=your_token_here
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            詳細な手順は<a href="/settings/permissions" className="text-primary underline">権限設定ガイド</a>を参照してください。
            トークンが期限切れの場合は<a href="/settings/token-renewal" className="text-primary underline">トークン更新ページ</a>にアクセスしてください。
          </p>
        </section>
      </div>
    </div>
  );
}
