/**
 * API route for fetching historical Instagram messages with pagination
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
    
    // Get conversation ID and pagination parameters from query parameters
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversation_id');
    const limit = searchParams.get('limit') || '20';
    const before = searchParams.get('before');
    const after = searchParams.get('after');
    const since = searchParams.get('since');
    const until = searchParams.get('until');
    
    if (!conversationId) {
      return Response.json(
        { error: { message: 'Conversation ID is required' } },
        { status: 400 }
      );
    }
    
    // For mock conversation IDs, return mock data
    if (conversationId.startsWith('conv_')) {
      console.log('Using mock data for conversation:', conversationId);
      
      // Get mock messages
      const mockMessages = getMockMessages(conversationId);
      
      // Create mock pagination
      const mockPagination = {
        previous: before ? `/api/instagram/historical-messages?conversation_id=${conversationId}&limit=${limit}&after=${mockMessages[0]?.id}` : null,
        next: `/api/instagram/historical-messages?conversation_id=${conversationId}&limit=${limit}&before=${mockMessages[mockMessages.length - 1]?.id}`
      };
      
      return Response.json({
        messages: mockMessages,
        is_mock: true,
        pagination: mockPagination
      });
    }
    
    // Endpoint for messages in a specific conversation
    const messagesEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/${conversationId}/messages`;
    
    // Parameters for the API request
    const messagesParams = new URLSearchParams({
      access_token: accessToken,
      fields: 'from,message,created_time',
      limit
    });
    
    // Add pagination parameters if provided
    if (before) messagesParams.append('before', before);
    if (after) messagesParams.append('after', after);
    if (since) messagesParams.append('since', since);
    if (until) messagesParams.append('until', until);
    
    // Make the API request
    const messagesUrl = `${messagesEndpoint}?${messagesParams}`;
    const response = await fetch(messagesUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Instagram API error:', data);
      
      // Check if this is a permission error (code 298 - read_mailbox permission required)
      if (data.error && data.error.code === 298) {
        console.warn('Permission error: read_mailbox permission required. Using mock data.');
        
        // Return mock data with error information and pagination
        const mockMessages = getMockMessages(conversationId);
        
        // Create mock pagination
        const mockPagination = {
          previous: before ? `/api/instagram/historical-messages?conversation_id=${conversationId}&limit=${limit}&after=${mockMessages[0]?.id}` : null,
          next: `/api/instagram/historical-messages?conversation_id=${conversationId}&limit=${limit}&before=${mockMessages[mockMessages.length - 1]?.id}`
        };
        
        return Response.json({
          messages: mockMessages,
          is_mock: true,
          error: data.error,
          pagination: mockPagination
        });
      }
      
      return Response.json(
        { error: data.error },
        { status: response.status }
      );
    }
    
    return Response.json({
      messages: data.data,
      is_mock: false,
      pagination: data.paging
    });
  } catch (error) {
    console.error('Error fetching Instagram historical messages:', error);
    
    // Get conversation ID from query parameters
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversation_id');
    
    // Return mock data on error
    const mockMessages = getMockMessages(conversationId || 'conv_1001');
    
    // Create mock pagination
    const mockPagination = {
      next: `/api/instagram/historical-messages?conversation_id=${conversationId}&limit=20&before=${mockMessages[mockMessages.length - 1]?.id}`
    };
    
    return Response.json({
      messages: mockMessages,
      is_mock: true,
      error: { message: error.message },
      pagination: mockPagination
    });
  }
}
