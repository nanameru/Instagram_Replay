# Instagram アクセストークン更新ガイド

## 概要

このガイドでは、Instagram APIアクセストークンの更新方法について説明します。現在のトークンは期限切れになっているため、新しいトークンを取得して`.env.local`ファイルを更新する必要があります。

## トークンの種類

Instagram APIでは、以下の種類のトークンが使用されます：

1. **ユーザーアクセストークン**:
   - 個人のInstagramアカウントに関連付けられたトークン
   - 通常、有効期限は短い（1〜2時間）

2. **長期アクセストークン**:
   - 60日間有効なトークン
   - ユーザーアクセストークンから生成可能

3. **ページアクセストークン**:
   - Facebookページに関連付けられたトークン
   - Instagram Business Accountと連携している場合に使用

4. **アプリトークン**:
   - アプリケーション全体に関連付けられたトークン
   - アプリIDとアプリシークレットから生成

## トークン更新手順

### 1. Facebookデベロッパーポータルにアクセス

1. [Facebook for Developers](https://developers.facebook.com/)にアクセス
2. アカウントでログイン
3. 「マイアプリ」から対象のアプリを選択

### 2. 新しいユーザーアクセストークンの生成

1. 左側のメニューから「ツール」→「Graph API Explorer」を選択
2. 右上の「トークンを生成」ボタンをクリック
3. 必要な権限（`instagram_basic`, `instagram_manage_messages`など）を選択
4. 「トークンを生成」ボタンをクリック
5. 生成されたトークンをコピー

### 3. 長期アクセストークンへの変換（推奨）

短期トークンを長期トークン（60日間有効）に変換するには：

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}"
```

- `{app-id}`: アプリのID
- `{app-secret}`: アプリのシークレット
- `{short-lived-token}`: 先ほど生成した短期トークン

### 4. `.env.local`ファイルの更新

1. プロジェクトルートの`.env.local`ファイルを開く
2. `INSTAGRAM_ACCESS_TOKEN`の値を新しいトークンに更新

```
# Instagram API credentials
INSTAGRAM_ACCESS_TOKEN=新しいトークンをここに貼り付け
INSTAGRAM_APP_TOKEN=2349077145450303|SrZOrr25GlJeqsPiEwEQnsGQvEQ

# その他の設定は変更しない
```

### 5. アプリケーションの再起動

トークンを更新した後、アプリケーションを再起動して変更を反映させます：

```bash
npm run dev
```

## トークン有効性の確認

新しいトークンが正しく機能しているか確認するには：

```bash
node test-instagram-api-full.js
```

このスクリプトは、APIの接続状態とトークンの権限を確認します。

## トークン更新の自動化（オプション）

本番環境では、トークンの自動更新を検討することをお勧めします：

1. 定期的なトークン更新スクリプトの実装
2. トークン有効期限の監視システムの構築
3. バックアップトークンの保管

## トラブルシューティング

### エラー: トークンの有効期限切れ

```json
{
  "error": {
    "message": "Error validating access token: Session has expired...",
    "type": "OAuthException",
    "code": 190
  }
}
```

**解決策**: 上記の手順に従って新しいトークンを生成してください。

### エラー: 権限不足

```json
{
  "error": {
    "message": "Insufficient permission for this operation",
    "type": "OAuthException",
    "code": 200
  }
}
```

**解決策**: トークン生成時に必要な権限（`instagram_basic`, `instagram_manage_messages`など）が選択されていることを確認してください。

## 次のステップ

トークンを更新した後、以下の手順を検討してください：

1. **read_mailbox権限の申請**: DMの完全な履歴を取得するために必要
2. **ビジネスアカウント連携**: より多くの機能にアクセスするために推奨
3. **APIテストの実行**: 新しいトークンでの機能確認

## 参考リンク

- [Facebook Graph API ドキュメント](https://developers.facebook.com/docs/graph-api/)
- [アクセストークンの詳細](https://developers.facebook.com/docs/facebook-login/access-tokens/)
- [Instagram Graph API ドキュメント](https://developers.facebook.com/docs/instagram-api/)
