# Instagram API Integration Status

## 現在の状態 (Current Status)

アプリケーションは現在、Instagram Graph APIを使用してプロフィール情報とダイレクトメッセージを取得するように設定されています。ただし、現在の実装には以下の制限があります：

1. **プロフィール情報**: Instagram APIから基本的なプロフィール情報（ID、名前）の取得に成功しています。

2. **ダイレクトメッセージ**: `read_mailbox`権限が必要ですが、現在のアクセストークンにはこの権限が付与されていません。この権限がない場合、アプリケーションはモックデータにフォールバックします。

## 必要な権限 (Required Permissions)

Instagram DMに完全にアクセスするには、以下の権限が必要です：

- `read_mailbox`: Instagram DMからメッセージを読み取るために必要
- `manage_messages`: Instagram DMを通じてメッセージを送信するために必要

これらの権限は、Facebookのアプリレビュープロセスを通じて承認を受ける必要があります。

## 次のステップ (Next Steps)

Instagram DM統合を完全に実装するには：

1. **拡張権限のリクエスト**: `read_mailbox`と`manage_messages`権限を取得するために、Facebookにアプリレビューリクエストを提出します。

2. **アクセストークンの更新**: 承認後、新しい権限でアクセストークンを更新します。

3. **API統合のテスト**: 新しい権限でアプリケーションが実際のInstagram DMを正常に取得できることを確認します。

## フォールバック戦略 (Fallback Strategy)

アプリケーションは、必要な権限が利用できない場合、モックデータに優雅にフォールバックするように設計されています。これにより、ユーザー体験を中断することなく開発とテストが可能になります。

ユーザーは設定ページで実際のAPIとモックデータを切り替えることができます。

## API接続テスト結果 (API Connection Test Results)

APIテストスクリプトの実行結果：

```
Testing Instagram API with access token...
Fetching profile information...
Profile data: { id: '975355974713289', name: '住宅四天王 エース' }
Fetching conversations...
Instagram API error: 403 Forbidden
Response: {"error":{"message":"(#298) Reading mailbox messages requires the extended permission read_mailbox","type":"OAuthException","code":298,"fbtrace_id":"Ae5L84NnaKBeTUL7ePFRE0J"}}
```

これは予想された動作です。プロフィール情報は正常に取得できますが、会話（DM）にアクセスするには`read_mailbox`権限が必要です。

## モックデータの使用 (Using Mock Data)

アプリケーションは、APIアクセスが制限されている場合でも完全な機能を提供するために、詳細なモックデータを使用します。モックデータは以下の機能をシミュレートします：

- 顧客プロフィール
- 会話リスト
- メッセージ履歴
- AIによる応答生成

## ドキュメント (Documentation)

Instagram API統合の詳細については、[Instagram API ドキュメント](/src/app/lib/instagram-api-docs.md)を参照してください。

## デプロイメント情報 (Deployment Information)

アプリケーションは以下のURLでデプロイされています：
https://instagram-unified-7ahohtmb4-4869nanataitai-gmailcoms-projects.vercel.app

このデプロイメントでは、環境変数を使用して安全にAPIキーを管理しています。
