/**
 * API route for fetching Instagram messages
 */

import { getMockMessages } from '../../../lib/client-mock-data.js';

export async function GET(request) {
  try {
    // Get Instagram access token from environment variables
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      return Response.json(
        { error: { message: 'Instagram access token not configured' } },
        { status: 500 }
      );
    }
    
    // Get conversation ID from query parameters
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversation_id') || 'conv_1001';
    
    // Return mock messages for now
    const mockMessages = getMockMessages(conversationId);
    
    return Response.json({
      messages: mockMessages,
      is_mock: true
    });
  } catch (error) {
    console.error('Error fetching Instagram messages:', error);
    
    return Response.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
