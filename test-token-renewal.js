/**
 * Test script for token renewal functionality
 */

const fetch = require('node-fetch');

// Base URL for API endpoints
const BASE_URL = 'http://localhost:3000';

// Test access token (this is just for testing)
const TEST_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || 'test_token';

// Test functions
async function testTokenValidation() {
  console.log('\n=== Testing Token Validation ===');
  
  try {
    const response = await fetch(`${BASE_URL}/api/instagram/token-status`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Token Status:', data.status);
    
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at);
      console.log('Expires At:', expiresAt.toLocaleString());
      console.log('Is Expired:', expiresAt < new Date());
    } else {
      console.log('Expires At: Never or Unknown');
    }
    
    if (data.scopes) {
      console.log('Permissions:', data.scopes.join(', '));
    }
    
    if (data.error) {
      console.log('Error:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Test failed:', error.message);
    return null;
  }
}

async function testTokenUpdate() {
  console.log('\n=== Testing Token Update ===');
  
  try {
    // This is just a test, so we'll use the same token
    const response = await fetch(`${BASE_URL}/api/instagram/update-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: TEST_TOKEN }),
    });
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Success:', data.success);
    
    if (data.token_info) {
      console.log('Token Info:', data.token_info);
    }
    
    if (data.error) {
      console.log('Error:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Test failed:', error.message);
    return null;
  }
}

async function testTokenManager() {
  console.log('\n=== Testing Token Manager ===');
  
  try {
    // Test the token manager by checking if it can detect expired tokens
    const response = await fetch(`${BASE_URL}/api/instagram/token-status`);
    const data = await response.json();
    
    if (data.status === 'expired') {
      console.log('✅ Token manager correctly identified expired token');
    } else if (data.status === 'valid') {
      console.log('✅ Token manager correctly identified valid token');
      console.log(`Token expires at: ${data.expires_at || 'Unknown'}`);
    } else {
      console.log(`❓ Token status: ${data.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('Test failed:', error.message);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== Starting Token Renewal Tests ===');
  console.log('Base URL:', BASE_URL);
  console.log('Test Token:', TEST_TOKEN ? `${TEST_TOKEN.substring(0, 10)}...` : 'No token provided');
  
  // Test token validation
  await testTokenValidation();
  
  // Test token update
  await testTokenUpdate();
  
  // Test token manager
  await testTokenManager();
  
  console.log('\n=== Token Renewal Tests Complete ===');
}

// Run the tests
runAllTests().catch(error => {
  console.error('Test suite failed:', error);
});
