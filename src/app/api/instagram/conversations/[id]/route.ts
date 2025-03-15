import { NextRequest, NextResponse } from 'next/server';
import { Message } from '../../../../types';

/**
 * API route to fetch messages for a specific Instagram conversation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get Instagram access token from environment variables
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Instagram access token not configured' },
        { status: 500 }
      );
    }
    
    const conversationId = params.id;
    
    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }
    
    try {
      // Instagram Graph API base URL
      const INSTAGRAM_GRAPH_API_BASE = 'https://graph.facebook.com';
      const API_VERSION = 'v18.0';
      
      // Endpoint for conversation messages
      const endpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/${conversationId}/messages`;
      
      // Parameters for the API request
      const urlParams = new URLSearchParams({
        access_token: accessToken,
        fields: 'from,message,created_time'
      });
      
      // Make the API request
      const response = await fetch(`${endpoint}?${urlParams}`);
      
      if (!response.ok) {
        console.error(`Instagram API error: ${response.statusText}`);
        // Fall back to mock data if API fails
        return NextResponse.json({ 
          messages: getMockMessages(conversationId),
          is_mock: true,
          error: `Instagram API error: ${response.statusText}`
        });
      }
      
      const data = await response.json();
      
      // Transform the response to match our Message type
      const messages: Message[] = [];
      
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach((msg: any) => {
          const isFromInstagram = msg.from.id !== 'me'; // Assuming 'me' is the business
          
          messages.push({
            id: msg.id,
            sender_id: isFromInstagram ? msg.from.id : 'business',
            recipient_id: isFromInstagram ? 'business' : msg.from.id,
            text: msg.message,
            timestamp: msg.created_time,
            is_from_instagram: isFromInstagram
          });
        });
      }
      
      return NextResponse.json({ messages, is_mock: false });
    } catch (apiError) {
      console.error('Instagram API request failed:', apiError);
      // Fall back to mock data if API request fails
      return NextResponse.json({ 
        messages: getMockMessages(conversationId),
        is_mock: true,
        error: apiError instanceof Error ? apiError.message : 'Unknown Instagram API error'
      });
    }
  } catch (error) {
    console.error('Error fetching conversation messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation messages' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get mock messages for a specific conversation
 */
function getMockMessages(conversationId: string): Message[] {
  // Generate different mock messages based on conversation ID
  const mockMessages: Message[] = [
    {
      id: `msg1-${conversationId}`,
      sender_id: conversationId,
      recipient_id: 'business',
      text: '商品について質問があります。',
      timestamp: new Date().toISOString(),
      is_from_instagram: true
    },
    {
      id: `msg2-${conversationId}`,
      sender_id: 'business',
      recipient_id: conversationId,
      text: 'はい、喜んでお手伝いします。どのような質問ですか？',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      is_from_instagram: false
    },
    {
      id: `msg3-${conversationId}`,
      sender_id: conversationId,
      recipient_id: 'business',
      text: '配送日について知りたいです。',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      is_from_instagram: true
    }
  ];
  
  return mockMessages;
}
