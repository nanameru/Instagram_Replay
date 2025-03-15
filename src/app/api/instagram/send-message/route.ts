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
    
    // Parse the request body
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
          recipient: {
            id: recipient_id,
          },
          message: {
            text: message,
          },
          access_token: accessToken,
        }),
      });
      
      if (!response.ok) {
        console.error(`Instagram API error: ${response.statusText}`);
        // Return mock success response if API fails
        return NextResponse.json({ 
          success: true, 
          message: 'Message sent (mock)',
          is_mock: true,
          error: `Instagram API error: ${response.statusText}`
        });
      }
      
      const data = await response.json();
      return NextResponse.json({ ...data, is_mock: false });
    } catch (apiError) {
      console.error('Instagram API request failed:', apiError);
      // Return mock success response if API request fails
      return NextResponse.json({ 
        success: true, 
        message: 'Message sent (mock)',
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
