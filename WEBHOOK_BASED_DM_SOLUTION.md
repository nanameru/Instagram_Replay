# Webhookを使用したInstagram DMリアルタイム通知ソリューション

## 概要

Instagram APIの制限により過去のDMメッセージを取得することが難しい状況ですが、Webhookを使用することで**新しいメッセージをリアルタイムで受信**することが可能です。このアプローチにより、ユーザーが新しいDMを送信した瞬間にそれを検知し、AIレスポンスを生成することができます。

## Webhookの利点

1. **API制限の回避**: 過去のメッセージ取得に関するAPI制限を回避できます
2. **リアルタイム通知**: メッセージが送信されるとすぐに通知を受け取れます
3. **ビジネスアカウント要件の緩和**: 一部の機能はビジネスアカウントがなくても利用可能です
4. **権限要件の簡素化**: `instagram_manage_messages`などの高度な権限が不要な場合があります

## 実装手順

### 1. Webhookエンドポイントの作成

Next.jsアプリケーションにWebhookエンドポイントを作成します：

```javascript
// src/app/api/instagram/webhook/route.js
export async function GET(req) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  
  // 検証トークンを確認
  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
  
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified');
    return new Response(challenge);
  } else {
    console.error('Webhook verification failed');
    return new Response('Verification failed', { status: 403 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Webhookイベントを処理
    if (body.object === 'instagram' && body.entry && body.entry.length > 0) {
      for (const entry of body.entry) {
        // メッセージングイベントを処理
        if (entry.messaging && entry.messaging.length > 0) {
          for (const messagingEvent of entry.messaging) {
            await processMessage(messagingEvent);
          }
        }
      }
    }
    
    return Response.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

// メッセージを処理する関数
async function processMessage(messagingEvent) {
  const senderId = messagingEvent.sender.id;
  const message = messagingEvent.message;
  
  // メッセージをデータベースに保存
  await saveMessageToDatabase({
    senderId,
    text: message.text,
    timestamp: messagingEvent.timestamp
  });
  
  // AIレスポンスを生成
  await generateAIResponse(senderId, message.text);
}
```

### 2. Webhookを公開アクセス可能にする

Webhookエンドポイントは公開アクセス可能である必要があります：

1. アプリケーションをVercelなどにデプロイする
2. または開発中はngrokなどのトンネルサービスを使用する

### 3. Facebook開発者ポータルでWebhookを設定

1. [Facebook開発者ポータル](https://developers.facebook.com/)にアクセス
2. アプリを選択
3. 「製品を追加」からWebhookを選択
4. 以下の情報を入力：
   - コールバックURL: `https://あなたのドメイン/api/instagram/webhook`
   - 検証トークン: 任意の安全な文字列（.env.localに保存）
   - サブスクリプションフィールド: `messages`を選択

### 4. ページへのWebhookサブスクリプション

APIを使用してページにWebhookをサブスクライブします：

```javascript
// Webhookをサブスクライブする関数
async function subscribeToWebhook(pageId, accessToken) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/subscribed_apps?subscribed_fields=messages&access_token=${accessToken}`,
    { method: 'POST' }
  );
  
  const data = await response.json();
  return data.success === true;
}
```

## ハイブリッドアプローチ

Webhookとモックデータを組み合わせたハイブリッドアプローチを実装することで、より堅牢なソリューションを構築できます：

1. **新しいメッセージ**: Webhookを通じてリアルタイムで受信
2. **過去のメッセージ**: 可能な場合はAPIを使用し、それ以外の場合はモックデータを使用
3. **AIレスポンス**: 新しいメッセージを受信するとすぐにAIレスポンスを生成

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
    return await generateMockConversation(customerId);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return await generateMockConversation(customerId);
  }
}
```

## 必要な環境変数

`.env.local`ファイルに以下の環境変数を追加します：

```
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=あなたの安全な検証トークン
INSTAGRAM_ACCESS_TOKEN=あなたのアクセストークン
```

## 実装例

完全な実装例は`test-instagram-webhook-approach.js`ファイルを参照してください。このスクリプトは、Facebookページを取得し、各ページにWebhookをサブスクライブする方法を示しています。

## 結論

Webhookを使用したアプローチにより、Instagram APIの制限を回避しながら、新しいDMメッセージをリアルタイムで受信することができます。これにより、ユーザーが新しいメッセージを送信するとすぐにAIレスポンスを生成することが可能になります。

過去のメッセージの取得に関する制限は残りますが、リアルタイム通知とモックデータを組み合わせることで、実用的なInstagram DMダッシュボードを構築することができます。
