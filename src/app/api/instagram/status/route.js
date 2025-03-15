/**
 * API route for checking Instagram API status
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
    
    // Test profile access
    const profileEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me`;
    const profileParams = new URLSearchParams({
      access_token: accessToken,
      fields: 'id,name,instagram_business_account'
    });
    
    const profileUrl = `${profileEndpoint}?${profileParams}`;
    const profileResponse = await fetch(profileUrl);
    const profileData = await profileResponse.json();
    
    // Test DM access
    const conversationsEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me/conversations`;
    const conversationsParams = new URLSearchParams({
      access_token: accessToken,
      fields: 'participants,messages{from,message,created_time}'
    });
    
    const conversationsUrl = `${conversationsEndpoint}?${conversationsParams}`;
    const conversationsResponse = await fetch(conversationsUrl);
    const conversationsData = await conversationsResponse.json();
    
    return Response.json({
      status: 'ok',
      profile: {
        available: profileResponse.ok,
        data: profileResponse.ok ? profileData : null,
        error: !profileResponse.ok ? profileData.error : null
      },
      conversations: {
        available: conversationsResponse.ok,
        data: conversationsResponse.ok ? { count: conversationsData.data?.length || 0 } : null,
        error: !conversationsResponse.ok ? conversationsData.error : null
      },
      token_type: 'page_access_token',
      has_instagram_business_account: profileData.instagram_business_account ? true : false,
      has_read_mailbox_permission: conversationsResponse.ok
    });
  } catch (error) {
    console.error('Error checking Instagram API status:', error);
    
    return Response.json(
      { 
        status: 'error',
        error: { message: error.message },
        profile: { available: false },
        conversations: { available: false },
        has_read_mailbox_permission: false
      },
      { status: 500 }
    );
  }
}
