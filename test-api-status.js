/**
 * Simple API status test
 */

async function testApiStatus() {
  console.log('=== API状態テスト ===');
  console.log('テスト開始時刻:', new Date().toLocaleString('ja-JP'));
  
  try {
    // Test API status endpoint
    console.log('\nAPI状態エンドポイントテスト:');
    const statusResponse = await fetch('http://localhost:3000/api/instagram/status');
    
    console.log('レスポンスステータス:', statusResponse.status);
    
    if (!statusResponse.ok) {
      console.log('エラーレスポンス:', await statusResponse.text());
      console.log('❌ API状態エンドポイントテスト失敗');
    } else {
      const statusData = await statusResponse.json();
      console.log('API状態:', statusData.status || '不明');
      console.log('トークン有効性:', statusData.token_info?.is_valid ? '✅ 有効' : '❌ 無効');
      console.log('✅ API状態エンドポイントテスト成功');
    }
  } catch (error) {
    console.error('\n❌ テスト失敗:', error.message);
    console.error('エラー詳細:', error);
  }
  
  console.log('\nテスト終了時刻:', new Date().toLocaleString('ja-JP'));
}

// テスト実行
testApiStatus();
