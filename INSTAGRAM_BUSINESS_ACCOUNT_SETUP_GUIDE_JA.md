# Instagram ビジネスアカウント設定ガイド

このガイドでは、Instagram DMダッシュボードアプリケーションで過去のDMを取得するために必要なInstagramビジネスアカウントの設定方法を説明します。

## 前提条件

- Instagramアカウント
- Facebookアカウント
- Facebookページ（ない場合は作成する必要があります）

## 手順

### 1. Instagramアカウントをビジネスアカウントに変更する

1. Instagramアプリを開く
2. プロフィール画面に移動
3. 右上のメニューボタンをタップ
4. 「設定」を選択
5. 「アカウント」を選択
6. 「プロフェッショナルアカウントに切り替え」を選択
7. 「ビジネス」を選択
8. ビジネスカテゴリを選択し、手順に従う

### 2. FacebookページとInstagramビジネスアカウントを連携する

1. Instagramアプリでプロフィール画面に移動
2. 「プロフィールを編集」をタップ
3. 「プロフェッショナルアカウント情報」をタップ
4. 「Facebookに接続」を選択
5. Facebookアカウントにログイン
6. 連携するFacebookページを選択（ない場合は新規作成）
7. 「続行」をタップして連携を完了

### 3. Facebook開発者アカウントを設定する

1. [Facebook開発者ポータル](https://developers.facebook.com/)にアクセス
2. Facebookアカウントでログイン
3. 「マイアプリ」から「アプリを作成」を選択
4. 「ビジネス」タイプを選択
5. アプリ名と連絡先メールアドレスを入力
6. アプリを作成

### 4. Instagram Graph APIの権限を設定する

1. 作成したアプリのダッシュボードで「製品を追加」を選択
2. 「Instagram Graph API」を追加
3. 「アプリレビュー」セクションに移動
4. 以下の権限をリクエスト:
   - `instagram_basic` - 基本的なプロフィール情報用
   - `instagram_manage_messages` - メッセージ管理用
   - `pages_messaging` - メッセージ送信用
   - `pages_read_engagement` - ページ情報読み取り用
   - `read_mailbox` - 過去のメッセージ取得用（重要）

### 5. アクセストークンを取得する

1. アプリダッシュボードで「ツール」→「Graph API Explorer」を選択
2. 右上のアプリ選択ドロップダウンから作成したアプリを選択
3. 「ユーザーまたはページ」ドロップダウンから「ページアクセストークンを取得」を選択
4. 連携したFacebookページを選択
5. 必要な権限（上記の5つ）にチェックを入れる
6. 「トークンを生成」をクリック
7. 生成されたトークンをコピー

### 6. 長期アクセストークンを取得する

短期トークン（有効期限2時間）から長期トークン（有効期限60日）を取得します：

```javascript
async function getLongLivedToken(shortLivedToken) {
  const appId = 'あなたのアプリID';
  const appSecret = 'あなたのアプリシークレット';
  
  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`,
    { method: 'GET' }
  );
  
  const data = await response.json();
  return data.access_token;
}
```

### 7. アプリケーションにトークンを設定する

1. コピーしたトークンを`.env.local`ファイルの`INSTAGRAM_ACCESS_TOKEN`に設定

```
INSTAGRAM_ACCESS_TOKEN=EAAhYe...（生成されたトークン）
```

## 権限の詳細

### 必須権限

1. **instagram_basic**
   - 説明: Instagramビジネスアカウントの基本情報へのアクセスを提供
   - 用途: プロフィール情報、フォロワー数などの取得

2. **instagram_manage_messages**
   - 説明: Instagramビジネスアカウントのメッセージ管理機能へのアクセスを提供
   - 用途: メッセージの送信、受信、既読状態の管理

3. **pages_messaging**
   - 説明: Facebookページを通じてメッセージを送信する権限
   - 用途: InstagramアカウントにリンクされたFacebookページを通じてメッセージを送信

4. **pages_read_engagement**
   - 説明: Facebookページのエンゲージメントデータへのアクセスを提供
   - 用途: ページの統計情報、インサイトの取得

5. **read_mailbox**
   - 説明: 過去のメッセージ履歴へのアクセスを提供
   - 用途: 過去のDMメッセージの取得（最も重要）
   - 注意: この権限はアプリレビューが必要

## トークン管理

### トークンの有効期限

- **短期トークン**: 2時間
- **長期トークン**: 60日

### トークン更新の自動化

長期トークンも60日で期限切れになるため、定期的な更新が必要です：

```javascript
function scheduleTokenRefresh() {
  // 50日ごとに更新（ミリ秒単位）
  const REFRESH_INTERVAL = 50 * 24 * 60 * 60 * 1000;
  
  setInterval(async () => {
    try {
      // 現在のトークンを使用して新しいトークンを取得
      const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
      const newToken = await refreshToken(currentToken);
      
      // 新しいトークンを保存（データベースや環境変数など）
      saveNewToken(newToken);
      
      console.log('トークンが正常に更新されました');
    } catch (error) {
      console.error('トークン更新エラー:', error);
    }
  }, REFRESH_INTERVAL);
}

async function refreshToken(currentToken) {
  // Facebookのトークン更新エンドポイントを呼び出す
  const response = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${currentToken}`,
    { method: 'GET' }
  );
  
  const data = await response.json();
  return data.access_token;
}
```

## 注意事項

1. **権限の承認**: `read_mailbox`などの一部の権限はFacebookのアプリレビューが必要です。ビジネス目的での使用を説明する必要があります。

2. **トークンの有効期限**: 生成されたトークンには有効期限があります。長期トークンを取得するには追加の手順が必要です。

3. **ビジネスアカウント要件**: 過去のDMを取得するには、必ずビジネスアカウントである必要があります。個人アカウントでは`read_mailbox`権限が利用できません。

## トラブルシューティング

### アクセストークンが機能しない場合

1. トークンの有効期限を確認する
2. 必要な権限がすべて含まれているか確認する
3. ビジネスアカウントとFacebookページが正しく連携されているか確認する

### 「権限が不足しています」エラーが表示される場合

1. アプリダッシュボードで権限が正しく設定されているか確認する
2. アプリレビューが必要な権限の場合、レビューが完了しているか確認する
3. 新しいトークンを生成して再試行する

### 「ビジネスアカウントではありません」エラーが表示される場合

1. Instagramアカウントがビジネスアカウントに正しく変換されているか確認する
2. Facebookページとの連携が完了しているか確認する
3. アカウント設定で「プロフェッショナルアカウント」セクションを確認する

## トークンの検証

アクセストークンが有効かどうかを確認するには、以下のAPIリクエストを使用します：

```javascript
async function validateToken(accessToken) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('トークンは有効です。ユーザーID:', data.id);
      return true;
    } else {
      const error = await response.json();
      console.error('トークンエラー:', error);
      return false;
    }
  } catch (error) {
    console.error('トークン検証エラー:', error);
    return false;
  }
}
```

## 参考リンク

- [Instagram Graph API公式ドキュメント](https://developers.facebook.com/docs/instagram-api)
- [Facebookビジネスヘルプセンター](https://www.facebook.com/business/help)
- [Instagram APIの権限ガイド](https://developers.facebook.com/docs/instagram-api/guides/business-permission-features)
