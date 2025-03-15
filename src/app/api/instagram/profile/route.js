/**
 * API route for fetching Instagram profile information
 */

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
    
    // Endpoint for user profile
    const profileEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me`;
    
    // Parameters for the API request
    const profileParams = new URLSearchParams({
      access_token: accessToken,
      fields: 'id,name'
    });
    
    // Make the API request
    const profileUrl = `${profileEndpoint}?${profileParams}`;
    const response = await fetch(profileUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Instagram API error:', data);
      return Response.json(
        { error: data.error },
        { status: response.status }
      );
    }
    
    return Response.json(data);
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
    return Response.json(
      { error: { message: error.message } },
      { status: 500 }
    );
  }
}
