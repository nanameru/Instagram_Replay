# 実装概要：Instagram DMダッシュボード

## 概要

Instagram DMダッシュボードは、Instagram Direct Messagesを管理し、AIによる返信候補を生成するアプリケーションです。このドキュメントでは、実装した主要機能と技術的な詳細について説明します。

## 主要機能

### 1. トークン管理システム

Instagram APIアクセスの主要な課題であるトークン期限切れの問題に対処するため、包括的なトークン管理システムを実装しました：

- **トークン検証**: トークンの有効性を自動的に確認
- **トークン更新**: 期限切れトークンの更新機能
- **権限確認**: トークンに付与されている権限の確認
- **エラーハンドリング**: トークン関連のエラーを適切に処理

### 2. 履歴メッセージ取得

Instagram DMの履歴を取得するための機能を実装しました：

- **APIアクセス**: Instagram Graph APIを使用したメッセージ取得
- **ページネーション**: 大量のメッセージを効率的に取得
- **フォールバックメカニズム**: API制限時のモックデータ提供
- **エラーハンドリング**: API制限やエラーの適切な処理

### 3. ユーザーインターフェース

直感的で使いやすいUIを実装しました：

- **会話リスト**: 顧客との会話一覧
- **メッセージ履歴**: 会話内のメッセージ表示
- **AI返信生成**: AIによる返信候補の生成
- **設定ページ**: トークン管理と接続状態の確認

## 技術スタック

- **フレームワーク**: Next.js 15.2.2
- **言語**: TypeScript/JavaScript
- **スタイリング**: Tailwind CSS
- **API**: Instagram Graph API
- **AI**: OpenAI API

## 実装の詳細

### トークン管理システム

`token-manager.js`では、以下の機能を実装しています：

```javascript
// トークンの取得と検証
export async function getValidToken() {
  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  // トークンの有効性をチェック
  const response = await fetch(`https://graph.facebook.com/debug_token?input_token=${currentToken}&access_token=${currentToken}`);
  const data = await response.json();
  
  if (response.ok && data.data && data.data.is_valid) {
    return currentToken;
  }
  
  // トークンが無効な場合、更新を試みる
  const refreshResult = await refreshToken();
  
  if (refreshResult.success) {
    return refreshResult.token;
  }
  
  return null;
}
```

### 履歴メッセージ取得

`historical-messages/route.js`では、以下の機能を実装しています：

```javascript
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversation_id');
  
  // トークンの取得
  const token = await getValidToken();
  
  if (!token) {
    // トークンが無効な場合はモックデータを返す
    return Response.json({
      messages: generateMockMessages(conversationId),
      is_mock_data: true,
      error: {
        message: 'アクセストークンが無効または期限切れです',
        code: 190
      }
    });
  }
  
  try {
    // Instagram APIからメッセージを取得
    const response = await fetch(`https://graph.facebook.com/v18.0/${conversationId}/messages?access_token=${token}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error.message);
    }
    
    return Response.json({
      messages: data.data,
      paging: data.paging,
      is_mock_data: false
    });
  } catch (error) {
    // エラー時はモックデータを返す
    return Response.json({
      messages: generateMockMessages(conversationId),
      is_mock_data: true,
      error: {
        message: error.message,
        code: error.code || 500
      }
    });
  }
}
```

### ユーザーインターフェース

`MessageHistory.tsx`では、以下の機能を実装しています：

```typescript
export default function MessageHistory({ conversationId, profileId }: MessageHistoryProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);
  
  // メッセージの取得
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/instagram/historical-messages?conversation_id=${conversationId}`);
      const data = await response.json();
      
      setMessages(data.messages || []);
      setIsMockData(data.is_mock_data || false);
      
      if (data.error) {
        // トークンが期限切れの場合
        if (data.error.code === 190) {
          setError(`アクセストークンが期限切れです - トークンを更新するには設定ページにアクセスしてください。`);
        } else {
          setError(`${data.error.message || '不明なエラー'}`);
        }
      }
    } catch (error) {
      setError('メッセージの取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);
  
  // コンポーネントのレンダリング
  return (
    <div>
      {isMockData && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
          <p>モックデータを表示しています</p>
          <p>Instagram APIの権限制限により、実際のDMデータにアクセスできません。</p>
        </div>
      )}
      
      {/* メッセージの表示 */}
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <p>{message.content || message.message}</p>
            <div>{formatMessageDate(message.timestamp || message.created_time)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 今後の展望

1. **トークン自動更新の強化**: より堅牢なトークン自動更新システムの実装
2. **Webhookの統合**: リアルタイムメッセージ通知の実装
3. **権限拡張**: より多くのAPI権限の取得
4. **UI/UXの改善**: ユーザーインターフェースの継続的な改善

## 結論

Instagram DMダッシュボードは、トークン管理の課題に対処しつつ、Instagram DMの管理とAIによる返信候補生成を実現するアプリケーションです。トークン期限切れやAPI制限などの課題に対して、堅牢なフォールバックメカニズムを実装することで、常に機能するアプリケーションを提供しています。
