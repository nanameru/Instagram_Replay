'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, AlertCircle, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  from: {
    id: string;
    name?: string;
  };
  message: string;
  created_time: string;
}

interface MessageHistoryProps {
  conversationId: string;
  profileId?: string;
}

export default function MessageHistory({ conversationId, profileId }: MessageHistoryProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Format date in Japanese locale
  const formatMessageDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy年MM月dd日 HH:mm', { locale: ja });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Use the correct API endpoint for historical messages
      const response = await fetch(`/api/instagram/historical-messages?conversation_id=${conversationId}&limit=20`);
      
      if (!response.ok) {
        throw new Error(`メッセージの取得に失敗しました: ${response.status}`);
      }
      
      const data = await response.json();
      
      setMessages(data.messages || []);
      setIsMockData(data.is_mock || false);
      setHasMore(!!(data.pagination && data.pagination.next));
      setNextPageToken(data.pagination?.next || null);
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(error instanceof Error ? error.message : 'メッセージの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);
  
  // Load more messages (older messages)
  const loadMoreMessages = async () => {
    if (!nextPageToken || loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      
      // Extract the URL parameters from the nextPageToken
      const url = new URL(nextPageToken, window.location.origin);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`過去のメッセージの取得に失敗しました: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Append older messages to the existing messages
      setMessages(prevMessages => [...prevMessages, ...(data.messages || [])]);
      setHasMore(!!(data.pagination && data.pagination.next));
      setNextPageToken(data.pagination?.next || null);
      
    } catch (error) {
      console.error('Error loading more messages:', error);
      setError(error instanceof Error ? error.message : '過去のメッセージの取得中にエラーが発生しました');
    } finally {
      setLoadingMore(false);
    }
  };
  
  // Scroll to bottom on initial load
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);
  
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      scrollToBottom();
    }
  }, [messages, loading]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">メッセージを読み込み中...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-destructive mb-1">エラーが発生しました</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => fetchMessages()}
              >
                再試行
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="font-medium text-lg mb-2">メッセージがありません</h3>
            <p className="text-sm text-muted-foreground">
              この会話にはまだメッセージがありません。
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {isMockData && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm mb-4">
          <p className="font-medium">モックデータを表示しています</p>
          <p className="text-xs mt-1">
            Instagram APIの権限制限により、実際のDMデータにアクセスできません。
            完全なDM履歴を取得するには、read_mailbox権限が必要です。
          </p>
        </div>
      )}
      
      {hasMore && (
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={loadMoreMessages}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                読み込み中...
              </>
            ) : (
              '過去のメッセージを読み込む'
            )}
          </Button>
        </div>
      )}
      
      <div className="space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.from.id === profileId ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] ${
                message.from.id === profileId 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              } rounded-lg px-4 py-2`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium">
                  {message.from.name || `ユーザー ${message.from.id}`}
                </span>
                {isMockData && (
                  <Badge variant="outline" className="text-[10px] h-4 px-1">
                    モック
                  </Badge>
                )}
              </div>
              <p className="whitespace-pre-wrap">{message.message}</p>
              <div className="text-xs opacity-70 mt-1 text-right">
                {formatMessageDate(message.created_time)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div ref={messagesEndRef} />
    </div>
  );
}
