# Instagram DM アクセスの代替方法

## 概要

Instagram DMダッシュボードの実装において、APIアクセスに関するいくつかの課題が確認されました。この文書では、これらの課題に対する代替アプローチを提案します。

## 現状の課題

1. **アクセストークンの期限切れ**：現在のトークンは期限切れです
   ```
   Error validating access token: Session has expired on Monday, 17-Mar-25 11:00:00 PDT.
   ```

2. **ビジネスアカウント要件**：DMアクセスにはInstagramビジネスアカウントが必要です
3. **権限の制限**：`instagram_manage_messages`などの特定の権限が必要です
4. **Facebookページ連携**：ビジネスアカウントとFacebookページの連携が必要です

## 代替アプローチ

### 1. Webhookベースのリアルタイム通知

新しいDMをリアルタイムで受信するためのWebhookを実装します：

#### メリット
- 過去のメッセージ取得に関する制限を回避できます
- リアルタイムで通知を受け取れます
- 一部の機能はビジネスアカウントがなくても利用可能です

#### 実装方法
1. Webhookエンドポイントを作成
2. Facebook開発者ポータルでWebhookを設定
3. ページにWebhookをサブスクライブ

```javascript
// Webhookエンドポイントの例
export async function POST(req) {
  const body = await req.json();
  
  if (body.object === 'instagram' && body.entry && body.entry.length > 0) {
    for (const entry of body.entry) {
      if (entry.messaging && entry.messaging.length > 0) {
        for (const messagingEvent of entry.messaging) {
          // 新しいメッセージを処理
          await processNewMessage(messagingEvent);
        }
      }
    }
  }
  
  return Response.json({ status: 'success' });
}
```

### 2. サーバー送信イベント（SSE）によるリアルタイム更新

サーバー送信イベントを使用してダッシュボードをリアルタイムで更新します：

#### メリット
- WebSocketよりも実装が簡単です
- ブラウザのネイティブサポートがあります
- 単方向通信に最適です

#### 実装方法
1. SSEエンドポイントを作成
2. クライアント側でEventSourceを使用して接続
3. 新しいメッセージを受信したらUIを更新

```javascript
// SSEエンドポイントの例
export async function GET(req) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(() => {
        const data = encoder.encode(`data: ${JSON.stringify({ timestamp: Date.now() })}\n\n`);
        controller.enqueue(data);
      }, 5000);
      
      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
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
```

### 3. 強化されたモックデータシステム

より現実的なモックデータを生成するシステムを実装します：

#### メリット
- APIアクセスに依存しません
- 開発とテストが容易です
- ユーザーエクスペリエンスを維持できます

#### 実装方法
1. 現実的な日本語の会話データを生成
2. 顧客プロファイルとメッセージ履歴を充実させる
3. AIを活用してよりリアルなレスポンスを生成

```javascript
// 強化されたモックデータ生成の例
function generateEnhancedMockData() {
  const customers = [];
  
  for (let i = 1; i <= 10; i++) {
    const customerName = `顧客${i}`;
    const conversations = [];
    
    for (let j = 1; j <= 5; j++) {
      const messages = [];
      
      for (let k = 1; k <= 10; k++) {
        messages.push({
          id: `msg-${i}-${j}-${k}`,
          isFromCustomer: k % 2 === 1,
          text: k % 2 === 1 ? `${customerName}からのメッセージ ${k}` : `ビジネスからの返信 ${k}`,
          timestamp: Date.now() - (10 - k) * 3600000
        });
      }
      
      conversations.push({
        id: `conv-${i}-${j}`,
        title: `会話 ${j}`,
        messages
      });
    }
    
    customers.push({
      id: `cust-${i}`,
      name: customerName,
      profilePicture: `https://randomuser.me/api/portraits/men/${i}.jpg`,
      conversations
    });
  }
  
  return { customers };
}
```

### 4. ハイブリッドアプローチ

上記のアプローチを組み合わせたハイブリッドソリューションを実装します：

#### メリット
- 複数の方法を組み合わせることで堅牢性が向上します
- APIアクセスが利用可能な場合はそれを使用し、それ以外の場合はフォールバックします
- ユーザーエクスペリエンスを最大化できます

#### 実装方法
1. APIアクセスを試みる
2. 失敗した場合はモックデータにフォールバック
3. Webhookを使用して新しいメッセージをリアルタイムで受信
4. SSEを使用してUIをリアルタイムで更新

```javascript
// ハイブリッドアプローチの例
async function getConversations(customerId) {
  try {
    // まずAPIを試す
    const apiResponse = await fetch(`/api/instagram/conversations/${customerId}`);
    
    if (apiResponse.ok) {
      return await apiResponse.json();
    }
    
    // APIが失敗した場合はモックデータを使用
    console.warn('API access failed, falling back to mock data');
    return generateEnhancedMockData().customers.find(c => c.id === customerId)?.conversations || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return generateEnhancedMockData().customers.find(c => c.id === customerId)?.conversations || [];
  }
}
```

### 5. 長期的なトークン管理

トークンの期限切れを防ぐための長期的な戦略を実装します：

#### メリット
- トークンの期限切れによる中断を防ぎます
- 自動化により手動の介入が不要になります
- システムの信頼性が向上します

#### 実装方法
1. 長期アクセストークンを取得
2. トークンの有効期限を監視
3. 期限切れの前に自動的に更新

```javascript
// 長期トークン管理の例
async function getLongLivedToken(shortLivedToken) {
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  
  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`,
    { method: 'GET' }
  );
  
  if (!response.ok) {
    throw new Error('Failed to get long-lived token');
  }
  
  const data = await response.json();
  return data.access_token;
}

function scheduleTokenRefresh() {
  // 50日ごとに更新（ミリ秒単位）
  const REFRESH_INTERVAL = 50 * 24 * 60 * 60 * 1000;
  
  setInterval(async () => {
    try {
      await refreshToken();
    } catch (error) {
      console.error('Scheduled token refresh failed:', error);
    }
  }, REFRESH_INTERVAL);
}
```

## 実装計画

### フェーズ1: 基盤の構築

1. **モックデータシステムの強化**
   - より現実的な日本語の会話データを生成
   - 顧客プロファイルとメッセージ履歴の充実

2. **Webhookエンドポイントの実装**
   - Webhook検証ロジックの作成
   - イベント処理ロジックの実装

3. **サーバー送信イベント（SSE）の実装**
   - SSEエンドポイントの作成
   - クライアント側の接続ロジックの実装

### フェーズ2: リアルタイム機能の実装

1. **リアルタイムメッセージ処理**
   - 新しいメッセージの保存ロジック
   - メッセージ履歴の更新ロジック

2. **AIレスポンス生成の最適化**
   - バックグラウンド処理の実装
   - 会話コンテキストを考慮したレスポンス生成

3. **ユーザーインターフェースの更新**
   - リアルタイム更新のUIコンポーネント
   - 新しいメッセージの通知システム

### フェーズ3: 長期的な改善

1. **トークン管理システムの実装**
   - 長期アクセストークンの取得ロジック
   - 自動トークン更新のスケジューリング

2. **エラー処理とフォールバックの強化**
   - APIエラーの詳細なロギング
   - モックデータへのスムーズなフォールバック

3. **パフォーマンスの最適化**
   - データベースクエリの最適化
   - クライアント側のキャッシュ戦略

## 結論

Instagram APIの制限に対処するために、複数の代替アプローチを組み合わせることで、実用的なInstagram DMダッシュボードを構築することができます。特に、Webhookを使用したリアルタイム通知システムと強化されたモックデータを組み合わせたハイブリッドアプローチが最も効果的です。

これらのアプローチを実装することで、過去のメッセージ取得に関する制限を回避しながら、新しいメッセージをリアルタイムで処理することが可能になります。
