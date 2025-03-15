/**
 * Instagram API直接テスト - Graph APIを直接呼び出し
 */

const https = require('https');
require('dotenv').config({ path: '.env.local' });

// Instagram Graph API設定
const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
const apiVersion = 'v18.0';
const baseUrl = 'https://graph.facebook.com/' + apiVersion;

async function testInstagramAPI() {
  console.log('=== Instagram Graph API 直接テスト ===');
  console.log('テスト開始時刻:', new Date().toLocaleString('ja-JP'));
  console.log('使用トークン:', accessToken ? accessToken.substring(0, 15) + '...' : '未設定');
  
  try {
    // 1. ユーザープロフィールテスト
    console.log('\n1. ユーザープロフィールテスト:');
    await makeRequest(`${baseUrl}/me?fields=id,name&access_token=${accessToken}`)
      .then(data => {
        console.log('レスポンスステータス: 200');
        console.log('ユーザーID:', data.id);
        console.log('ユーザー名:', data.name);
        console.log('✅ ユーザープロフィールテスト成功');
      })
      .catch(error => {
        console.log('❌ ユーザープロフィールテスト失敗');
        console.log('エラーレスポンス:', error.message);
      });
    
    // 2. Instagram Business Accountテスト
    console.log('\n2. Instagram Business Accountテスト:');
    await makeRequest(`${baseUrl}/me/accounts?fields=instagram_business_account&access_token=${accessToken}`)
      .then(data => {
        console.log('レスポンスステータス: 200');
        console.log('ページ数:', data.data?.length || 0);
        
        if (data.data && data.data.length > 0) {
          const hasInstagramAccount = data.data.some(page => page.instagram_business_account);
          console.log('Instagram Business Account:', hasInstagramAccount ? '✅ あり' : '❌ なし');
          
          if (hasInstagramAccount) {
            const instagramAccountId = data.data.find(page => page.instagram_business_account).instagram_business_account.id;
            console.log('Instagram Business Account ID:', instagramAccountId);
          }
        } else {
          console.log('Instagram Business Account: ❌ なし');
        }
        
        console.log('✅ Instagram Business Accountテスト成功');
      })
      .catch(error => {
        console.log('❌ Instagram Business Accountテスト失敗');
        console.log('エラーレスポンス:', error.message);
      });
    
    // 3. 会話リストテスト
    console.log('\n3. 会話リストテスト:');
    await makeRequest(`${baseUrl}/me/conversations?access_token=${accessToken}`)
      .then(data => {
        console.log('レスポンスステータス: 200');
        console.log('会話数:', data.data?.length || 0);
        
        if (data.data && data.data.length > 0) {
          console.log('最初の会話ID:', data.data[0].id);
          console.log('✅ 会話リストテスト成功');
        } else {
          console.log('会話: ❌ なし');
          console.log('✅ 会話リストテスト成功 (データなし)');
        }
      })
      .catch(error => {
        console.log('❌ 会話リストテスト失敗');
        console.log('エラーレスポンス:', error.message);
      });
    
    // 4. 過去のメッセージテスト
    console.log('\n4. 過去のメッセージテスト:');
    await makeRequest(`${baseUrl}/me/messages?access_token=${accessToken}`)
      .then(data => {
        console.log('レスポンスステータス: 200');
        console.log('メッセージ数:', data.data?.length || 0);
        
        if (data.data && data.data.length > 0) {
          console.log('最初のメッセージ:', data.data[0].message);
          console.log('✅ 過去のメッセージテスト成功');
        } else {
          console.log('メッセージ: ❌ なし');
          console.log('✅ 過去のメッセージテスト成功 (データなし)');
        }
      })
      .catch(error => {
        console.log('❌ 過去のメッセージテスト失敗');
        console.log('エラーレスポンス:', error.message);
        
        // 権限エラーの場合
        if (error.message.includes('OAuthException') || error.message.includes('permission')) {
          console.log('権限エラー: read_mailbox権限が必要です');
        }
      });
    
    // テスト結果サマリー
    console.log('\n=== テスト結果サマリー ===');
    console.log('Instagram APIの制限により、過去のDMを取得するには以下の条件が必要です:');
    console.log('1. ビジネスアカウントであること');
    console.log('2. read_mailbox権限が付与されていること');
    console.log('3. アプリがレビューを通過していること');
    
  } catch (error) {
    console.error('\n❌ テスト全体の失敗:', error.message);
    console.error('エラー詳細:', error);
  }
  
  console.log('\nテスト終了時刻:', new Date().toLocaleString('ja-JP'));
}

// HTTPSリクエストを行う関数
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          
          if (jsonData.error) {
            reject(new Error(`API エラー: ${jsonData.error.message} (コード: ${jsonData.error.code}, タイプ: ${jsonData.error.type})`));
          } else {
            resolve(jsonData);
          }
        } catch (e) {
          reject(new Error(`JSONパースエラー: ${e.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`リクエストエラー: ${err.message}`));
    });
  });
}

// テスト実行
testInstagramAPI();
