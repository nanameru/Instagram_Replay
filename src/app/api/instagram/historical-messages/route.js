/**
 * API route for fetching historical Instagram messages
 * This is a standalone implementation that doesn't rely on external imports
 */

export async function GET(request) {
  try {
    // Get Instagram access token from environment variables
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      return Response.json(
        { 
          error: { 
            message: 'Instagram アクセストークンが設定されていません', 
            code: 401 
          },
          is_mock: true,
          messages: generateMockMessages('historical_conv', 15)
        },
        { status: 200 }
      );
    }
    
    // In a real implementation, we would call the Instagram Graph API here
    // However, the read_mailbox permission is required for this endpoint
    // This permission is only available to business accounts with specific approvals
    
    // For demonstration purposes, we'll return a permission error
    // This simulates the actual behavior of the Instagram API when permissions are insufficient
    return Response.json(
      {
        error: {
          message: '権限が不足しています: read_mailbox 権限が必要です',
          code: 298,
          type: 'OAuthException'
        },
        is_mock: true,
        messages: generateMockMessages('historical_conv', 15)
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching historical Instagram messages:', error);
    
    return Response.json(
      { 
        error: { 
          message: error.message,
          code: 500
        },
        is_mock: true,
        messages: []
      },
      { status: 500 }
    );
  }
}

/**
 * Generate mock messages for a conversation
 * @param {string} conversationId - The ID of the conversation
 * @param {number} count - Number of messages to generate (default: 10)
 * @returns {Array} Array of mock message objects
 */
function generateMockMessages(conversationId, count = 10) {
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
      message: `これは過去のテストメッセージ #${count - i} です。会話ID: ${conversationId}`,
      created_time: timestamp.toISOString()
    });
  }
  
  return messages;
}
