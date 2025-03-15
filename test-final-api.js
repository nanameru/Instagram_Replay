/**
 * Final Instagram API test script
 */

async function testFinalAPI() {
  console.log('=== 最終 Instagram API テスト ===');
  console.log('テスト開始時刻:', new Date().toLocaleString('ja-JP'));
  
  try {
    // Test simple endpoint
    console.log('\nシンプルエンドポイントテスト:');
    const simpleResponse = await fetch('http://localhost:3000/api/instagram/simple');
    
    console.log('レスポンスステータス:', simpleResponse.status);
    
    if (!simpleResponse.ok) {
      console.log('エラーレスポンス:', await simpleResponse.text());
      console.log('❌ シンプルエンドポイントテスト失敗');
    } else {
      const simpleData = await simpleResponse.json();
      console.log('API状態:', simpleData.status || '不明');
      console.log('タイムスタンプ:', simpleData.timestamp);
      console.log('✅ シンプルエンドポイントテスト成功');
    }
    
    // Test messages endpoint
    console.log('\nメッセージエンドポイントテスト:');
    const messagesResponse = await fetch('http://localhost:3000/api/instagram/messages');
    
    console.log('レスポンスステータス:', messagesResponse.status);
    
    if (!messagesResponse.ok) {
      console.log('エラーレスポンス:', await messagesResponse.text());
      console.log('❌ メッセージエンドポイントテスト失敗');
    } else {
      const messagesData = await messagesResponse.json();
      console.log('モックデータフラグ:', messagesData.is_mock ? '✅ モックデータ' : '❌ 実データ');
      console.log('メッセージ数:', messagesData.messages?.length || 0);
      console.log('✅ メッセージエンドポイントテスト成功');
    }
    
  } catch (error) {
    console.error('\n❌ テスト失敗:', error.message);
    console.error('エラー詳細:', error);
  }
  
  console.log('\nテスト終了時刻:', new Date().toLocaleString('ja-JP'));
}

// テスト実行
testFinalAPI();
