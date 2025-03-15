/**
 * Mock data for Instagram API integration
 * Used when real API access is not available due to permission limitations
 */

/**
 * Generate mock messages for a conversation
 * @param {string} conversationId - The ID of the conversation
 * @param {number} count - Number of messages to generate (default: 20)
 * @returns {Array} Array of mock message objects
 */
export function getMockMessages(conversationId, count = 20) {
  // Use conversation ID as seed for consistent data generation
  const seed = conversationId.replace(/\D/g, '') || '1001';
  const seedNum = parseInt(seed, 10);
  
  const messages = [];
  const users = [
    { id: 'user_123', name: 'テストユーザー' },
    { id: 'page_456', name: 'インスタグラムページ' }
  ];
  
  // Generate mock messages
  for (let i = 0; i < count; i++) {
    const messageId = `msg_${seedNum}_${i}`;
    const fromIndex = (seedNum + i) % 2; // Alternate between users
    const timestamp = new Date(Date.now() - (i * 3600000)); // 1 hour intervals
    
    messages.push({
      id: messageId,
      from: users[fromIndex],
      message: `これはテストメッセージ #${count - i} です。会話ID: ${conversationId}`,
      created_time: timestamp.toISOString()
    });
  }
  
  return messages;
}

/**
 * Generate mock conversations list
 * @param {number} count - Number of conversations to generate (default: 5)
 * @returns {Array} Array of mock conversation objects
 */
export function getMockConversations(count = 5) {
  const conversations = [];
  
  for (let i = 0; i < count; i++) {
    const conversationId = `conv_${1001 + i}`;
    const timestamp = new Date(Date.now() - (i * 86400000)); // 1 day intervals
    
    conversations.push({
      id: conversationId,
      participants: {
        data: [
          {
            id: `user_${123 + i}`,
            name: `テストユーザー${i + 1}`,
            profile_pic: `https://via.placeholder.com/50?text=User${i + 1}`
          }
        ]
      },
      updated_time: timestamp.toISOString(),
      message_count: 15 + i,
      unread_count: i % 3,
      link: `/conversations/${conversationId}`
    });
  }
  
  return conversations;
}

/**
 * Generate mock profile data
 * @returns {Object} Mock profile object
 */
export function getMockProfile() {
  return {
    id: 'page_456',
    name: 'テスト Instagram ページ',
    profile_pic: 'https://via.placeholder.com/100?text=TestPage',
    instagram_business_account: {
      id: 'insta_789',
      name: 'テスト ビジネスアカウント',
      profile_picture_url: 'https://via.placeholder.com/200?text=Business'
    }
  };
}
