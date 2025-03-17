/**
 * Simple test script for Instagram API
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

// Main function
async function main() {
  console.log('=== Instagram API Simple Test ===');
  console.log('Testing with token:', accessToken.substring(0, 10) + '...' + accessToken.substring(accessToken.length - 10));
  
  // Check token validity
  const isTokenValid = await checkTokenValidity();
  
  console.log('\n=== Test Summary ===');
  console.log(isTokenValid ? '✅ Token is valid' : '❌ Token is invalid');
  
  if (!isTokenValid) {
    console.log('\nRecommendation: Generate a new access token with the required permissions.');
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
});
