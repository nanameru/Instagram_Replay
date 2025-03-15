import { NextResponse } from 'next/server';

/**
 * API route to check environment variables configuration
 * This is a server-side implementation to protect API keys
 */
export async function GET() {
  try {
    // Get environment variables
    const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const instagramAppToken = process.env.INSTAGRAM_APP_TOKEN;
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    // Mask sensitive tokens for display
    const maskToken = (token: string | undefined) => {
      if (!token) return null;
      if (token.length <= 8) return '********';
      return token.substring(0, 4) + '********' + token.substring(token.length - 4);
    };
    
    // Check if environment variables are configured
    const envStatus = {
      instagram_access_token: {
        configured: !!instagramAccessToken,
        value: maskToken(instagramAccessToken)
      },
      instagram_app_token: {
        configured: !!instagramAppToken,
        value: maskToken(instagramAppToken)
      },
      openai_api_key: {
        configured: !!openaiApiKey,
        value: maskToken(openaiApiKey)
      }
    };
    
    return NextResponse.json({ 
      status: 'success',
      env_status: envStatus
    });
  } catch (error) {
    console.error('Error checking environment variables:', error);
    return NextResponse.json(
      { error: 'Failed to check environment variables' },
      { status: 500 }
    );
  }
}
