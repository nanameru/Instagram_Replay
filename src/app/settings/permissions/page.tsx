import React from 'react';
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

export const metadata: Metadata = {
  title: '権限設定ガイド | Instagram DM ダッシュボード',
  description: 'Instagram API権限の取得方法と設定ガイド',
};

export default function PermissionsGuidePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Instagram API 権限取得ガイド</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>read_mailbox 権限の取得方法</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Instagram DMの完全な履歴を取得するには、<code>read_mailbox</code>権限が必要です。
            この権限はFacebookアプリレビューが必要な拡張権限です。
          </p>
          
          <h3 className="text-lg font-medium mt-4">ステップ 1: Facebookデベロッパーアカウントの作成</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li><a href="https://developers.facebook.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Facebook for Developers</a>にアクセス</li>
            <li>アカウントでログイン（まだ持っていない場合は作成）</li>
            <li>「マイアプリ」→「アプリを作成」をクリック</li>
            <li>アプリタイプとして「ビジネス」を選択</li>
            <li>必要な情報を入力してアプリを作成</li>
          </ol>
          
          <h3 className="text-lg font-medium mt-4">ステップ 2: Instagram Graph APIの設定</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>作成したアプリのダッシュボードで「製品を追加」をクリック</li>
            <li>「Instagram Graph API」を選択</li>
            <li>設定手順に従ってInstagramビジネスアカウントを接続</li>
          </ol>
          
          <h3 className="text-lg font-medium mt-4">ステップ 3: read_mailbox権限のリクエスト</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>アプリダッシュボードで「アプリレビュー」→「権限とフィーチャー」を選択</li>
            <li>「Instagram Graph API」セクションで「read_mailbox」権限を見つけて「リクエスト」をクリック</li>
            <li>権限の使用方法を説明するフォームに記入</li>
            <li>アプリのスクリーンショットやデモビデオを提供</li>
            <li>レビュー用にテストアカウントを設定</li>
            <li>リクエストを送信</li>
          </ol>
          
          <h3 className="text-lg font-medium mt-4">ステップ 4: レビュープロセスの完了</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Facebookのレビュープロセスを待つ（数日から数週間かかる場合があります）</li>
            <li>追加情報のリクエストがあれば対応</li>
            <li>承認されたら、新しいアクセストークンを生成</li>
          </ol>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
            <h4 className="font-medium text-blue-800 mb-2">重要な注意事項</h4>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>アプリレビューには、アプリのプライバシーポリシーが必要です</li>
              <li>ビジネス検証が必要になる場合があります</li>
              <li>レビュープロセス中に追加の質問や情報提供を求められる場合があります</li>
              <li>承認されるまでは、モックデータを使用してアプリケーションの開発を続けることができます</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>アクセストークンの更新方法</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            権限が承認された後、新しいアクセストークンを生成して、アプリケーションで使用する必要があります。
          </p>
          
          <h3 className="text-lg font-medium mt-4">ステップ 1: 新しいアクセストークンの生成</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Facebookデベロッパーダッシュボードにアクセス</li>
            <li>作成したアプリを選択</li>
            <li>「ツール」→「Graph API Explorer」を選択</li>
            <li>右上の「トークンを生成」ボタンをクリック</li>
            <li>必要な権限（Instagram Graph APIと<code>read_mailbox</code>を含む）を選択</li>
            <li>「トークンを生成」ボタンをクリック</li>
            <li>生成されたトークンをコピー</li>
          </ol>
          
          <h3 className="text-lg font-medium mt-4">ステップ 2: アプリケーションの設定更新</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>アプリケーションの<code>.env.local</code>ファイルを開く</li>
            <li><code>INSTAGRAM_ACCESS_TOKEN</code>の値を新しいトークンに更新</li>
            <li>アプリケーションを再起動</li>
          </ol>
          
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-6">
            <h4 className="font-medium text-green-800 mb-2">トークン更新後の確認</h4>
            <p className="text-green-700">
              トークンを更新した後、「設定」ページの「API状態」セクションで、トークンが有効であり、
              必要な権限が付与されていることを確認してください。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
