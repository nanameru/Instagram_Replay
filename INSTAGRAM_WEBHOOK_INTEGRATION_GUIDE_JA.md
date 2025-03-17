# Instagram Webhook 統合ガイド

## 概要

このガイドでは、Instagram DMダッシュボードアプリケーションにWebhookを統合して、リアルタイムでDMの通知を受け取る方法について説明します。Webhookを使用することで、過去のメッセージ取得に関するAPI制限を回避しながら、新しいメッセージをリアルタイムで処理することができます。

## Webhookの利点

1. **リアルタイム通知**: メッセージが送信されるとすぐに通知を受け取れます
2. **API制限の回避**: 過去のメッセージ取得に関するAPI制限を回避できます
3. **ユーザーエクスペリエンスの向上**: 即時応答によりユーザーエクスペリエンスが向上します

## 前提条件

1. **Instagramビジネスアカウント**: Webhookを使用するには、Instagramビジネスアカウントが必要です
2. **Facebookページ**: Instagramビジネスアカウントと連携したFacebookページが必要です
3. **Facebookアプリ**: Facebook開発者ポータルで作成したアプリが必要です
4. **公開アクセス可能なエンドポイント**: WebhookはインターネットからアクセスできるURLが必要です

## 実装手順

### 1. Webhook検証エンドポイントの作成

Instagramは、Webhookエンドポイントを検証するためにGETリクエストを送信します。以下のコードを使用して検証エンドポイントを実装します：

```javascript
// src/app/api/instagram/webhook/route.js
export async function GET(req) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  
  // 環境変数から検証トークンを取得
  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
  
  if (mode === 'subscribe' && token === verifyToken) {
    // 検証成功：challengeを返す
    return new Response(challenge);
  } else {
    // 検証失敗
    return new Response('検証に失敗しました', { status: 403 });
  }
}
```

### 2. Webhookイベントハンドラの実装

Instagramは、新しいメッセージが送信されるとPOSTリクエストを送信します。以下のコードを使用してイベントハンドラを実装します：

```javascript
// src/app/api/instagram/webhook/route.js
export async function POST(req) {
  try {
    const body = await req.json();
    
    // Instagramからのイベントを確認
    if (body.object === 'instagram' && body.entry && body.entry.length > 0) {
      for (const entry of body.entry) {
        if (entry.messaging && entry.messaging.length > 0) {
          for (const messagingEvent of entry.messaging) {
            // バックグラウンドでメッセージを処理
            await processMessageInBackground(messagingEvent);
          }
        }
      }
    }
    
    // 成功レスポンスを返す（重要：Instagramは200レスポンスを期待しています）
    return Response.json({ status: 'success' });
  } catch (error) {
    console.error('Webhookエラー:', error);
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

// バックグラウンドでメッセージを処理する関数
async function processMessageInBackground(messagingEvent) {
  try {
    // メッセージの送信者と受信者を取得
    const senderId = messagingEvent.sender.id;
    const recipientId = messagingEvent.recipient.id;
    
    // メッセージテキストを取得
    const messageText = messagingEvent.message.text;
    
    // ここでメッセージを処理（データベースに保存、AIレスポンスを生成など）
    console.log(`新しいメッセージを受信: ${senderId} から ${recipientId} へ: ${messageText}`);
    
    // SSEクライアントに通知を送信
    notifyClients({
      type: 'new_message',
      senderId,
      recipientId,
      messageText,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('メッセージ処理エラー:', error);
  }
}
```

### 3. Webhookサブスクリプションエンドポイントの実装

Webhookをサブスクライブするためのエンドポイントを実装します：

```javascript
// src/app/api/instagram/subscribe-webhook/route.js
export async function POST(req) {
  try {
    const { pageId, accessToken } = await req.json();
    
    if (!pageId || !accessToken) {
      return Response.json({ 
        status: 'error', 
        message: 'ページIDとアクセストークンが必要です' 
      }, { status: 400 });
    }
    
    // Facebookページにアプリをサブスクライブ
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
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
```

### 4. サーバー送信イベント（SSE）の実装

リアルタイム更新をフロントエンドに提供するためのSSEエンドポイントを実装します：

```javascript
// src/app/api/instagram/events/route.js
export async function GET(req) {
  const encoder = new TextEncoder();
  const customerId = new URL(req.url).searchParams.get('customerId');
  
  const stream = new ReadableStream({
    start(controller) {
      // 初期接続メッセージ
      const initialData = encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);
      controller.enqueue(initialData);
      
      // クライアントIDを登録
      const clientId = Date.now().toString();
      clients.set(clientId, controller);
      
      // 定期的なハートビート
      const interval = setInterval(() => {
        try {
          const data = encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`);
          controller.enqueue(data);
        } catch (error) {
          console.error('SSE送信エラー:', error);
        }
      }, 30000); // 30秒ごと
      
      // クライアント切断時の処理
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        clients.delete(clientId);
      });
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}

// SSEクライアントを保持するMap
const clients = new Map();

// すべてのクライアントに通知を送信する関数
export function notifyClients(data) {
  const encoder = new TextEncoder();
  const message = encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
  
  clients.forEach((controller) => {
    try {
      controller.enqueue(message);
    } catch (error) {
      console.error('クライアント通知エラー:', error);
    }
  });
}
```

### 5. フロントエンドでのSSE接続の実装

フロントエンドでSSE接続を実装します：

```typescript
// src/app/components/conversations/ConversationView.tsx
import { useEffect, useState } from 'react';

export function ConversationView({ customerId }) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    // SSE接続を開始
    const eventSource = new EventSource(`/api/instagram/events?customerId=${customerId}`);
    
    // 接続イベントのハンドラ
    eventSource.onopen = () => {
      console.log('SSE接続が確立されました');
    };
    
    // メッセージイベントのハンドラ
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'new_message') {
        // 新しいメッセージを追加
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    };
    
    // エラーハンドラ
    eventSource.onerror = (error) => {
      console.error('SSE接続エラー:', error);
      eventSource.close();
    };
    
    // コンポーネントのクリーンアップ時に接続を閉じる
    return () => {
      eventSource.close();
    };
  }, [customerId]);
  
  return (
    <div className="conversation-view">
      {/* メッセージの表示 */}
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.isFromCustomer ? 'customer' : 'business'}`}>
          {message.text}
        </div>
      ))}
    </div>
  );
}
```

## Facebook開発者ポータルでの設定

### 1. Webhookの設定

1. [Facebook開発者ポータル](https://developers.facebook.com/)にアクセス
2. アプリを選択
3. 「製品を追加」からWebhookを選択
4. 以下の情報を入力：
   - コールバックURL: `https://あなたのドメイン/api/instagram/webhook`
   - 検証トークン: 環境変数`INSTAGRAM_WEBHOOK_VERIFY_TOKEN`と同じ値
   - サブスクリプションフィールド: `messages`を選択

### 2. ページへのWebhookサブスクリプション

1. アプリダッシュボードで「Webhooks」を選択
2. 「ページにサブスクライブ」をクリック
3. 連携したFacebookページを選択
4. サブスクリプションフィールドとして`messages`を選択

## 環境変数の設定

以下の環境変数を`.env.local`ファイルに設定します：

```
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=安全なランダムトークン
INSTAGRAM_ACCESS_TOKEN=長期アクセストークン
FACEBOOK_APP_ID=あなたのアプリID
FACEBOOK_APP_SECRET=あなたのアプリシークレット
```

## トラブルシューティング

### 1. Webhook検証の失敗

- 検証トークンが環境変数と一致していることを確認
- コールバックURLが正しいことを確認
- エンドポイントがインターネットからアクセス可能であることを確認

### 2. Webhookイベントが受信されない

- Facebookページへのサブスクリプションが正しく設定されているか確認
- アクセストークンが有効であることを確認
- サブスクリプションフィールドに`messages`が含まれていることを確認

### 3. SSE接続の問題

- サーバーがSSE接続を維持できることを確認
- クライアント側でエラーハンドリングが適切に実装されていることを確認
- ネットワークタイムアウトの設定を確認

## ベストプラクティス

1. **バックグラウンド処理**: Webhookハンドラは短時間で応答する必要があります。重い処理はバックグラウンドで行いましょう。

2. **エラーハンドリング**: すべてのエラーを適切に処理し、ログに記録しましょう。

3. **再試行メカニズム**: 一時的なエラーに対して再試行メカニズムを実装しましょう。

4. **モニタリング**: Webhookの受信状況をモニタリングし、問題が発生した場合に通知を受け取れるようにしましょう。

5. **セキュリティ**: Webhook検証トークンは十分に複雑なものを使用し、定期的に更新しましょう。

## 結論

Webhookを使用することで、Instagram APIの制限を回避しながら、リアルタイムでDMの通知を受け取ることができます。この方法は、過去のメッセージ取得に関する制限がある場合でも、新しいメッセージをリアルタイムで処理することができるため、ユーザーエクスペリエンスを向上させることができます。

SSEと組み合わせることで、フロントエンドにもリアルタイム更新を提供することができ、より対話的なダッシュボードを実現することができます。
