/**
 * Detailed test script for Instagram API
 * Tests token validity, permissions, and Instagram business account access
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
      console.error('Error validating token:', JSON.stringify(errorData, null, 2));
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

// Get user profile
async function getUserProfile() {
  try {
    console.log('\nGetting user profile...');
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,accounts{name,id,instagram_business_account}&access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error getting user profile:', JSON.stringify(errorData, null, 2));
      return null;
    }
    
    const data = await response.json();
    console.log('User profile response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
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
      console.error('Error getting Facebook pages:', JSON.stringify(errorData, null, 2));
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
      console.error('Error getting Instagram business account:', JSON.stringify(errorData, null, 2));
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

// Try alternative method to get Instagram business account
async function getInstagramBusinessAccountAlternative() {
  try {
    console.log('\nTrying alternative method to get Instagram business account...');
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=accounts{instagram_business_account}&access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error with alternative method:', JSON.stringify(errorData, null, 2));
      return null;
    }
    
    const data = await response.json();
    console.log('Alternative method response:', JSON.stringify(data, null, 2));
    
    if (!data.accounts || !data.accounts.data || data.accounts.data.length === 0) {
      console.error('❌ No accounts found with alternative method');
      return null;
    }
    
    const accountWithIG = data.accounts.data.find(account => account.instagram_business_account);
    
    if (!accountWithIG) {
      console.error('❌ No Instagram business account found with alternative method');
      return null;
    }
    
    console.log('✅ Found Instagram business account with alternative method:', accountWithIG.instagram_business_account.id);
    return accountWithIG.instagram_business_account.id;
  } catch (error) {
    console.error('Error with alternative method:', error);
    return null;
  }
}

// Main function
async function main() {
  console.log('=== Instagram API Detailed Test ===');
  console.log('Testing with token:', accessToken.substring(0, 10) + '...' + accessToken.substring(accessToken.length - 10));
  
  // Check token validity
  const isTokenValid = await checkTokenValidity();
  
  if (!isTokenValid) {
    console.log('\n=== Test Summary ===');
    console.log('❌ Token is invalid');
    console.log('\nRecommendation: Generate a new access token with the required permissions.');
    return;
  }
  
  // Get user profile
  const userProfile = await getUserProfile();
  
  // Get Facebook pages
  const pageId = await getFacebookPages();
  
  // Get Instagram business account
  let igBusinessAccountId = null;
  
  if (pageId) {
    igBusinessAccountId = await getInstagramBusinessAccount(pageId);
  }
  
  // Try alternative method if needed
  if (!igBusinessAccountId) {
    igBusinessAccountId = await getInstagramBusinessAccountAlternative();
  }
  
  console.log('\n=== Test Summary ===');
  console.log(isTokenValid ? '✅ Token is valid' : '❌ Token is invalid');
  console.log(pageId ? '✅ Facebook page found' : '❌ No Facebook page found');
  console.log(igBusinessAccountId ? '✅ Instagram business account found' : '❌ No Instagram business account found');
  
  if (!igBusinessAccountId) {
    console.log('\nRecommendation: Make sure your Instagram account is a business account and is connected to a Facebook page.');
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
});
