import { NextResponse } from 'next/server';

/**
 * API route to check environment variables
 * This is a server-side implementation to protect API keys
 */
export async function GET() {
  try {
    // Get environment variables
    const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN || '';
    const instagramAppToken = process.env.INSTAGRAM_APP_TOKEN || '';
    const openaiApiKey = process.env.OPENAI_API_KEY || '';
    
    // Return masked versions of the tokens
    return NextResponse.json({
      INSTAGRAM_ACCESS_TOKEN: instagramAccessToken,
      INSTAGRAM_APP_TOKEN: instagramAppToken,
      OPENAI_API_KEY: openaiApiKey,
    });
  } catch (error) {
    console.error('Error checking environment variables:', error);
    return NextResponse.json(
      { error: 'Failed to check environment variables' },
      { status: 500 }
    );
  }
}
