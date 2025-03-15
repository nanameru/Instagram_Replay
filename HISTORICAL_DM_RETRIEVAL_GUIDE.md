# Instagram DM 履歴取得機能 - 実装ガイド

## 概要

Instagram DMの履歴メッセージを取得し、表示するための機能を実装しました。この機能は、Instagram Graph APIを使用してダイレクトメッセージの履歴を取得し、ページネーション機能を備えたUIで表示します。

## API実装の詳細

### エンドポイント

```
GET /api/instagram/historical-messages
```

### パラメータ

- `conversation_id` (必須): 会話ID
- `limit` (オプション): 一度に取得するメッセージ数（デフォルト: 20）
- `before` (オプション): このIDより前のメッセージを取得（ページネーション用）
- `after` (オプション): このIDより後のメッセージを取得（ページネーション用）
- `since` (オプション): この時間以降のメッセージを取得（UNIX タイムスタンプ）
- `until` (オプション): この時間以前のメッセージを取得（UNIX タイムスタンプ）

### レスポンス形式

```json
{
  "messages": [
    {
      "id": "message_id",
      "from": {
        "id": "sender_id",
        "name": "Sender Name"
      },
      "message": "メッセージ内容",
      "created_time": "2023-03-15T12:34:56+0000"
    }
  ],
  "is_mock": false,
  "pagination": {
    "previous": "/api/instagram/historical-messages?conversation_id=123&after=message_id",
    "next": "/api/instagram/historical-messages?conversation_id=123&before=message_id"
  }
}
```

## 権限の問題と対応策

### 必要な権限

Instagram Graph APIでDMの履歴を取得するには、`read_mailbox`権限が必要です。この権限はFacebookのアプリレビューを通過する必要があり、取得が難しい場合があります。

### エラーコード298

`read_mailbox`権限がない場合、APIは以下のようなエラーを返します：

```json
{
  "error": {
    "message": "Requires read_mailbox permission to manage the object",
    "type": "OAuthException",
    "code": 298,
    "fbtrace_id": "..."
  }
}
```

### 自動フォールバックメカニズム

権限エラー（コード298）が発生した場合、APIは自動的にモックデータを返すようになっています。これにより、アプリケーションは権限がなくても正常に動作し続けることができます。

```javascript
// Check if this is a permission error (code 298 - read_mailbox permission required)
if (data.error && data.error.code === 298) {
  console.warn('Permission error: read_mailbox permission required. Using mock data.');
  
  // Return mock data with error information and pagination
  const mockMessages = getMockMessages(conversationId);
  
  // Create mock pagination
  const mockPagination = {
    previous: before ? `/api/instagram/historical-messages?conversation_id=${conversationId}&limit=${limit}&after=${mockMessages[0]?.id}` : null,
    next: `/api/instagram/historical-messages?conversation_id=${conversationId}&limit=${limit}&before=${mockMessages[mockMessages.length - 1]?.id}`
  };
  
  return Response.json({
    messages: mockMessages,
    is_mock: true,
    error: data.error,
    pagination: mockPagination
  });
}
```

## モックデータの生成

### モックデータの特徴

- 会話IDに基づいて一貫したデータを生成
- 実際のAPIレスポンスと同じ構造
- `is_mock: true`フラグを含む
- ページネーション情報を含む

### モックデータ生成関数

```javascript
export function getMockMessages(conversationId, count = 20) {
  // シード値として会話IDを使用して一貫したデータを生成
  const seed = conversationId.replace(/\D/g, '') || '1001';
  const seedNum = parseInt(seed, 10);
  
  const messages = [];
  const now = new Date();
  
  // 日本語のモックメッセージテンプレート
  const messageTemplates = [
    'こんにちは！お問い合わせありがとうございます。',
    'ご質問についてですが、詳細を教えていただけますか？',
    '承知しました。確認して折り返しご連絡します。',
    'ご不便をおかけして申し訳ありません。',
    'ありがとうございます！他にご質問はありますか？',
    'それについては、次のような対応が可能です。',
    'お待たせしました。ご要望の件について回答します。',
    'ご連絡ありがとうございます。',
    'もう少し詳しく教えていただけますか？',
    'かしこまりました。対応させていただきます。'
  ];
  
  for (let i = 0; i < count; i++) {
    const isFromCustomer = (i + seedNum) % 2 === 0;
    const messageIndex = (i + seedNum) % messageTemplates.length;
    const messageTime = new Date(now);
    messageTime.setHours(now.getHours() - Math.floor(i / 2));
    
    messages.push({
      id: `mock_msg_${conversationId}_${i}`,
      from: {
        id: isFromCustomer ? `customer_${seedNum}` : 'page_123456789',
        name: isFromCustomer ? `顧客 ${seedNum}` : 'ビジネスページ'
      },
      message: messageTemplates[messageIndex],
      created_time: messageTime.toISOString()
    });
  }
  
  return messages;
}
```

## UI実装

### MessageHistory コンポーネント

`MessageHistory`コンポーネントは、会話の履歴メッセージを表示し、以下の機能を提供します：

- メッセージの時系列表示
- 「過去のメッセージを読み込む」ボタンによるページネーション
- モックデータ使用時の通知表示
- エラー処理とローディング状態の表示
- 日本語ローカライズ（日付表示など）

### 主要な機能

1. **初期メッセージの取得**:
   ```javascript
   const fetchMessages = useCallback(async () => {
     if (!conversationId) return;
     
     try {
       setLoading(true);
       setError(null);
       
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
   ```

2. **過去のメッセージの読み込み**:
   ```javascript
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
   ```

3. **モックデータ通知**:
   ```jsx
   {isMockData && (
     <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm mb-4">
       <p className="font-medium">モックデータを表示しています</p>
       <p className="text-xs mt-1">
         Instagram APIの権限制限により、実際のDMデータにアクセスできません。
         完全なDM履歴を取得するには、read_mailbox権限が必要です。
       </p>
     </div>
   )}
   ```

## 完全な権限を取得する方法

完全なDM履歴機能を有効にするには、以下の手順が必要です：

1. **Facebookデベロッパーアカウントでアプリを作成**:
   - [Facebook for Developers](https://developers.facebook.com/)にアクセス
   - 新しいアプリを作成（ビジネスタイプを選択）
   - Instagramプラットフォームを追加

2. **`read_mailbox`権限をリクエスト**:
   - アプリダッシュボードから「アプリレビュー」セクションに移動
   - 「権限とフィーチャー」から`read_mailbox`権限をリクエスト
   - 権限の使用目的と実装詳細を説明

3. **ビジネス検証を完了**:
   - ビジネスの詳細情報を提供
   - 必要書類をアップロード（ビジネス登録証明書など）
   - 検証プロセスを完了

4. **新しいアクセストークンを生成**:
   - アプリダッシュボードから「アクセストークン」セクションに移動
   - ページアクセストークンを生成
   - 生成したトークンを`.env.local`ファイルに設定

## テスト方法

アプリケーションには、DMの履歴取得機能をテストするためのスクリプトが含まれています：

```bash
node test-historical-messages-api.js
```

このスクリプトは、APIエンドポイントにリクエストを送信し、レスポンスを確認します。権限エラーが発生した場合は、モックデータが正しく返されることを確認します。

## 今後の改善点

1. **リアルタイム更新**:
   - WebSocketを使用してリアルタイムでメッセージを更新
   - Webhookを設定してInstagramからのイベント通知を受信

2. **メッセージ検索機能**:
   - 会話内のメッセージを検索する機能
   - 日付範囲でのフィルタリング

3. **メディア対応**:
   - 画像、動画、音声メッセージの表示
   - ファイル添付の対応

4. **既読状態の管理**:
   - メッセージの既読状態の表示と更新
   - 未読メッセージのハイライト表示
