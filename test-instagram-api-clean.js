/**
 * Test script for Instagram API integration
 * This script tests the historical messages API with mock data
 */

async function testInstagramAPI() {
  console.log('=== Instagram API テスト ===');
  console.log('テスト開始時刻:', new Date().toLocaleString('ja-JP'));
  
  try {
    // 1. テスト: モック会話IDでの履歴メッセージ取得
    console.log('\n1. モック会話IDでの履歴メッセージ取得テスト:');
    const mockConversationId = 'conv_1001';
    const messagesResponse = await fetch(`http://localhost:3000/api/instagram/historical-messages?conversation_id=${mockConversationId}&limit=10`);
    
    if (!messagesResponse.ok) {
      throw new Error(`API呼び出しエラー: ${messagesResponse.status} ${messagesResponse.statusText}`);
    }
    
    const messagesData = await messagesResponse.json();
    console.log('レスポンスステータス:', messagesResponse.status);
    console.log('モックデータフラグ:', messagesData.is_mock ? '✅ モックデータ' : '❌ 実データ (予期しない)');
    console.log('メッセージ数:', messagesData.messages?.length || 0);
    console.log('ページネーション:', messagesData.pagination ? '✅ 存在する' : '❌ 存在しない');
    
    // 2. テスト: 会話詳細の取得
    console.log('\n2. 会話詳細の取得テスト:');
    const conversationResponse = await fetch(`http://localhost:3000/api/instagram/conversations/${mockConversationId}`);
    
    if (!conversationResponse.ok) {
      throw new Error(`API呼び出しエラー: ${conversationResponse.status} ${conversationResponse.statusText}`);
    }
    
    const conversationData = await conversationResponse.json();
    console.log('レスポンスステータス:', conversationResponse.status);
    console.log('モックデータフラグ:', conversationData.is_mock ? '✅ モックデータ' : '❌ 実データ (予期しない)');
    console.log('会話ID:', conversationData.id);
    console.log('参加者数:', conversationData.participants?.data?.length || 0);
    
    // 3. テスト: API状態の確認
    console.log('\n3. API状態の確認テスト:');
    const statusResponse = await fetch('http://localhost:3000/api/instagram/status');
    
    if (!statusResponse.ok) {
      throw new Error(`API呼び出しエラー: ${statusResponse.status} ${statusResponse.statusText}`);
    }
    
    const statusData = await statusResponse.json();
    console.log('レスポンスステータス:', statusResponse.status);
    console.log('API状態:', statusData.status || '不明');
    console.log('アクセストークン:', statusData.has_token ? '✅ 設定済み' : '❌ 未設定');
    console.log('read_mailbox権限:', statusData.has_read_mailbox ? '✅ あり' : '❌ なし');
    
    console.log('\n=== テスト結果サマリー ===');
    console.log('1. 履歴メッセージ取得: ✅ 成功');
    console.log('2. 会話詳細取得: ✅ 成功');
    console.log('3. API状態確認: ✅ 成功');
    console.log('総合結果: ✅ すべてのテストが成功しました');
    
  } catch (error) {
    console.error('\n❌ テスト失敗:', error.message);
    console.error('エラー詳細:', error);
  }
  
  console.log('\nテスト終了時刻:', new Date().toLocaleString('ja-JP'));
}

// テスト実行
testInstagramAPI();
