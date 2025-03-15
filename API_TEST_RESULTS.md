# Instagram API テスト結果

## テスト概要
新しいアクセストークンを使用してInstagram APIへのアクセスをテストしました。

## テスト日時
2025年3月15日

## テスト結果

### プロフィール情報の取得
✅ **成功**
```
Profile data: { id: '975355974713289', name: '住宅四天王 エース' }
```

### 会話（DM）の取得
❌ **失敗**
```
Instagram API error: 403 Forbidden
Response: {"error":{"message":"(#298) Reading mailbox messages requires the extended permission read_mailbox","type":"OAuthException","code":298","fbtrace_id":"APc29x2XWOUMPpqIgoIqRqQ"}}
```

## 分析

1. **基本的なプロフィール情報**：新しいトークンで基本的なプロフィール情報（ID、名前）の取得に成功しました。

2. **DMアクセス**：新しいトークンでもDMにアクセスするための`read_mailbox`権限がありません。エラーコード298は、この権限が不足していることを示しています。

## 必要な権限

Instagram DMにアクセスするには、以下の権限が必要です：

- `read_mailbox`: DMの読み取りに必要
- `manage_messages`: メッセージの送信に必要

これらの権限は、Facebookのアプリ審査プロセスを通じて取得する必要があります。

## 次のステップ

1. **Facebookアプリ審査**：`read_mailbox`と`manage_messages`権限を取得するために、Facebookにアプリレビューリクエストを提出します。

2. **モックデータの使用**：必要な権限が取得できるまで、アプリケーションはモックデータを使用して機能します。設定ページで「モックデータを使用」オプションを有効にすることで、APIアクセスの問題を回避できます。

3. **アクセストークンの更新**：必要な権限が承認された後、新しいアクセストークンを取得して`.env.local`ファイルを更新します。

## 技術的詳細

エラーコード298（`Reading mailbox messages requires the extended permission read_mailbox`）は、アクセストークンに`read_mailbox`権限がないことを示しています。この権限は、Instagram DMを読み取るために必要です。

現在のアプリケーションは、このエラーを適切に処理し、モックデータにフォールバックするように設計されています。ユーザーは設定ページでAPIステータスを確認し、実際のAPIとモックデータを切り替えることができます。
