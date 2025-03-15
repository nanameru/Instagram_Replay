/**
 * Minimal test script for the simplest possible API endpoint
 */

async function testMinimalEndpoint() {
  console.log('=== 最小限APIテスト ===');
  console.log('テスト開始時刻:', new Date().toLocaleString('ja-JP'));
  
  try {
    // Test minimal endpoint
    console.log('\n最小限エンドポイントテスト:');
    const testResponse = await fetch('http://localhost:3000/api/instagram/simple');
    
    console.log('レスポンスステータス:', testResponse.status);
    
    if (!testResponse.ok) {
      console.log('エラーレスポンス:', await testResponse.text());
      console.log('❌ 最小限エンドポイントテスト失敗');
    } else {
      const testData = await testResponse.json();
      console.log('API状態:', testData.status || '不明');
      console.log('タイムスタンプ:', testData.timestamp);
      console.log('メッセージ:', testData.message);
      console.log('✅ 最小限エンドポイントテスト成功');
    }
  } catch (error) {
    console.error('\n❌ テスト失敗:', error.message);
    console.error('エラー詳細:', error);
  }
  
  console.log('\nテスト終了時刻:', new Date().toLocaleString('ja-JP'));
}

// テスト実行
testMinimalEndpoint();
