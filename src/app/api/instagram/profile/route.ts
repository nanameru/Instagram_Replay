import { NextResponse } from 'next/server';

/**
 * API route to fetch Instagram profile information
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
    
    // Instagram Graph API base URL
    const INSTAGRAM_API_BASE = 'https://graph.instagram.com';
    
    // Endpoint for profile information
    const endpoint = `${INSTAGRAM_API_BASE}/me`;
    
    // Parameters for the API request
    const params = new URLSearchParams({
      access_token: accessToken,
      fields: 'id,username,name,profile_picture_url'
    });
    
    try {
      // Make the API request
      const response = await fetch(`${endpoint}?${params}`);
      
      if (!response.ok) {
        console.error(`Instagram API error: ${response.statusText}`);
        // Fall back to mock data if API fails
        const mockProfile = {
          id: '17841123456789',
          username: 'example_business',
          name: 'Example Business',
          profile_picture_url: 'https://placekitten.com/200/200'
        };
        
        return NextResponse.json({ 
          profile: mockProfile,
          is_mock: true,
          error: `Instagram API error: ${response.statusText}`
        });
      }
      
      const profile = await response.json();
      return NextResponse.json({ profile, is_mock: false });
    } catch (apiError) {
      console.error('Instagram API request failed:', apiError);
      // Fall back to mock data if API request fails
      const mockProfile = {
        id: '17841123456789',
        username: 'example_business',
        name: 'Example Business',
        profile_picture_url: 'https://placekitten.com/200/200'
      };
      
      return NextResponse.json({ 
        profile: mockProfile,
        is_mock: true,
        error: apiError instanceof Error ? apiError.message : 'Unknown Instagram API error'
      });
    }
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram profile' },
      { status: 500 }
    );
  }
}
