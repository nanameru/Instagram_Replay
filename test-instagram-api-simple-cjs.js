/**
 * Instagram API テスト - 最新トークンを使用 (CommonJS互換)
 */

const http = require('http');
const https = require('https');
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
    await makeRequest('http://localhost:3000/api/instagram/simple')
      .then(data => {
        console.log('レスポンスステータス: 200');
        console.log('API状態:', data.status || '不明');
        console.log('タイムスタンプ:', data.timestamp);
        results.simple = true;
      })
      .catch(error => {
        console.log('エラーレスポンス:', error.message);
      });
    
    // 2. メッセージエンドポイントテスト
    console.log('\n2. メッセージエンドポイントテスト:');
    await makeRequest('http://localhost:3000/api/instagram/messages')
      .then(data => {
        console.log('レスポンスステータス: 200');
        console.log('モックデータフラグ:', data.is_mock ? '✅ モックデータ' : '❌ 実データ');
        console.log('メッセージ数:', data.messages?.length || 0);
        results.messages = true;
      })
      .catch(error => {
        console.log('エラーレスポンス:', error.message);
      });
    
    // 3. 過去のメッセージエンドポイントテスト
    console.log('\n3. 過去のメッセージエンドポイントテスト:');
    await makeRequest('http://localhost:3000/api/instagram/historical-messages')
      .then(data => {
        console.log('レスポンスステータス: 200');
        console.log('モックデータフラグ:', data.is_mock ? '✅ モックデータ' : '❌ 実データ');
        console.log('過去のメッセージ数:', data.messages?.length || 0);
        console.log('権限エラー:', data.error?.code === 298 ? '✅ 権限不足' : '❌ その他のエラー');
        results.historical = true;
      })
      .catch(error => {
        console.log('エラーレスポンス:', error.message);
      });
    
    // テスト結果サマリー
    console.log('\n=== テスト結果サマリー ===');
    console.log('1. シンプルエンドポイント: ' + (results.simple ? '✅ 成功' : '❌ 失敗'));
    console.log('2. メッセージエンドポイント: ' + (results.messages ? '✅ 成功' : '❌ 失敗'));
    console.log('3. 過去のメッセージエンドポイント: ' + (results.historical ? '✅ 成功' : '❌ 失敗'));
    
    // 過去のDM取得に関する詳細情報
    console.log('\n=== 過去のDM取得に関する詳細情報 ===');
    console.log('Instagram APIの制限により、過去のDMを取得するには以下の条件が必要です:');
    console.log('1. ビジネスアカウントであること');
    console.log('2. read_mailbox権限が付与されていること');
    console.log('3. アプリがレビューを通過していること');
    
  } catch (error) {
    console.error('\n❌ テスト失敗:', error.message);
    console.error('エラー詳細:', error);
  }
  
  console.log('\nテスト終了時刻:', new Date().toLocaleString('ja-JP'));
}

// HTTPリクエストを行う関数
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          reject(new Error(`JSONパースエラー: ${e.message}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(new Error(`リクエストエラー: ${err.message}`));
    });
    
    req.end();
  });
}

// テスト実行
testInstagramAPI();
