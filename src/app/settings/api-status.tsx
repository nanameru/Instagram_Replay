'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ApiStatus {
  status: string;
  profile: {
    available: boolean;
    data: any;
    error: any;
  };
  conversations: {
    available: boolean;
    data: any;
    error: any;
  };
  token_type: string;
  has_instagram_business_account: boolean;
  has_read_mailbox_permission: boolean;
}

export default function ApiStatusCard() {
  const [status, setStatus] = useState<ApiStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/instagram/status');
      
      if (!response.ok) {
        throw new Error(`API status check failed: ${response.status}`);
      }
      
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'APIステータスの確認中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiStatus();
  }, []);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Instagram API ステータス</CardTitle>
          <CardDescription>APIの接続状態を確認しています...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Instagram API ステータス</CardTitle>
          <CardDescription>APIの接続状態を確認できませんでした</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-destructive mb-4">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
          <Button onClick={fetchApiStatus}>再試行</Button>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Instagram API ステータス
          <Button variant="outline" size="sm" onClick={fetchApiStatus}>更新</Button>
        </CardTitle>
        <CardDescription>APIの接続状態と権限の確認</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="font-medium">トークンタイプ</div>
              <div className="flex items-center gap-2">
                <Badge variant={status.token_type === 'page_access_token' ? 'default' : 'outline'}>
                  {status.token_type === 'page_access_token' ? 'ページアクセストークン' : 'ユーザートークン'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="font-medium">ビジネスアカウント</div>
              <div className="flex items-center gap-2">
                {status.has_instagram_business_account ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>連携済み</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-amber-500" />
                    <span>未連携</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="font-medium">プロフィール情報</div>
              <div className="flex items-center gap-2">
                {status.profile.available ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>アクセス可能</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span>アクセス不可</span>
                  </>
                )}
              </div>
              {status.profile.data && (
                <div className="text-sm text-muted-foreground">
                  ID: {status.profile.data.id}<br />
                  名前: {status.profile.data.name}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="font-medium">DM (会話)</div>
              <div className="flex items-center gap-2">
                {status.has_read_mailbox_permission ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>アクセス可能</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span>アクセス不可 (read_mailbox権限が必要)</span>
                  </>
                )}
              </div>
              {status.conversations.data && (
                <div className="text-sm text-muted-foreground">
                  会話数: {status.conversations.data.count}
                </div>
              )}
            </div>
          </div>

          {(!status.profile.available || !status.has_read_mailbox_permission) && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
              <h4 className="font-medium mb-1">注意事項</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                {!status.profile.available && (
                  <li>プロフィール情報にアクセスできません。トークンを確認してください。</li>
                )}
                {!status.has_read_mailbox_permission && (
                  <li>DMにアクセスするには、read_mailbox権限が必要です。Facebookアプリレビューを通じて権限を取得してください。</li>
                )}
                {!status.has_instagram_business_account && (
                  <li>ビジネスアカウントが連携されていません。ビジネス機能を利用するには、Instagramビジネスアカウントを連携してください。</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
