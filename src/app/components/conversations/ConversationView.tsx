'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Loader2, ArrowLeft, Send } from 'lucide-react';
import MessageHistory from './MessageHistory';

interface ConversationViewProps {
  conversationId: string;
}

export default function ConversationView({ conversationId }: ConversationViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Fetch conversation details
  useEffect(() => {
    async function fetchConversation() {
      if (!conversationId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch profile ID
        const profileResponse = await fetch('/api/instagram/profile');
        const profileData = await profileResponse.json();
        
        if (profileResponse.ok && profileData.id) {
          setProfileId(profileData.id);
        }
        
        // Fetch conversation details
        const response = await fetch(`/api/instagram/conversations/${conversationId}`);
        
        if (!response.ok) {
          throw new Error(`会話の取得に失敗しました: ${response.status}`);
        }
        
        const data = await response.json();
        setConversation(data);
        
      } catch (error) {
        console.error('Error fetching conversation:', error);
        setError(error instanceof Error ? error.message : '会話の取得中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }
    
    fetchConversation();
  }, [conversationId]);
  
  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;
    
    try {
      setSendingMessage(true);
      
      const response = await fetch('/api/instagram/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: newMessage.trim()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`メッセージの送信に失敗しました: ${response.status}`);
      }
      
      // Clear the input field
      setNewMessage('');
      
      // Refresh the conversation (in a real app, you might want to just append the new message)
      const conversationResponse = await fetch(`/api/instagram/conversations/${conversationId}`);
      const conversationData = await conversationResponse.json();
      setConversation(conversationData);
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error instanceof Error ? error.message : 'メッセージの送信中にエラーが発生しました');
    } finally {
      setSendingMessage(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">会話を読み込み中...</p>
      </div>
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
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  戻る
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                >
                  再試行
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!conversation) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <h3 className="font-medium text-lg mb-2">会話が見つかりません</h3>
            <p className="text-sm text-muted-foreground">
              指定された会話が見つかりませんでした。
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
            <CardTitle className="text-lg">
              {conversation.participants?.data?.[0]?.name || '会話'}
            </CardTitle>
            <Badge variant="outline">
              Instagram DM
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4">
          <MessageHistory 
            conversationId={conversationId} 
            profileId={profileId || undefined} 
          />
        </CardContent>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="メッセージを入力..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button 
              onClick={sendMessage} 
              disabled={!newMessage.trim() || sendingMessage}
            >
              {sendingMessage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  送信
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
