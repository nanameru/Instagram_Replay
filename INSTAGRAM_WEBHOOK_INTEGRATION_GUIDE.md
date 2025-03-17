# Instagram Webhook 統合ガイド

## 概要

このガイドでは、Instagram DMダッシュボードアプリケーションにWebhookを統合して、リアルタイムでDMの通知を受け取る方法について説明します。Webhookを使用することで、過去のメッセージ取得に関するAPI制限を回避しながら、新しいメッセージをリアルタイムで処理することができます。

## Webhookの利点

1. **リアルタイム通知**: メッセージが送信されるとすぐに通知を受け取れます
2. **API制限の回避**: 過去のメッセージ取得に関するAPI制限を回避できます
3. **ユーザーエクスペリエンスの向上**: 即時応答によりユーザーエクスペリエンスが向上します
4. **サーバーリソースの効率化**: ポーリングではなくプッシュベースの通知を使用します

## 前提条件

- Instagramビジネスアカウント
- Facebookページとの連携
- Facebook開発者アカウント
- 公開アクセス可能なWebhookエンドポイント

## 実装手順

### 1. Webhookエンドポイントの作成

Next.jsアプリケーションにWebhookエンドポイントを作成します：

```javascript
// src/app/api/instagram/webhook/route.js

// Webhook検証エンドポイント (GET)
export async function GET(req) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  
  // 検証トークンを確認
  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
  
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified successfully');
    return new Response(challenge);
  } else {
    console.error('Webhook verification failed');
    return new Response('Verification failed', { status: 403 });
  }
}

// Webhookイベントハンドラ (POST)
export async function POST(req) {
  try {
    const body = await req.json();
    
    // Webhookイベントを処理
    if (body.object === 'instagram' && body.entry && body.entry.length > 0) {
      for (const entry of body.entry) {
        // メッセージングイベントを処理
        if (entry.messaging && entry.messaging.length > 0) {
          for (const messagingEvent of entry.messaging) {
            // バックグラウンドでメッセージを処理
            processMessageInBackground(messagingEvent);
          }
        }
      }
    }
    
    // 受信確認のために即座に成功レスポンスを返す
    return Response.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

// バックグラウンドでメッセージを処理する関数
async function processMessageInBackground(messagingEvent) {
  try {
    const senderId = messagingEvent.sender.id;
    const message = messagingEvent.message;
    
    // メッセージをデータベースに保存
    await saveMessageToDatabase({
      senderId,
      text: message.text,
      timestamp: messagingEvent.timestamp,
      isFromCustomer: true
    });
    
    // AIレスポンスを生成
    const aiResponse = await generateAIResponse(message.text);
    
    // AIレスポンスをデータベースに保存
    await saveAIResponseToDatabase(senderId, aiResponse);
  } catch (error) {
    console.error('Error processing message in background:', error);
  }
}
```

### 2. 環境変数の設定

`.env.local`ファイルに以下の環境変数を追加します：

```
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=あなたの安全な検証トークン
INSTAGRAM_ACCESS_TOKEN=あなたのアクセストークン
```

### 3. Webhookを公開アクセス可能にする

Webhookエンドポイントは公開アクセス可能である必要があります：

1. アプリケーションをVercelなどにデプロイする
2. または開発中はngrokなどのトンネルサービスを使用する

```bash
# ngrokを使用してローカルサーバーを公開する例
ngrok http 3000
```

### 4. Facebook開発者ポータルでWebhookを設定

1. [Facebook開発者ポータル](https://developers.facebook.com/)にアクセス
2. アプリを選択
3. 「製品を追加」からWebhookを選択
4. 以下の情報を入力：
   - コールバックURL: `https://あなたのドメイン/api/instagram/webhook`
   - 検証トークン: `.env.local`に設定したのと同じトークン
   - サブスクリプションフィールド: `messages`を選択

### 5. ページへのWebhookサブスクリプション

APIを使用してページにWebhookをサブスクライブします：

```javascript
// src/app/api/instagram/subscribe-webhook/route.js
export async function POST(req) {
  try {
    const { pageId, accessToken } = await req.json();
    
    // ページにWebhookをサブスクライブ
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/subscribed_apps?subscribed_fields=messages&access_token=${accessToken}`,
      { method: 'POST' }
    );
    
    const data = await response.json();
    
    if (data.success) {
      return Response.json({ status: 'success' });
    } else {
      return Response.json({ status: 'error', details: data }, { status: 500 });
    }
  } catch (error) {
    console.error('Error subscribing webhook:', error);
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
```

### 6. フロントエンドでのWebhook設定UI

管理者がWebhookを設定できるUIを作成します：

```jsx
// src/app/settings/webhooks/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function WebhookSettingsPage() {
  const [pageId, setPageId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [status, setStatus] = useState('');
  
  async function handleSubscribe() {
    try {
      setStatus('Subscribing...');
      
      const response = await fetch('/api/instagram/subscribe-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, accessToken })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setStatus('Webhook subscribed successfully!');
      } else {
        setStatus(`Error: ${data.message || 'Failed to subscribe webhook'}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Webhook設定</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Webhookサブスクリプション</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">ページID</label>
              <input
                type="text"
                value={pageId}
                onChange={(e) => setPageId(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="ページIDを入力"
              />
            </div>
            
            <div>
              <label className="block mb-2">アクセストークン</label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="アクセストークンを入力"
              />
            </div>
            
            <Button onClick={handleSubscribe}>Webhookをサブスクライブ</Button>
            
            {status && (
              <div className={`mt-4 p-3 rounded ${status.includes('Error') ? 'bg-red-100' : 'bg-green-100'}`}>
                {status}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

## リアルタイム更新の実装

### 1. サーバー送信イベント（SSE）の実装

SSEを使用してダッシュボードをリアルタイムで更新します：

```javascript
// src/app/api/instagram/events/route.js
export async function GET(req) {
  const encoder = new TextEncoder();
  const customerId = new URL(req.url).searchParams.get('customerId');
  
  // SSEストリームを作成
  const stream = new ReadableStream({
    start(controller) {
      // 初期接続メッセージを送信
      const initialData = encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
      controller.enqueue(initialData);
      
      // 新しいメッセージをチェックするインターバルを設定
      const interval = setInterval(async () => {
        try {
          // 新しいメッセージをチェック
          const newMessages = await checkForNewMessages(customerId);
          
          if (newMessages.length > 0) {
            // 新しいメッセージがある場合、イベントを送信
            const data = encoder.encode(`data: ${JSON.stringify({ type: 'new_messages', messages: newMessages })}\n\n`);
            controller.enqueue(data);
          }
        } catch (error) {
          console.error('Error sending SSE:', error);
        }
      }, 5000);
      
      // クライアントが接続を閉じたときにインターバルをクリア
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
      });
    }
  });
  
  // SSEレスポンスを返す
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
```

### 2. フロントエンドでのSSE接続

```jsx
// src/app/components/conversations/ConversationView.tsx
'use client';

import { useEffect, useState } from 'react';
import { Message } from '@/app/types';

export default function ConversationView({ customerId }) {
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    // 初期メッセージを読み込む
    async function loadInitialMessages() {
      try {
        const response = await fetch(`/api/conversations/${customerId}/messages`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
    
    loadInitialMessages();
    
    // SSE接続を確立
    const eventSource = new EventSource(`/api/instagram/events?customerId=${customerId}`);
    
    // 接続イベントを処理
    eventSource.onopen = () => {
      console.log('SSE connection established');
    };
    
    // メッセージイベントを処理
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'new_messages' && data.messages.length > 0) {
        setMessages((prevMessages) => [...prevMessages, ...data.messages]);
      }
    };
    
    // エラーを処理
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
    };
    
    // コンポーネントのアンマウント時に接続を閉じる
    return () => {
      eventSource.close();
    };
  }, [customerId]);
  
  return (
    <div className="conversation-view">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.isFromCustomer ? 'customer' : 'business'}`}>
          {message.text}
        </div>
      ))}
    </div>
  );
}
```

## Webhookイベントの処理

### 1. メッセージの保存

```javascript
// src/app/lib/database.js
export async function saveMessageToDatabase(message) {
  try {
    // 実際の実装ではデータベースに保存
    // この例ではインメモリストレージを使用
    const messages = getMessages();
    messages.push({
      id: `msg-${Date.now()}`,
      ...message
    });
    
    // メッセージが保存されたことをログに記録
    console.log(`Message saved: ${message.text}`);
    
    return true;
  } catch (error) {
    console.error('Error saving message:', error);
    return false;
  }
}
```

### 2. AIレスポンスの生成

```javascript
// src/app/lib/openai.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateAIResponse(messageText) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: '顧客からのInstagram DMに対する返信を日本語で生成してください。丁寧で親切な対応を心がけてください。'
        },
        {
          role: 'user',
          content: messageText
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return '申し訳ありませんが、現在応答を生成できません。後ほど再試行してください。';
  }
}
```

## テストとデバッグ

### 1. Webhookのテスト

```javascript
// test-instagram-webhook.js
const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

// アクセストークンを取得
const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

// Facebookページを取得する関数
async function getFacebookPages() {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error getting Facebook pages:', JSON.stringify(errorData, null, 2));
      return null;
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error getting Facebook pages:', error);
    return null;
  }
}

// Webhookをサブスクライブする関数
async function subscribeToWebhook(pageId, pageAccessToken) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/subscribed_apps?subscribed_fields=messages&access_token=${pageAccessToken}`,
      { method: 'POST' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error subscribing to webhook:', JSON.stringify(errorData, null, 2));
      return false;
    }
    
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error subscribing to webhook:', error);
    return false;
  }
}

// メイン関数
async function main() {
  console.log('=== Instagram Webhook Test ===');
  
  // Facebookページを取得
  const pages = await getFacebookPages();
  
  if (!pages || pages.length === 0) {
    console.error('No Facebook pages found. Cannot proceed with webhook subscription.');
    return;
  }
  
  console.log(`Found ${pages.length} Facebook pages:`);
  pages.forEach((page, index) => {
    console.log(`${index + 1}. ${page.name} (ID: ${page.id})`);
  });
  
  // 各ページにWebhookをサブスクライブ
  for (const page of pages) {
    const success = await subscribeToWebhook(page.id, page.access_token);
    console.log(`Webhook subscription for page "${page.name}": ${success ? 'Success' : 'Failed'}`);
  }
}

// メイン関数を実行
main().catch(error => {
  console.error('Unhandled error:', error);
});
```

### 2. Webhookのデバッグ

```javascript
// src/app/api/instagram/webhook-debug/route.js
export async function GET(req) {
  return Response.json({
    status: 'ok',
    message: 'Webhook debug endpoint is working',
    env: {
      hasVerifyToken: !!process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN,
      hasAccessToken: !!process.env.INSTAGRAM_ACCESS_TOKEN,
      nodeEnv: process.env.NODE_ENV
    }
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    // リクエストボディをログに記録
    console.log('Webhook debug received POST:', JSON.stringify(body, null, 2));
    
    // リクエストボディをそのまま返す
    return Response.json({
      status: 'debug',
      receivedBody: body
    });
  } catch (error) {
    console.error('Error in webhook debug:', error);
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
```

## トラブルシューティング

### 1. Webhook検証の失敗

- 検証トークンが一致していることを確認
- URLが正しいことを確認
- Webhookエンドポイントが公開アクセス可能であることを確認

### 2. イベントが受信されない

- ページにWebhookが正しくサブスクライブされていることを確認
- 必要な権限があることを確認
- Webhookのサブスクリプションフィールドに`messages`が含まれていることを確認

### 3. アクセストークンの問題

- トークンが有効であることを確認
- トークンに必要な権限があることを確認
- 長期トークンを使用することを検討

## ベストプラクティス

1. **セキュリティ**:
   - 検証トークンは安全な乱数を使用
   - 環境変数を使用してトークンを保存
   - HTTPS接続を使用

2. **パフォーマンス**:
   - Webhookハンドラは即座に応答を返す
   - 重い処理はバックグラウンドで実行
   - データベース操作を最適化

3. **エラー処理**:
   - すべてのエラーを適切にログに記録
   - フォールバックメカニズムを実装
   - リトライロジックを実装

4. **スケーラビリティ**:
   - ステートレスな設計を採用
   - キューイングシステムを検討
   - 負荷分散を実装

## 結論

Webhookを使用することで、Instagram APIの制限を回避しながら、新しいDMメッセージをリアルタイムで受信することができます。このアプローチにより、ユーザーが新しいメッセージを送信するとすぐにAIレスポンスを生成することが可能になります。

過去のメッセージの取得に関する制限は残りますが、リアルタイム通知とモックデータを組み合わせることで、実用的なInstagram DMダッシュボードを構築することができます。
