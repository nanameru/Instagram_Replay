/**
 * Standalone API route for Instagram integration testing
 * This route doesn't depend on any external modules to avoid import issues
 */

export async function GET(request) {
  try {
    // Get Instagram access token from environment variables
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    // Generate mock messages for testing
    const mockMessages = generateMockMessages('conv_test');
    
    // Return basic status information
    return Response.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      token_available: !!accessToken,
      environment: process.env.NODE_ENV,
      messages: mockMessages,
      is_mock: true
    });
  } catch (error) {
    console.error('Error in standalone endpoint:', error);
    
    return Response.json({
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
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
      message: `これはテストメッセージ #${count - i} です。会話ID: ${conversationId}`,
      created_time: timestamp.toISOString()
    });
  }
  
  return messages;
}
