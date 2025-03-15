# Instagram API Integration Documentation

## 必要な権限（Required Permissions）

Instagram Graph APIを通じてInstagram DMにアクセスするには、以下の権限が必要です：

- `read_mailbox`: Instagram DMからメッセージを読み取るために必要
- `manage_messages`: Instagram DMを通じてメッセージを送信するために必要

これらの権限は、Facebookのアプリ審査プロセスを通じて承認を受ける必要があります。これらの権限がない場合、APIはエラーコード298と「Reading mailbox messages requires the extended permission read_mailbox」というメッセージを返します。

## API エンドポイント

### プロフィール情報（Profile Information）
- エンドポイント: `https://graph.instagram.com/me`
- 必要なフィールド: `id,username,name,profile_picture_url`
- 権限: 基本アクセス

### 会話一覧（Conversations）
- エンドポイント: `https://graph.facebook.com/v18.0/me/conversations`
- 必要なフィールド: `participants,updated_time`
- 権限: `read_mailbox`

### 特定の会話のメッセージ（Messages for a Specific Conversation）
- エンドポイント: `https://graph.facebook.com/v18.0/CONVERSATION_ID/messages`
- 必要なフィールド: `from,message,created_time`
- 権限: `read_mailbox`

### メッセージの送信（Sending Messages）
- エンドポイント: `https://graph.facebook.com/v18.0/me/messages`
- メソッド: POST
- 必要なパラメータ: `recipient`, `message`
- 権限: `manage_messages`

## フォールバック戦略（Fallback Strategy）

APIが権限エラーを返す場合、アプリケーションはモックデータを使用して機能をデモンストレーションします。これにより、必要な権限がなくても開発とテストが可能になります。

実際のAPIとモックデータを切り替えるには、アプリケーションの設定ページを使用してください。

## 必要な権限の取得方法（Getting the Required Permissions）

1. [Facebook Developer Portal](https://developers.facebook.com/)でFacebookアプリを作成
2. Instagram Graph API製品を追加
3. 必要な権限でアプリを構成
4. Instagram DMへのアクセスのユースケースを説明して、アプリをレビューに提出
5. 承認後、必要な権限を持つアクセストークンを使用できます

詳細については、[Instagram Messaging API ドキュメント](https://developers.facebook.com/docs/instagram-api/guides/messaging)を参照してください。

## エラーコードと対応（Error Codes and Handling）

### エラーコード 298
- メッセージ: "Reading mailbox messages requires the extended permission read_mailbox"
- 原因: DMを読み取るための`read_mailbox`権限がない
- 対応: Facebookアプリ審査を通じて`read_mailbox`権限を取得

### エラーコード 10
- メッセージ: "Application does not have permission for this action"
- 原因: メッセージを送信するための`manage_messages`権限がない
- 対応: Facebookアプリ審査を通じて`manage_messages`権限を取得

## アプリケーションの実装（Application Implementation）

このアプリケーションでは、Instagram APIの権限が利用できない場合に備えて、以下の実装を行っています：

1. API呼び出しが失敗した場合、モックデータにフォールバック
2. ユーザーに権限の問題を通知
3. 設定ページでAPIステータスを表示
4. 実際のAPIとモックデータを切り替える機能を提供

これにより、APIの権限が完全に利用可能になるまで、アプリケーションの機能をデモンストレーションできます。
