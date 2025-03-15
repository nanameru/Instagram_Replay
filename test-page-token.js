/**
 * Test script for Instagram Page Access Token
 * Tests profile information and DM access
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// New page access token from user
const pageAccessToken = 'EAAhYeSTN9z8BOxr9MjpDd07uhE9vZC9B3ieqZAI5QQxZAoWV6RQhu1aKINmekSWSSgTPTS92eymor3OBEwYDBZCFCsqbjnaEIsRnWSJ1rSL9ex9lrWqB23zGWaFeZBPrLu1ap2DREtIxDejhxQ25i5XukHcZBEhXvgfXiE5fZAjEqwvKqYZAjLyZA6gDbrEUURE9kXzAId3sDC5C4vr0ATJZBUoDZCCseNZAOxBLboc3gilPKwZDZD';

// Instagram Graph API base URL
const INSTAGRAM_GRAPH_API_BASE = 'https://graph.facebook.com';
const API_VERSION = 'v18.0';

/**
 * Test profile information access
 */
async function testProfileAccess() {
  try {
    console.log('Testing profile access with page access token...');
    
    // Endpoint for user profile
    const profileEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me`;
    
    // Parameters for the API request
    const profileParams = new URLSearchParams({
      access_token: pageAccessToken,
      fields: 'id,name,instagram_business_account'
    });
    
    // Make the API request
    const profileUrl = `${profileEndpoint}?${profileParams}`;
    const response = await fetch(profileUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Profile access failed:', data);
      return false;
    }
    
    console.log('✅ Profile access successful!');
    console.log('Profile data:', data);
    
    // Check if this is a page with Instagram business account
    if (data.instagram_business_account) {
      console.log('✅ This is a page with Instagram business account!');
      console.log('Instagram business account ID:', data.instagram_business_account.id);
    } else {
      console.log('⚠️ This token does not have an Instagram business account associated with it.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error testing profile access:', error);
    return false;
  }
}

/**
 * Test DM access
 */
async function testDMAccess() {
  try {
    console.log('\nTesting DM access with page access token...');
    
    // Endpoint for conversations
    const conversationsEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me/conversations`;
    
    // Parameters for the API request
    const conversationsParams = new URLSearchParams({
      access_token: pageAccessToken,
      fields: 'participants,messages{from,message,created_time}'
    });
    
    // Make the API request
    const conversationsUrl = `${conversationsEndpoint}?${conversationsParams}`;
    const response = await fetch(conversationsUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ DM access failed:', data);
      
      // Check if this is a permission error (code 298 - read_mailbox permission required)
      if (data.error && data.error.code === 298) {
        console.error('❌ Permission error: read_mailbox permission required.');
        console.error('Error details:', data.error);
      }
      
      return false;
    }
    
    console.log('✅ DM access successful!');
    console.log('Conversations data:', data);
    return true;
  } catch (error) {
    console.error('❌ Error testing DM access:', error);
    return false;
  }
}

/**
 * Main test function
 */
async function runTests() {
  console.log('=== Instagram Page Access Token Test ===');
  console.log('Testing token:', pageAccessToken.substring(0, 10) + '...');
  
  const profileSuccess = await testProfileAccess();
  const dmSuccess = await testDMAccess();
  
  console.log('\n=== Test Summary ===');
  console.log('Profile access:', profileSuccess ? '✅ Success' : '❌ Failed');
  console.log('DM access:', dmSuccess ? '✅ Success' : '❌ Failed');
  
  if (!dmSuccess) {
    console.log('\n=== Recommendations ===');
    console.log('1. Ensure this is a page access token for a page with an Instagram business account');
    console.log('2. Request the read_mailbox permission through the Facebook App Review process');
    console.log('3. Once approved, generate a new token with the required permissions');
  }
}

// Run the tests
runTests();
