/**
 * Instagram token management utilities
 */

// Store the token and its expiration
let cachedToken = null;
let tokenExpiration = null;

/**
 * Get a valid access token, refreshing if necessary
 * @returns {Promise<string>} Valid access token
 */
export async function getValidToken() {
  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  // If we don't have a token, return null
  if (!currentToken) {
    console.warn('No Instagram access token configured');
    return null;
  }
  
  // If token is cached and not expired, return it
  if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
    return cachedToken;
  }
  
  // Check token validity
  try {
    const response = await fetch(`https://graph.facebook.com/debug_token?input_token=${currentToken}&access_token=${currentToken}`);
    const data = await response.json();
    
    if (response.ok && data.data && data.data.is_valid) {
      // Update cache
      cachedToken = currentToken;
      tokenExpiration = data.data.expires_at * 1000; // Convert to milliseconds
      return currentToken;
    }
    
    // Token is invalid, try to refresh
    console.warn('Instagram token is invalid or expired, attempting to refresh...');
    const refreshResult = await refreshToken();
    
    if (refreshResult.success && refreshResult.token) {
      console.log('Token refreshed successfully');
      // In a production app, we would update the environment variable
      // For now, we'll just update the cache
      cachedToken = refreshResult.token;
      
      // Check the new token's expiration
      const newTokenResponse = await fetch(`https://graph.facebook.com/debug_token?input_token=${refreshResult.token}&access_token=${refreshResult.token}`);
      const newTokenData = await newTokenResponse.json();
      
      if (newTokenResponse.ok && newTokenData.data && newTokenData.data.expires_at) {
        tokenExpiration = newTokenData.data.expires_at * 1000;
      } else {
        // Default to 60 days if we can't determine expiration
        tokenExpiration = Date.now() + (60 * 24 * 60 * 60 * 1000);
      }
      
      return refreshResult.token;
    }
    
    console.error('Instagram token is invalid and could not be refreshed:', data.error);
    return null;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return null;
  }
}

/**
 * Check if token has specific permission
 * @param {string} permission Permission to check
 * @returns {Promise<boolean>} Whether token has the permission
 */
export async function hasPermission(permission) {
  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!currentToken) return false;
  
  try {
    const response = await fetch(`https://graph.facebook.com/debug_token?input_token=${currentToken}&access_token=${currentToken}`);
    const data = await response.json();
    
    if (response.ok && data.data && data.data.scopes) {
      return data.data.scopes.includes(permission);
    }
    return false;
  } catch (error) {
    console.error('Error checking token permissions:', error);
    return false;
  }
}

/**
 * Get detailed token information
 * @returns {Promise<Object>} Token information
 */
export async function getTokenInfo() {
  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!currentToken) {
    return { is_valid: false, error: 'No token configured' };
  }
  
  try {
    const response = await fetch(`https://graph.facebook.com/debug_token?input_token=${currentToken}&access_token=${currentToken}`);
    const data = await response.json();
    
    if (response.ok && data.data) {
      return {
        is_valid: data.data.is_valid,
        app_id: data.data.app_id,
        application: data.data.application,
        expires_at: data.data.expires_at,
        scopes: data.data.scopes || [],
        type: data.data.type
      };
    }
    
    return { is_valid: false, error: data.error };
  } catch (error) {
    return { is_valid: false, error: error.message };
  }
}

/**
 * Check if token has read_mailbox permission
 * @returns {Promise<boolean>} Whether token has read_mailbox permission
 */
export async function hasReadMailboxPermission() {
  return hasPermission('read_mailbox');
}

/**
 * Attempt to refresh the access token
 * @returns {Promise<{success: boolean, token?: string, error?: string}>} Result of the refresh attempt
 */
export async function refreshToken() {
  const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  
  if (!currentToken) {
    return { success: false, error: 'No token configured' };
  }
  
  if (!appId || !appSecret) {
    return { success: false, error: 'App ID or App Secret not configured' };
  }
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${currentToken}`
    );
    
    const data = await response.json();
    
    if (data.access_token) {
      // In a production app, you would save this token to a secure storage
      // For now, we'll just return it
      return { success: true, token: data.access_token };
    }
    
    return { success: false, error: data.error?.message || 'Failed to refresh token' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
