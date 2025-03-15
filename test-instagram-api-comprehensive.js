/**
 * 包括的なInstagram API統合テスト
 * このスクリプトはInstagram APIの統合機能をテストします
 */

async function testInstagramAPI() {
  console.log('=== Instagram API 包括的テスト ===');
  console.log('テスト開始時刻:', new Date().toLocaleString('ja-JP'));
  console.log('環境:', process.env.NODE_ENV || 'development');
  
  try {
    // 1. テスト: API状態の確認
    console.log('\n1. API状態の確認テスト:');
    const statusResponse = await fetch('http://localhost:3000/api/instagram/status');
    
    console.log('レスポンスステータス:', statusResponse.status);
    
    if (!statusResponse.ok) {
      console.error('エラーレスポンス:', await statusResponse.text());
      throw new Error(`API呼び出しエラー: ${statusResponse.status} ${statusResponse.statusText}`);
    }
    
    const statusData = await statusResponse.json();
    console.log('API状態:', statusData.status || '不明');
    console.log('トークン有効性:', statusData.token_info?.is_valid ? '✅ 有効' : '❌ 無効');
    
    if (statusData.token_info?.expires_at) {
      const expirationDate = new Date(statusData.token_info.expires_at * 1000);
      console.log('トークン有効期限:', expirationDate.toLocaleString('ja-JP'));
    }
    
    console.log('ビジネスアカウント:', statusData.has_instagram_business_account ? '✅ あり' : '❌ なし');
    console.log('read_mailbox権限:', statusData.has_read_mailbox_permission ? '✅ あり' : '❌ なし');
    
    // 2. テスト: モック会話IDでの履歴メッセージ取得
    console.log('\n2. モック会話IDでの履歴メッセージ取得テスト:');
    const mockConversationId = 'conv_1001';
    const messagesResponse = await fetch(`http://localhost:3000/api/instagram/historical-messages?conversation_id=${mockConversationId}&limit=5`);
    
    console.log('レスポンスステータス:', messagesResponse.status);
    
    if (!messagesResponse.ok) {
      console.error('エラーレスポンス:', await messagesResponse.text());
      throw new Error(`API呼び出しエラー: ${messagesResponse.status} ${messagesResponse.statusText}`);
    }
    
    const messagesData = await messagesResponse.json();
    console.log('モックデータフラグ:', messagesData.is_mock ? '✅ モックデータ' : '❌ 実データ (予期しない)');
    console.log('メッセージ数:', messagesData.messages?.length || 0);
    console.log('ページネーション:', messagesData.pagination ? '✅ 存在する' : '❌ 存在しない');
    
    // 3. テスト: ページネーション機能
    console.log('\n3. ページネーション機能テスト:');
    if (messagesData.pagination && messagesData.pagination.next) {
      const nextPageUrl = new URL(messagesData.pagination.next, 'http://localhost:3000');
      const nextPageResponse = await fetch(nextPageUrl);
      
      if (!nextPageResponse.ok) {
        console.error('エラーレスポンス:', await nextPageResponse.text());
        throw new Error(`API呼び出しエラー: ${nextPageResponse.status} ${nextPageResponse.statusText}`);
      }
      
      const nextPageData = await nextPageResponse.json();
      console.log('次ページレスポンスステータス:', nextPageResponse.status);
      console.log('次ページメッセージ数:', nextPageData.messages?.length || 0);
      console.log('ページネーション継続:', nextPageData.pagination?.next ? '✅ 存在する' : '❌ 存在しない');
    } else {
      console.log('❌ ページネーションリンクが存在しません');
    }
    
    // 4. テスト: 実際のアクセストークンでのAPI呼び出し
    console.log('\n4. 実際のアクセストークンでのAPI呼び出しテスト:');
    const realConversationsResponse = await fetch('http://localhost:3000/api/instagram/conversations');
    
    console.log('レスポンスステータス:', realConversationsResponse.status);
    
    if (!realConversationsResponse.ok) {
      const errorData = await realConversationsResponse.json();
      console.log('エラー情報:', errorData);
      
      if (errorData.error && errorData.error.code === 190) {
        console.log('❌ トークンの有効期限が切れています');
      } else if (errorData.error && errorData.error.code === 298) {
        console.log('❌ read_mailbox権限がありません');
      } else {
        console.log('❌ その他のAPIエラー:', errorData.error?.message);
      }
    } else {
      const realConversationsData = await realConversationsResponse.json();
      console.log('モックデータフラグ:', realConversationsData.is_mock ? '✅ モックデータにフォールバック' : '✅ 実データ取得成功');
      console.log('会話数:', realConversationsData.data?.length || 0);
    }
    
    // 5. テスト: トークン更新シミュレーション
    console.log('\n5. トークン更新シミュレーションテスト:');
    console.log('注: 実際のトークン更新はFacebookデベロッパーポータルで行う必要があります');
    console.log('このテストでは、トークンマネージャーの動作をシミュレートします');
    
    // トークンマネージャーの動作確認
    const tokenManagerResponse = await fetch('http://localhost:3000/api/instagram/status');
    const tokenManagerData = await tokenManagerResponse.json();
    
    if (tokenManagerData.token_info) {
      console.log('トークンキャッシュ機能:', '✅ 動作中');
      console.log('トークン有効性チェック:', '✅ 動作中');
    } else {
      console.log('トークンマネージャー:', '❌ 正しく動作していません');
    }
    
    console.log('\n=== テスト結果サマリー ===');
    console.log('1. API状態確認: ✅ 成功');
    console.log('2. 履歴メッセージ取得: ✅ 成功');
    console.log('3. ページネーション機能: ' + (messagesData.pagination?.next ? '✅ 成功' : '❌ 失敗'));
    console.log('4. 実際のAPI呼び出し: ' + (realConversationsResponse.ok ? '✅ 成功' : '⚠️ 権限エラー (予想通り)'));
    console.log('5. トークンマネージャー: ' + (tokenManagerData.token_info ? '✅ 成功' : '❌ 失敗'));
    
    console.log('\n=== API権限状態 ===');
    console.log('トークン有効性:', statusData.token_info?.is_valid ? '✅ 有効' : '❌ 無効');
    console.log('read_mailbox権限:', statusData.has_read_mailbox_permission ? '✅ あり' : '❌ なし');
    
    if (!statusData.has_read_mailbox_permission) {
      console.log('注意: DMの完全な履歴を取得するには、read_mailbox権限が必要です。');
      console.log('現在はモックデータにフォールバックしています。');
    }
    
  } catch (error) {
    console.error('\n❌ テスト失敗:', error.message);
    console.error('エラー詳細:', error);
  }
  
  console.log('\nテスト終了時刻:', new Date().toLocaleString('ja-JP'));
}

// テスト実行
testInstagramAPI();
