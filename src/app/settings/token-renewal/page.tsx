'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import React from 'react';

export default function TokenRenewalPage() {
  const [newToken, setNewToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleTokenUpdate = async () => {
    if (!newToken.trim()) {
      setError('トークンを入力してください');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await fetch('/api/instagram/update-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: newToken }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'トークンの更新に失敗しました');
      }
      
      setSuccess(true);
      // In a real app, we would update the token in the environment
    } catch (error) {
      setError(error instanceof Error ? error.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Instagram アクセストークンの更新</CardTitle>
          <CardDescription>
            アクセストークンが期限切れになった場合、新しいトークンを取得して更新してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-sm flex items-start gap-2">
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800 text-sm flex items-start gap-2">
              <p>トークンが正常に更新されました。アプリケーションを再起動して変更を適用してください。</p>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">新しいアクセストークン</h3>
            <Input
              value={newToken}
              onChange={(e) => setNewToken(e.target.value)}
              placeholder="EAAhYeSTN9z8BO..."
              className="font-mono text-sm"
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-800 text-sm">
            <h4 className="font-medium mb-1">トークンの取得方法</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Facebook for Developersにアクセス</li>
              <li>アプリを選択し、「ツール」→「Graph API Explorer」を開く</li>
              <li>「トークンを生成」ボタンをクリック</li>
              <li>必要な権限を選択（instagram_basic, instagram_manage_messagesなど）</li>
              <li>生成されたトークンをコピーして上記のフィールドに貼り付け</li>
            </ol>
            <p className="mt-2">
              詳細な手順は<a href="/TOKEN_RENEWAL_GUIDE.md" className="text-blue-600 underline">トークン更新ガイド</a>を参照してください。
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleTokenUpdate} 
            disabled={loading || !newToken.trim()}
            className="w-full"
          >
            {loading ? '更新中...' : 'トークンを更新'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
