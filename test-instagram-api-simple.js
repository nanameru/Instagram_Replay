/**
 * Simple Instagram API integration test
 */

async function testInstagramAPI() {
  console.log('=== Instagram API 簡易テスト ===');
  console.log('テスト開始時刻:', new Date().toLocaleString('ja-JP'));
  
  try {
    // 1. Test: Mock conversations endpoint
    console.log('\n1. モック会話エンドポイントテスト:');
    const conversationsResponse = await fetch('http://localhost:3000/api/instagram/conversations');
    
    console.log('レスポンスステータス:', conversationsResponse.status);
    
    if (!conversationsResponse.ok) {
      console.log('エラーレスポンス:', await conversationsResponse.text());
    } else {
      const conversationsData = await conversationsResponse.json();
      console.log('モックデータフラグ:', conversationsData.is_mock ? '✅ モックデータ' : '❌ 実データ');
      console.log('会話数:', conversationsData.data?.length || 0);
    }
    
    // 2. Test: Mock messages endpoint
    console.log('\n2. モックメッセージエンドポイントテスト:');
    const messagesResponse = await fetch('http://localhost:3000/api/instagram/messages');
    
    console.log('レスポンスステータス:', messagesResponse.status);
    
    if (!messagesResponse.ok) {
      console.log('エラーレスポンス:', await messagesResponse.text());
    } else {
      const messagesData = await messagesResponse.json();
      console.log('モックデータフラグ:', messagesData.is_mock ? '✅ モックデータ' : '❌ 実データ');
      console.log('メッセージ数:', messagesData.messages?.length || 0);
    }
    
    console.log('\n=== テスト結果サマリー ===');
    console.log('1. モック会話エンドポイント: ' + (conversationsResponse.ok ? '✅ 成功' : '❌ 失敗'));
    console.log('2. モックメッセージエンドポイント: ' + (messagesResponse.ok ? '✅ 成功' : '❌ 失敗'));
    
  } catch (error) {
    console.error('\n❌ テスト失敗:', error.message);
    console.error('エラー詳細:', error);
  }
  
  console.log('\nテスト終了時刻:', new Date().toLocaleString('ja-JP'));
}

// テスト実行
testInstagramAPI();
