/**
 * API route for checking Instagram API status
 */

import { getTokenInfo, hasReadMailboxPermission } from '../../../lib/token-manager';

export async function GET(request) {
  try {
    // Get Instagram access token from environment variables
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      return Response.json({
        status: "error",
        error: "Instagram access token not configured",
        token_type: null,
        has_instagram_business_account: false,
        has_read_mailbox_permission: false
      });
    }
    
    // Get token information
    const tokenInfo = await getTokenInfo();
    
    // Check if token has read_mailbox permission
    const hasReadMailbox = await hasReadMailboxPermission();
    
    // Instagram Graph API base URL
    const INSTAGRAM_GRAPH_API_BASE = 'https://graph.facebook.com';
    const API_VERSION = 'v18.0';
    
    // Check profile access
    let profileStatus = { available: false, data: null, error: null };
    try {
      const profileResponse = await fetch(`${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me?fields=id,name,instagram_business_account&access_token=${accessToken}`);
      const profileData = await profileResponse.json();
      
      if (profileResponse.ok) {
        profileStatus = {
          available: true,
          data: profileData,
          error: null
        };
      } else {
        profileStatus = {
          available: false,
          data: null,
          error: profileData.error
        };
      }
    } catch (error) {
      profileStatus = {
        available: false,
        data: null,
        error: { message: error.message }
      };
    }
    
    // Check conversations access
    let conversationsStatus = { available: false, data: null, error: null };
    try {
      const conversationsResponse = await fetch(`${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me/conversations?fields=participants&access_token=${accessToken}`);
      const conversationsData = await conversationsResponse.json();
      
      if (conversationsResponse.ok) {
        conversationsStatus = {
          available: true,
          data: conversationsData,
          error: null
        };
      } else {
        conversationsStatus = {
          available: false,
          data: null,
          error: conversationsData.error
        };
      }
    } catch (error) {
      conversationsStatus = {
        available: false,
        data: null,
        error: { message: error.message }
      };
    }
    
    // Determine token type
    let tokenType = "unknown";
    if (tokenInfo.type) {
      tokenType = tokenInfo.type;
    } else if (profileStatus.data?.instagram_business_account) {
      tokenType = "page_access_token";
    } else {
      tokenType = "user_access_token";
    }
    
    // Determine if we have an Instagram business account
    const hasInstagramBusinessAccount = 
      profileStatus.available && 
      profileStatus.data?.instagram_business_account !== undefined;
    
    return Response.json({
      status: "ok",
      profile: profileStatus,
      conversations: conversationsStatus,
      token_info: tokenInfo,
      token_type: tokenType,
      has_instagram_business_account: hasInstagramBusinessAccount,
      has_read_mailbox_permission: hasReadMailbox
    });
  } catch (error) {
    console.error('Error checking Instagram API status:', error);
    
    return Response.json({
      status: "error",
      error: error.message,
      token_type: null,
      has_instagram_business_account: false,
      has_read_mailbox_permission: false
    }, { status: 500 });
  }
}
