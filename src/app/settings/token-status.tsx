'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

interface TokenInfo {
  status: 'valid' | 'expired' | 'invalid' | 'error';
  expires_at?: string | null;
  scopes?: string[];
  error?: string;
  code?: number;
  renewal_guide?: string;
}

export default function TokenStatus() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchTokenStatus() {
      try {
        const response = await fetch('/api/instagram/token-status');
        const data = await response.json();
        
        setTokenInfo(data);
      } catch (error) {
        console.error('Error fetching token status:', error);
        setTokenInfo({
          status: 'error',
          error: 'トークン状態の確認中にエラーが発生しました'
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchTokenStatus();
  }, []);
  
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-4">
            <div className="animate-pulse h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!tokenInfo) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6">
          <div className="text-red-600">
            トークン情報を取得できませんでした。
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={tokenInfo.status === 'valid' ? 'border-green-200' : 'border-amber-200'}>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">トークンステータス</h3>
            <StatusBadge status={tokenInfo.status} />
          </div>
          
          {tokenInfo.expires_at && (
            <div className="text-sm">
              <span className="text-muted-foreground">有効期限:</span>{' '}
              {new Date(tokenInfo.expires_at).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
          
          {tokenInfo.scopes && tokenInfo.scopes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">権限:</h4>
              <div className="flex flex-wrap gap-2">
                {tokenInfo.scopes.map((scope) => (
                  <Badge key={scope} variant="outline" className="text-xs">
                    {scope}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {tokenInfo.error && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
              <p className="font-medium">エラー:</p>
              <p>{tokenInfo.error}</p>
              {tokenInfo.code && <p className="text-xs mt-1">コード: {tokenInfo.code}</p>}
            </div>
          )}
          
          {(tokenInfo.status === 'expired' || tokenInfo.status === 'invalid') && (
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/settings/token-renewal'}
              >
                トークン更新ページへ
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'valid':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">有効</Badge>;
    case 'expired':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">期限切れ</Badge>;
    case 'invalid':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">無効</Badge>;
    case 'error':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">エラー</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">不明</Badge>;
  }
}
