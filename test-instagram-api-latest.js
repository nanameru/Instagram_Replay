/**
 * Instagram API テスト - 最新トークンを使用
 */

const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testInstagramAPI() {
  console.log('=== Instagram API テスト (最新トークン) ===');
  console.log('テスト開始時刻:', new Date().toLocaleString('ja-JP'));
  console.log('使用トークン:', process.env.INSTAGRAM_ACCESS_TOKEN ? '設定済み' : '未設定');
  
  // テスト結果サマリー
  const results = {
    simple: false,
    profile: false,
    conversations: false,
    messages: false,
    historical: false
  };
  
  try {
    // 1. シンプルエンドポイントテスト
    console.log('\n1. シンプルエンドポイントテスト:');
    const simpleResponse = await fetch('http://localhost:3000/api/instagram/simple');
    
    console.log('レスポンスステータス:', simpleResponse.status);
    
    if (!simpleResponse.ok) {
      console.log('エラーレスポンス:', await simpleResponse.text());
    } else {
      const simpleData = await simpleResponse.json();
      console.log('API状態:', simpleData.status || '不明');
      console.log('タイムスタンプ:', simpleData.timestamp);
      results.simple = true;
    }
    
    // 2. プロフィールエンドポイントテスト
    console.log('\n2. プロフィールエンドポイントテスト:');
    const profileResponse = await fetch('http://localhost:3000/api/instagram/profile');
    
    console.log('レスポンスステータス:', profileResponse.status);
    
    if (!profileResponse.ok) {
      console.log('エラーレスポンス:', await profileResponse.text());
    } else {
      const profileData = await profileResponse.json();
      console.log('モックデータフラグ:', profileData.is_mock ? '✅ モックデータ' : '❌ 実データ');
      console.log('プロフィール情報:', profileData.profile ? '取得成功' : '取得失敗');
      results.profile = true;
    }
    
    // 3. 会話エンドポイントテスト
    console.log('\n3. 会話エンドポイントテスト:');
    const conversationsResponse = await fetch('http://localhost:3000/api/instagram/conversations');
    
    console.log('レスポンスステータス:', conversationsResponse.status);
    
    if (!conversationsResponse.ok) {
      console.log('エラーレスポンス:', await conversationsResponse.text());
    } else {
      const conversationsData = await conversationsResponse.json();
      console.log('モックデータフラグ:', conversationsData.is_mock ? '✅ モックデータ' : '❌ 実データ');
      console.log('会話数:', conversationsData.data?.length || 0);
      results.conversations = true;
    }
    
    // 4. メッセージエンドポイントテスト
    console.log('\n4. メッセージエンドポイントテスト:');
    const messagesResponse = await fetch('http://localhost:3000/api/instagram/messages');
    
    console.log('レスポンスステータス:', messagesResponse.status);
    
    if (!messagesResponse.ok) {
      console.log('エラーレスポンス:', await messagesResponse.text());
    } else {
      const messagesData = await messagesResponse.json();
      console.log('モックデータフラグ:', messagesData.is_mock ? '✅ モックデータ' : '❌ 実データ');
      console.log('メッセージ数:', messagesData.messages?.length || 0);
      results.messages = true;
    }
    
    // 5. 過去のメッセージエンドポイントテスト
    console.log('\n5. 過去のメッセージエンドポイントテスト:');
    const historicalResponse = await fetch('http://localhost:3000/api/instagram/historical-messages');
    
    console.log('レスポンスステータス:', historicalResponse.status);
    
    if (!historicalResponse.ok) {
      console.log('エラーレスポンス:', await historicalResponse.text());
    } else {
      const historicalData = await historicalResponse.json();
      console.log('モックデータフラグ:', historicalData.is_mock ? '✅ モックデータ' : '❌ 実データ');
      console.log('過去のメッセージ数:', historicalData.messages?.length || 0);
      console.log('権限エラー:', historicalData.error?.code === 298 ? '✅ 権限不足' : '❌ その他のエラー');
      results.historical = true;
    }
    
    // テスト結果サマリー
    console.log('\n=== テスト結果サマリー ===');
    console.log('1. シンプルエンドポイント: ' + (results.simple ? '✅ 成功' : '❌ 失敗'));
    console.log('2. プロフィールエンドポイント: ' + (results.profile ? '✅ 成功' : '❌ 失敗'));
    console.log('3. 会話エンドポイント: ' + (results.conversations ? '✅ 成功' : '❌ 失敗'));
    console.log('4. メッセージエンドポイント: ' + (results.messages ? '✅ 成功' : '❌ 失敗'));
    console.log('5. 過去のメッセージエンドポイント: ' + (results.historical ? '✅ 成功' : '❌ 失敗'));
    
    // 過去のDM取得に関する詳細情報
    console.log('\n=== 過去のDM取得に関する詳細情報 ===');
    console.log('Instagram APIの制限により、過去のDMを取得するには以下の条件が必要です:');
    console.log('1. ビジネスアカウントであること');
    console.log('2. read_mailbox権限が付与されていること');
    console.log('3. アプリがレビューを通過していること');
    
    if (historicalResponse.ok && historicalData && historicalData.error?.code === 298) {
      console.log('\n現在のトークンには必要な権限がありません。モックデータを使用しています。');
    } else if (historicalResponse.ok && historicalData && !historicalData.is_mock) {
      console.log('\n過去のDMの取得に成功しました！実際のデータを使用しています。');
    } else {
      console.log('\nAPIエンドポイントにアクセスできませんでした。サーバーの状態を確認してください。');
    }
    
  } catch (error) {
    console.error('\n❌ テスト失敗:', error.message);
    console.error('エラー詳細:', error);
  }
  
  console.log('\nテスト終了時刻:', new Date().toLocaleString('ja-JP'));
}

// テスト実行
testInstagramAPI();
