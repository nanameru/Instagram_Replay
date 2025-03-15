import { NextResponse } from 'next/server';
import { Conversation } from '../../../types';

/**
 * API route to fetch Instagram conversations
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
        fields: 'participants,updated_time,messages.limit(1){from,message,created_time}'
      });
      
      // Make the API request
      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();
      
      // Check for specific permission error
      if (data.error && data.error.code === 298) {
        console.error('Instagram API permission error: Reading mailbox messages requires the extended permission read_mailbox');
        return NextResponse.json({ 
          conversations: getMockConversations(),
          is_mock: true,
          error: 'Permission error: Reading mailbox messages requires the extended permission read_mailbox'
        });
      }
      
      if (!response.ok) {
        console.error(`Instagram API error: ${response.statusText}`);
        // Fall back to mock data if API fails
        return NextResponse.json({ 
          conversations: getMockConversations(),
          is_mock: true,
          error: `Instagram API error: ${response.statusText}`
        });
      }
      
      // Transform the response to match our Conversation type
      const conversations: Conversation[] = [];
      
      if (data.data && Array.isArray(data.data)) {
        data.data.forEach((conv: any) => {
          if (conv.participants && conv.participants.data && conv.participants.data.length > 0) {
            // Find the participant that is not the business
            const customer = conv.participants.data.find((p: any) => p.id !== 'me');
            
            if (customer) {
              let lastMessageText = '';
              let lastMessageTime = conv.updated_time;
              
              // Get the last message if available
              if (conv.messages && conv.messages.data && conv.messages.data.length > 0) {
                const lastMessage = conv.messages.data[0];
                lastMessageText = lastMessage.message;
                lastMessageTime = lastMessage.created_time;
              }
              
              conversations.push({
                id: conv.id,
                customer_id: customer.id,
                customer_name: customer.username || customer.name || 'Instagram User',
                last_message: lastMessageText,
                last_message_time: lastMessageTime,
                unread_count: 0 // API doesn't provide this directly
              });
            }
          }
        });
      }
      
      return NextResponse.json({ conversations, is_mock: false });
    } catch (apiError) {
      console.error('Instagram API request failed:', apiError);
      // Fall back to mock data if API request fails
      return NextResponse.json({ 
        conversations: getMockConversations(),
        is_mock: true,
        error: apiError instanceof Error ? apiError.message : 'Unknown Instagram API error'
      });
    }
  } catch (error) {
    console.error('Error fetching Instagram conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram conversations' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get mock conversations for fallback
 */
function getMockConversations(): Conversation[] {
  return [
    {
      id: 'conv1',
      customer_id: 'user1',
      customer_name: '田中さん',
      last_message: '商品について質問があります。',
      last_message_time: new Date().toISOString(),
      unread_count: 2
    },
    {
      id: 'conv2',
      customer_id: 'user2',
      customer_name: '佐藤さん',
      last_message: 'ありがとうございました！',
      last_message_time: new Date(Date.now() - 3600000).toISOString(),
      unread_count: 0
    },
    {
      id: 'conv3',
      customer_id: 'user3',
      customer_name: '鈴木さん',
      last_message: '配送状況を教えてください。',
      last_message_time: new Date(Date.now() - 86400000).toISOString(),
      unread_count: 1
    }
  ];
}
