/**
 * Comprehensive test script for token management functionality
 */

const fetch = require('node-fetch');

// Base URL for API endpoints
const BASE_URL = 'http://localhost:3000';

// Test access token (this should be a valid token for testing)
const TEST_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || 'EAAhYeSTN9z8BO6Aqh4kkPyr1vOkqacWEHW336oAiE5cWhwPHgmD8TdB4Psa9o0lEDK5ayUKLNvpGsfHUDSZBenC2ZBXe8owqkj6IzjApVipjMqHQh7hMcAUEjZC3xW375vf2tOatfKvUB2jxpMdvLMfZB9Pv1t1s0nVvcKvXSmkSh991tmfgZA7bH28yzOoE4ZCUzLds3iXtEavwmVrRWCUp7tC6AkaHnMJDfn2aQZD';

// Test functions
async function testTokenStatus() {
  console.log('\n=== Testing Token Status API ===');
  
  try {
    const response = await fetch(`${BASE_URL}/api/instagram/token-status`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Token Status:', data.status);
    
    if (data.status === 'valid') {
      console.log('✅ Token is valid');
      console.log(`App ID: ${data.app_id}`);
      console.log(`Application: ${data.application}`);
      console.log(`User ID: ${data.user_id}`);
      
      if (data.expires_at) {
        const expiresAt = new Date(data.expires_at);
        console.log('Expires At:', expiresAt.toLocaleString());
        console.log('Is Expired:', expiresAt < new Date());
      } else {
        console.log('Expires At: Never');
      }
      
      if (data.scopes && data.scopes.length > 0) {
        console.log('Permissions:', data.scopes.join(', '));
        
        // Check for critical permissions
        const criticalPermissions = ['instagram_basic', 'instagram_manage_messages'];
        const missingPermissions = criticalPermissions.filter(p => !data.scopes.includes(p));
        
        if (missingPermissions.length === 0) {
          console.log('✅ All critical permissions are granted');
        } else {
          console.log('⚠️ Missing critical permissions:', missingPermissions.join(', '));
        }
      } else {
        console.log('⚠️ No permissions found');
      }
    } else {
      console.log(`❌ Token status: ${data.status}`);
      console.log(`Error: ${data.error}`);
    }
    
    return data;
  } catch (error) {
    console.error('Test failed:', error.message);
    return null;
  }
}

async function testTokenUpdate() {
  console.log('\n=== Testing Token Update API ===');
  
  try {
    // This is just a test with the current token
    const response = await fetch(`${BASE_URL}/api/instagram/update-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: TEST_TOKEN }),
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    
    if (data.success) {
      console.log('✅ Token update API works');
      console.log(`Message: ${data.message}`);
      
      if (data.token_info) {
        console.log('Token Info:');
        console.log(`- App ID: ${data.token_info.app_id}`);
        console.log(`- Expires At: ${data.token_info.expires_at}`);
        console.log(`- Scopes: ${data.token_info.scopes?.join(', ') || 'None'}`);
      }
    } else {
      console.log('❌ Token update API failed');
      console.log(`Error: ${data.error}`);
      
      if (data.details) {
        console.log(`Details: ${JSON.stringify(data.details)}`);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Test failed:', error.message);
    return null;
  }
}

async function testHistoricalMessages() {
  console.log('\n=== Testing Historical Messages API with Token ===');
  
  try {
    const response = await fetch(`${BASE_URL}/api/instagram/historical-messages?conversation_id=test_conversation`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    
    if (data.is_mock_data) {
      console.log('⚠️ API returned mock data');
      console.log(`Message Count: ${data.messages?.length || 0}`);
      
      if (data.error) {
        console.log('Error:', data.error.message);
        console.log('Error Code:', data.error.code);
      }
    } else {
      console.log('✅ API returned real data');
      console.log(`Message Count: ${data.messages?.length || 0}`);
      
      if (data.paging) {
        console.log('Has Pagination:', !!data.paging);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Test failed:', error.message);
    return null;
  }
}

async function testTokenIntegration() {
  console.log('\n=== Testing Token Integration with APIs ===');
  
  // First get token status
  const tokenStatus = await testTokenStatus();
  
  if (!tokenStatus || tokenStatus.status !== 'valid') {
    console.log('❌ Cannot test integration - token is not valid');
    return;
  }
  
  // Test historical messages API
  const messagesResult = await testHistoricalMessages();
  
  // Check if the token is being used correctly
  if (messagesResult) {
    if (messagesResult.is_mock_data && messagesResult.error) {
      console.log('⚠️ API is using token but encountering permission issues');
      console.log(`Error: ${messagesResult.error.message}`);
      console.log(`This may be due to missing permissions or API limitations`);
    } else if (!messagesResult.is_mock_data) {
      console.log('✅ Token is being used correctly to fetch real data');
    } else {
      console.log('⚠️ Token is valid but API is still returning mock data');
      console.log('This may be due to API implementation or configuration issues');
    }
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== Starting Comprehensive Token Management Tests ===');
  console.log('Base URL:', BASE_URL);
  console.log('Test Token:', TEST_TOKEN ? `${TEST_TOKEN.substring(0, 10)}...` : 'No token provided');
  
  // Test token status
  await testTokenStatus();
  
  // Test token update
  await testTokenUpdate();
  
  // Test historical messages
  await testHistoricalMessages();
  
  // Test token integration
  await testTokenIntegration();
  
  console.log('\n=== Comprehensive Token Management Tests Complete ===');
}

// Run the tests
runAllTests().catch(error => {
  console.error('Test suite failed:', error);
});
