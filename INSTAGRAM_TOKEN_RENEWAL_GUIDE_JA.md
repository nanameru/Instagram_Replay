# Instagram アクセストークン更新ガイド

このガイドでは、Instagram APIアクセストークンの更新方法について説明します。アクセストークンは定期的に期限切れになるため、アプリケーションが継続的に機能するためには更新が必要です。

## トークンの種類と有効期限

Instagram APIで使用されるトークンには、主に以下の種類があります：

1. **短期アクセストークン**：有効期限は約2時間
2. **長期アクセストークン**：有効期限は約60日間
3. **ページアクセストークン**：一部のAPIでは無期限

現在のアプリケーションでは、**長期アクセストークン**を使用しています。このトークンは約60日間有効ですが、その後は更新が必要です。

## トークン更新の手順

### 1. Facebook開発者ポータルでの更新

1. [Facebook開発者ポータル](https://developers.facebook.com/)にアクセスします
2. 右上のメニューから「マイアプリ」を選択し、該当するアプリを選択します
3. 左側のメニューから「ツール」→「Graph API Explorer」を選択します
4. 右上の「トークンを生成」ボタンをクリックします
5. 必要な権限（`instagram_basic`、`instagram_manage_messages`など）を選択します
6. 生成されたトークンをコピーします

### 2. 長期トークンへの変換

短期トークンを長期トークン（60日間有効）に変換するには：

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}"
```

- `{app-id}`: FacebookアプリのID
- `{app-secret}`: Facebookアプリのシークレット
- `{short-lived-token}`: 前のステップで取得した短期トークン

### 3. アプリケーションでのトークン更新

1. 設定ページ（`/settings/token-renewal`）にアクセスします
2. 新しいトークンを入力フィールドに貼り付けます
3. 「トークンを更新」ボタンをクリックします
4. 成功メッセージが表示されたら、トークンが正常に更新されています

## トークン更新の自動化

本番環境では、トークンの自動更新を実装することをお勧めします。以下は自動更新の基本的な実装例です：

```javascript
async function refreshToken() {
  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${currentToken}`
    );
    
    const data = await response.json();
    
    if (data.access_token) {
      // 新しいトークンを安全に保存
      console.log('Token refreshed successfully');
      return data.access_token;
    }
    
    throw new Error('Failed to refresh token');
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}
```

## トークン更新の確認

トークンが正常に更新されたことを確認するには：

1. 設定ページ（`/settings`）にアクセスします
2. 「アクセストークン」セクションでトークンのステータスを確認します
3. 「有効」と表示され、有効期限が更新されていることを確認します

## トラブルシューティング

### トークンが無効と表示される場合

1. トークンが正しくコピーされているか確認します
2. 必要な権限がすべて含まれているか確認します
3. アプリがレビュー済みで公開されているか確認します

### トークンの更新に失敗する場合

1. アプリIDとアプリシークレットが正しいか確認します
2. ネットワーク接続を確認します
3. Facebookアプリのステータスを確認します

## 必要な権限

Instagram DMダッシュボードには、以下の権限が必要です：

- `instagram_basic`: 基本的なプロフィール情報へのアクセス
- `instagram_manage_messages`: メッセージの管理
- `pages_messaging`: メッセージの送信

より高度な機能（過去のDM履歴の完全なアクセスなど）には、追加の権限が必要になる場合があります。

## 注意事項

- トークンは機密情報です。安全に保管し、公開リポジトリにコミットしないでください
- トークンの有効期限が切れる前に更新することをお勧めします
- 本番環境では、トークンの自動更新メカニズムを実装することを検討してください

## 参考リンク

- [Facebook Graph API ドキュメント](https://developers.facebook.com/docs/graph-api/)
- [Instagram Graph API ドキュメント](https://developers.facebook.com/docs/instagram-api/)
- [アクセストークンの詳細](https://developers.facebook.com/docs/facebook-login/access-tokens/)
