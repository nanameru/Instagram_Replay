# Instagram API アクセス問題の調査報告書

## 問題の概要

Instagram APIへのアクセスに関する問題を調査した結果、以下の主要な問題点が特定されました：

1. **アクセストークンの期限切れ**: 現在のアクセストークンは2025年3月17日に期限切れになっています
2. **権限の制限**: 必要な権限（特に`read_mailbox`）が不足している可能性があります
3. **API制限**: Instagram APIには厳格な制限があり、DMの完全な履歴へのアクセスが制限されています

## 詳細な調査結果

### 1. アクセストークンの状態

テストスクリプト`test-instagram-api-simple.js`の実行結果：

```
=== Instagram API Simple Test ===
Testing with token: EAAhYeSTN9...TcLtjdVmWC
Checking token validity...
Error validating token: {
  "error": {
    "message": "Error validating access token: Session has expired on Monday, 17-Mar-25 11:00:00 PDT. The current time is Monday, 24-Mar-25 01:33:55 PDT.",
    "type": "OAuthException",
    "code": 190,
    "error_subcode": 463,
    "fbtrace_id": "AxdgCr4YWyXyK_LyR6neRyS"
  }
}

=== Test Summary ===
❌ Token is invalid

Recommendation: Generate a new access token with the required permissions.
```

この結果から、現在のアクセストークンは**期限切れ**であることが明確です。これが、APIアクセスの主要な問題点です。

### 2. ビジネスアカウントの状態

ユーザーの確認によると、アカウントは既にInstagram Business Accountに設定されています。これは重要な前提条件を満たしていることを意味します。

### 3. 必要な権限

Instagram DMの履歴にアクセスするために必要な権限：

| 権限名 | 目的 | 状態 |
|--------|------|------|
| `instagram_basic` | 基本的なプロフィール情報 | 必要 |
| `instagram_manage_messages` | メッセージ管理 | 必要 |
| `pages_messaging` | メッセージ送信 | 必要 |
| `read_mailbox` | 過去のDM取得 | 必要だが取得困難 |

特に`read_mailbox`権限は、Facebookのアプリレビューが必要で取得が困難です。

### 4. トークン管理システム

現在のトークン管理システム（`token-manager.js`）は以下の機能を提供しています：

- トークンの有効性チェック
- 権限の確認
- トークン情報の取得

しかし、**自動更新機能**は実装されていません。

## 解決策の実装

トークン管理の問題を解決するために、以下の機能を実装しました：

### 1. トークン管理システム

`token-manager.js`に以下の機能を実装しました：

```javascript
// トークン管理システムの主要機能
export async function getValidToken() {
  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  // トークンがない場合はnullを返す
  if (!currentToken) {
    console.warn('No Instagram access token configured');
    return null;
  }
  
  // トークンの有効性をチェック
  try {
    const response = await fetch(`https://graph.facebook.com/debug_token?input_token=${currentToken}&access_token=${currentToken}`);
    const data = await response.json();
    
    if (response.ok && data.data && data.data.is_valid) {
      return currentToken;
    }
    
    // トークンが無効な場合、更新を試みる
    console.warn('Instagram token is invalid or expired, attempting to refresh...');
    const refreshResult = await refreshToken();
    
    if (refreshResult.success && refreshResult.token) {
      console.log('Token refreshed successfully');
      return refreshResult.token;
    }
    
    console.error('Instagram token is invalid and could not be refreshed');
    return null;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return null;
  }
}
```

### 2. トークン更新ページ

ユーザーが簡単にトークンを更新できるように、専用のトークン更新ページ（`/settings/token-renewal`）を実装しました：

- 新しいトークンを入力するフォーム
- トークンの検証機能
- 詳細なエラーメッセージ
- トークン更新手順のガイド

### 3. トークンステータス表示

設定ページ（`/settings`）にトークンのステータスを表示する機能を追加しました：

- トークンの有効性
- 有効期限
- 付与されている権限
- エラー情報（トークンが無効な場合）
- トークン更新ページへのリンク

### 4. APIエンドポイントの強化

以下のAPIエンドポイントを実装して、トークン管理を強化しました：

- `/api/instagram/token-status`: トークンの状態を確認
- `/api/instagram/update-token`: 新しいトークンを検証して更新
- `/api/instagram/historical-messages`: トークンの状態に応じてメッセージを取得

### 5. エラーハンドリングの改善

トークンが期限切れの場合、ユーザーに明確なエラーメッセージと対応方法を表示するようにしました：

- トークン期限切れの検出（エラーコード190）
- トークン更新ページへのリンク
- 日本語でのエラーメッセージ

### 6. 代替アプローチの実装

DMの完全な履歴にアクセスできない場合の代替アプローチとして、以下を実装しました：

1. **モックデータシステム**: APIアクセスが制限されている場合に、リアルなモックデータを提供
2. **フォールバックメカニズム**: APIエラー時に自動的にモックデータに切り替え
3. **エラー情報の表示**: ユーザーに対して、なぜモックデータが表示されているかを説明

### 7. 包括的なドキュメント

トークン管理と更新に関する詳細なドキュメントを作成しました：

- `INSTAGRAM_TOKEN_RENEWAL_GUIDE_JA.md`: トークン更新の詳細な手順
- `HISTORICAL_DM_RETRIEVAL_IMPLEMENTATION_REPORT_JA.md`: 履歴メッセージ取得の実装詳細
- `INSTAGRAM_API_ACCESS_ISSUES_REPORT.md`: API接続問題の調査結果と解決策

## 次のステップ

1. **新しいアクセストークンの取得**: 最優先事項として、新しいトークンを取得してください
2. **トークン自動更新の設定**: アプリIDとシークレットを設定して自動更新を有効化
3. **権限申請プロセスの開始**: 完全なDM履歴アクセスのために、`read_mailbox`権限の申請を検討
4. **定期的なトークン状態の確認**: 設定ページでトークンの状態を定期的に確認

## 結論

Instagram APIアクセスの問題は、主にアクセストークンの期限切れが原因でした。今回実装したトークン管理システムと更新機能により、この問題を効果的に管理できるようになりました。

トークンが期限切れになった場合でも、ユーザーは設定ページから簡単に新しいトークンを更新できます。また、APIアクセスが制限されている場合でも、モックデータシステムによって、アプリケーションの機能を継続的に利用できます。

ビジネスアカウントは既に設定されているため、適切な権限を持つ有効なトークンがあれば、APIアクセスが可能になります。長期的には、Facebookのアプリレビュープロセスを通じて追加の権限を取得することで、より完全なDM履歴へのアクセスが可能になるでしょう。
