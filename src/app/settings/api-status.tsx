'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

export default function ApiStatus() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchApiStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/instagram/status');
      
      if (!response.ok) {
        throw new Error(`API状態の取得に失敗しました: ${response.status}`);
      }
      
      const data = await response.json();
      setApiStatus(data);
    } catch (error) {
      console.error('Error fetching API status:', error);
      setError(error instanceof Error ? error.message : 'API状態の取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchApiStatus();
  }, []);
  
  const refreshStatus = async () => {
    setRefreshing(true);
    await fetchApiStatus();
    setRefreshing(false);
  };
  
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div>
              <h3 className="font-medium text-destructive mb-1">エラーが発生しました</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={refreshStatus}
              >
                再試行
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const tokenInfo = apiStatus?.token_info || {};
  const isTokenValid = tokenInfo.is_valid === true;
  const tokenExpiration = tokenInfo.expires_at ? new Date(tokenInfo.expires_at * 1000).toLocaleString('ja-JP') : '不明';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Instagram API 状態</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshStatus}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            更新
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">アクセストークン状態</h3>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={isTokenValid ? "default" : "destructive"}>
                {isTokenValid ? '有効' : '無効'}
              </Badge>
              {isTokenValid && (
                <span className="text-xs text-muted-foreground">
                  有効期限: {tokenExpiration}
                </span>
              )}
            </div>
            {!isTokenValid && tokenInfo.error && (
              <p className="text-xs text-destructive mt-1">
                エラー: {tokenInfo.error.message || JSON.stringify(tokenInfo.error)}
              </p>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">権限</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={apiStatus?.has_instagram_business_account ? "default" : "outline"}>
                  ビジネスアカウント
                </Badge>
                <span className="text-xs">
                  {apiStatus?.has_instagram_business_account ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={apiStatus?.has_read_mailbox_permission ? "default" : "outline"}>
                  read_mailbox
                </Badge>
                <span className="text-xs">
                  {apiStatus?.has_read_mailbox_permission ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>
          
          {!apiStatus?.has_read_mailbox_permission && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm">
              <p className="font-medium text-amber-800 mb-1">DMの完全な履歴を取得するには権限が必要です</p>
              <p className="text-amber-700">
                現在のトークンには<code>read_mailbox</code>権限がありません。
                この権限を取得するには、Facebookデベロッパーアカウントでアプリを作成し、
                権限をリクエストする必要があります。
              </p>
              <p className="text-amber-700 mt-2">
                詳細は<a href="/settings/permissions" className="underline">権限設定ガイド</a>を参照してください。
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
