/**
 * Very simple API test that doesn't depend on complex imports
 */

async function testSimpleEndpoint() {
  console.log('=== シンプルAPIテスト ===');
  console.log('テスト開始時刻:', new Date().toLocaleString('ja-JP'));
  
  try {
    // Test simple test endpoint
    console.log('\nシンプルテストエンドポイントテスト:');
    const testResponse = await fetch('http://localhost:3000/api/instagram/test');
    
    console.log('レスポンスステータス:', testResponse.status);
    
    if (!testResponse.ok) {
      console.log('エラーレスポンス:', await testResponse.text());
      console.log('❌ シンプルテストエンドポイントテスト失敗');
    } else {
      const testData = await testResponse.json();
      console.log('API状態:', testData.status || '不明');
      console.log('タイムスタンプ:', testData.timestamp);
      console.log('トークン利用可能:', testData.token_available ? '✅ はい' : '❌ いいえ');
      console.log('メッセージ:', testData.message);
      console.log('✅ シンプルテストエンドポイントテスト成功');
    }
  } catch (error) {
    console.error('\n❌ テスト失敗:', error.message);
    console.error('エラー詳細:', error);
  }
  
  console.log('\nテスト終了時刻:', new Date().toLocaleString('ja-JP'));
}

// テスト実行
testSimpleEndpoint();
