/**
 * API route for fetching Instagram messages
 */

import { getMockMessages } from '../../../lib/client-mock-data';

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
    
    // Instagram Graph API base URL
    const INSTAGRAM_GRAPH_API_BASE = 'https://graph.facebook.com';
    const API_VERSION = 'v18.0';
    
    // Get conversation ID from query parameters
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversation_id');
    
    if (!conversationId) {
      return Response.json(
        { error: { message: 'Conversation ID is required' } },
        { status: 400 }
      );
    }
    
    // Endpoint for messages in a specific conversation
    const messagesEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/${conversationId}/messages`;
    
    // Parameters for the API request
    const messagesParams = new URLSearchParams({
      access_token: accessToken,
      fields: 'from,message,created_time'
    });
    
    // Make the API request
    const messagesUrl = `${messagesEndpoint}?${messagesParams}`;
    const response = await fetch(messagesUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Instagram API error:', data);
      
      // Check if this is a permission error (code 298 - read_mailbox permission required)
      if (data.error && data.error.code === 298) {
        console.warn('Permission error: read_mailbox permission required. Using mock data.');
        
        // Return mock data with error information
        return Response.json({
          messages: getMockMessages(conversationId),
          is_mock: true,
          error: data.error
        });
      }
      
      return Response.json(
        { error: data.error },
        { status: response.status }
      );
    }
    
    return Response.json({
      messages: data.data,
      is_mock: false
    });
  } catch (error) {
    console.error('Error fetching Instagram messages:', error);
    
    // Get conversation ID from query parameters
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversation_id');
    
    // Return mock data on error
    return Response.json({
      messages: getMockMessages(conversationId || 'conv_1001'),
      is_mock: true,
      error: { message: error.message }
    });
  }
}
