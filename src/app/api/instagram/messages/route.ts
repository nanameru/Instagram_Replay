import { NextResponse } from 'next/server';
import { Message } from '../../../types';

/**
 * API route to fetch Instagram messages
 * This is a server-side implementation to protect API keys
 */
export async function GET() {
  try {
    // Get Instagram access token from environment variables
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Instagram access token not configured' },
        { status: 500 }
      );
    }
    
    try {
      // Instagram Graph API base URL
      const INSTAGRAM_GRAPH_API_BASE = 'https://graph.facebook.com';
      const API_VERSION = 'v18.0';
      
      // Endpoint for conversations
      const endpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me/conversations`;
      
      // Parameters for the API request
      const params = new URLSearchParams({
        access_token: accessToken,
        fields: 'participants,messages{from,message,created_time}'
      });
      
      // Make the API request
      const response = await fetch(`${endpoint}?${params}`);
      
      if (!response.ok) {
        console.error(`Instagram API error: ${response.statusText}`);
        // Fall back to mock data if API fails
        return NextResponse.json({ 
          messages: getMockMessages(),
          is_mock: true,
          error: `Instagram API error: ${response.statusText}`
        });
      }
      
      const data = await response.json();
      
      // Transform the response to match our Message type
      const messages: Message[] = [];
      
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach((conversation: any) => {
          if (conversation.messages && conversation.messages.data) {
            conversation.messages.data.forEach((msg: any) => {
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
        });
      }
      
      return NextResponse.json({ messages, is_mock: false });
    } catch (apiError) {
      console.error('Instagram API request failed:', apiError);
      // Fall back to mock data if API request fails
      return NextResponse.json({ 
        messages: getMockMessages(),
        is_mock: true,
        error: apiError instanceof Error ? apiError.message : 'Unknown Instagram API error'
      });
    }
  } catch (error) {
    console.error('Error fetching Instagram messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram messages' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get mock messages for fallback
 */
function getMockMessages(): Message[] {
  return [
    {
      id: 'msg1',
      sender_id: 'user1',
      recipient_id: 'business',
      text: '商品について質問があります。',
      timestamp: new Date().toISOString(),
      is_from_instagram: true
    },
    {
      id: 'msg2',
      sender_id: 'business',
      recipient_id: 'user1',
      text: 'はい、喜んでお手伝いします。どのような質問ですか？',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      is_from_instagram: false
    },
    {
      id: 'msg3',
      sender_id: 'user2',
      recipient_id: 'business',
      text: 'この商品はいつ入荷予定ですか？',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      is_from_instagram: true
    }
  ];
}
