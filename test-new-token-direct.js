/**
 * Direct test script for Instagram API with new token
 * Tests token validity and Instagram business account access
 */

const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

// Get access token from environment variable
const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

if (!accessToken) {
  console.error('Error: INSTAGRAM_ACCESS_TOKEN not found in .env.local');
  process.exit(1);
}

// Check token validity
async function checkTokenValidity() {
  try {
    console.log('Checking token validity...');
    
    const response = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error validating token:', errorData);
      return false;
    }
    
    const data = await response.json();
    console.log('Token validation response:', JSON.stringify(data, null, 2));
    
    if (data.data.is_valid) {
      console.log('✅ Token is valid');
      console.log('Token scopes:', data.data.scopes);
      console.log('Token expires at:', data.data.expires_at ? new Date(data.data.expires_at * 1000).toISOString() : 'Never');
      return true;
    } else {
      console.error('❌ Token is invalid');
      return false;
    }
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
}

// Get Facebook pages
async function getFacebookPages() {
  try {
    console.log('\nGetting Facebook pages...');
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error getting Facebook pages:', errorData);
      return null;
    }
    
    const data = await response.json();
    console.log('Facebook pages response:', JSON.stringify(data, null, 2));
    
    if (!data.data || data.data.length === 0) {
      console.error('❌ No Facebook pages found');
      return null;
    }
    
    console.log('✅ Found', data.data.length, 'Facebook page(s)');
    return data.data[0].id;
  } catch (error) {
    console.error('Error getting Facebook pages:', error);
    return null;
  }
}

// Get Instagram business account
async function getInstagramBusinessAccount(pageId) {
  try {
    console.log('\nGetting Instagram business account for page', pageId);
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error getting Instagram business account:', errorData);
      return null;
    }
    
    const data = await response.json();
    console.log('Instagram business account response:', JSON.stringify(data, null, 2));
    
    if (!data.instagram_business_account) {
      console.error('❌ No Instagram business account found for this page');
      return null;
    }
    
    console.log('✅ Found Instagram business account:', data.instagram_business_account.id);
    return data.instagram_business_account.id;
  } catch (error) {
    console.error('Error getting Instagram business account:', error);
    return null;
  }
}

// Main function
async function main() {
  console.log('=== Instagram API Direct Test ===');
  console.log('Testing with token:', accessToken.substring(0, 10) + '...' + accessToken.substring(accessToken.length - 10));
  
  // Check token validity
  const isTokenValid = await checkTokenValidity();
  if (!isTokenValid) {
    console.error('❌ Token validation failed. Cannot proceed with tests.');
    return;
  }
  
  // Get Facebook pages
  const pageId = await getFacebookPages();
  if (!pageId) {
    console.error('❌ Failed to get Facebook pages. Cannot proceed with tests.');
    return;
  }
  
  // Get Instagram business account
  const igBusinessId = await getInstagramBusinessAccount(pageId);
  if (!igBusinessId) {
    console.error('❌ Failed to get Instagram business account. Cannot proceed with tests.');
    console.log('\n=== Test Summary ===');
    console.log('✅ Token is valid');
    console.log('✅ Facebook pages found');
    console.log('❌ Instagram business account not found or not properly connected');
    console.log('\nRecommendation: Ensure your Instagram account is a business account and properly connected to your Facebook page.');
    return;
  }
  
  console.log('\n=== Test Summary ===');
  console.log('✅ Token is valid');
  console.log('✅ Facebook pages found');
  console.log('✅ Instagram business account found');
  console.log('\nAll tests passed! You can now use the Instagram API to access DMs.');
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
});
