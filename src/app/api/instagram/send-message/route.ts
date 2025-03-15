import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to send a message to an Instagram user
 * This is a server-side implementation to protect API keys
 */
export async function POST(request: NextRequest) {
  try {
    // Get Instagram access token from environment variables
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Instagram access token not configured' },
        { status: 500 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const { recipient_id, message } = body;
    
    if (!recipient_id || !message) {
      return NextResponse.json(
        { error: 'Recipient ID and message are required' },
        { status: 400 }
      );
    }
    
    try {
      // Instagram Graph API base URL
      const INSTAGRAM_GRAPH_API_BASE = 'https://graph.facebook.com';
      const API_VERSION = 'v18.0';
      
      // Endpoint for sending messages
      const endpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me/messages`;
      
      // Make the API request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: { id: recipient_id },
          message: { text: message },
          access_token: accessToken
        }),
      });
      
      const data = await response.json();
      
      // Check for specific permission error
      if (data.error && (data.error.code === 298 || data.error.code === 10)) {
        console.error('Instagram API permission error:', data.error.message);
        return NextResponse.json({ 
          success: false,
          is_mock: true,
          error: `Permission error: ${data.error.message}`
        });
      }
      
      if (!response.ok) {
        console.error(`Instagram API error: ${response.statusText}`);
        return NextResponse.json({ 
          success: false,
          is_mock: true,
          error: `Instagram API error: ${response.statusText}`
        });
      }
      
      return NextResponse.json({ 
        success: true,
        message_id: data.message_id,
        is_mock: false
      });
    } catch (apiError) {
      console.error('Instagram API request failed:', apiError);
      return NextResponse.json({ 
        success: false,
        is_mock: true,
        error: apiError instanceof Error ? apiError.message : 'Unknown Instagram API error'
      });
    }
  } catch (error) {
    console.error('Error sending Instagram message:', error);
    return NextResponse.json(
      { error: 'Failed to send Instagram message' },
      { status: 500 }
    );
  }
}
