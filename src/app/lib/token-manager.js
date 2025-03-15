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
    
    // Token is invalid, try to refresh (in a real app)
    // For now, just log the error
    console.error('Instagram token is invalid:', data.error);
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
