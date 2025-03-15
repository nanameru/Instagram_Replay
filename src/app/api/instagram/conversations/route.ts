/**
 * API route for fetching Instagram conversations
 */

import { getMockConversations } from '../../../lib/client-mock-data.js';

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
    
    // Endpoint for conversations
    const conversationsEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me/conversations`;
    
    // Parameters for the API request
    const conversationsParams = new URLSearchParams({
      access_token: accessToken,
      fields: 'participants,updated_time,message_count,unread_count'
    });
    
    // Make the API request
    const conversationsUrl = `${conversationsEndpoint}?${conversationsParams}`;
    const response = await fetch(conversationsUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Instagram API error:', data);
      
      // Check if this is a permission error (code 298 - read_mailbox permission required)
      if (data.error && data.error.code === 298) {
        console.warn('Permission error: read_mailbox permission required. Using mock data.');
        
        // Return mock data with error information
        return Response.json({
          data: getMockConversations(),
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
      data: data.data,
      is_mock: false,
      pagination: data.paging
    });
  } catch (error) {
    console.error('Error fetching Instagram conversations:', error);
    
    // Return mock data on error
    return Response.json({
      data: getMockConversations(),
      is_mock: true,
      error: { message: error.message }
    });
  }
}
