/**
 * Test script for token management functionality
 */

const fetch = require('node-fetch');

// Test token - replace with a valid token for testing
const testToken = process.env.INSTAGRAM_ACCESS_TOKEN || 'EAAhYeSTN9z8BOZCNfhEqD4FyMJDsQ0viuBbdWigoxVGECZC3oEz0qsllKDE4ZCQo44Rv8sWspJRtOwnbnk5ZB15nghFlnPfx6RhqyrrxTjZBYh2FU5rJbgqk92g9U30ZAJqDDY6eWFEnSq2VPwpArh51dxp6G2aUZCsPzHdATZC1UUef9j6IyfcggfdUssI4uJhyE2uY550WTyZAl81Hum0ghoAibA0MMhDTcLtjdVmWC';

async function testTokenStatus() {
  console.log('=== Testing Token Status API ===');
  try {
    const response = await fetch('http://localhost:3000/api/instagram/token-status');
    const data = await response.json();
    
    console.log('Token Status Response:', JSON.stringify(data, null, 2));
    
    if (data.status === 'valid') {
      console.log('✅ Token is valid');
      console.log(`Expires at: ${data.expires_at || 'Never'}`);
      console.log(`Scopes: ${data.scopes?.join(', ') || 'None'}`);
    } else if (data.status === 'expired') {
      console.log('❌ Token is expired');
      console.log(`Error: ${data.error}`);
      console.log(`Renewal guide: ${data.renewal_guide}`);
    } else {
      console.log(`❌ Token status: ${data.status}`);
      console.log(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error testing token status API:', error);
  }
}

async function testTokenValidation() {
  console.log('\n=== Testing Token Validation ===');
  try {
    // Test with the current token
    const response = await fetch('https://graph.facebook.com/debug_token', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      query: {
        input_token: testToken,
        access_token: testToken
      }
    });
    
    const data = await response.json();
    console.log('Token Validation Response:', JSON.stringify(data, null, 2));
    
    if (data.data && data.data.is_valid) {
      console.log('✅ Token is valid according to Facebook Graph API');
      console.log(`App ID: ${data.data.app_id}`);
      console.log(`User ID: ${data.data.user_id}`);
      console.log(`Expires at: ${data.data.expires_at ? new Date(data.data.expires_at * 1000).toISOString() : 'Never'}`);
      console.log(`Scopes: ${data.data.scopes?.join(', ') || 'None'}`);
    } else {
      console.log('❌ Token is invalid according to Facebook Graph API');
      console.log(`Error: ${data.error?.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error testing token validation:', error);
  }
}

async function testTokenUpdate() {
  console.log('\n=== Testing Token Update API ===');
  try {
    // This is just a test, so we'll use the same token
    const response = await fetch('http://localhost:3000/api/instagram/update-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: testToken })
    });
    
    const data = await response.json();
    console.log('Token Update Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Token update API works');
      console.log(`Message: ${data.message}`);
      if (data.token_info) {
        console.log(`App ID: ${data.token_info.app_id}`);
        console.log(`Expires at: ${data.token_info.expires_at}`);
        console.log(`Scopes: ${data.token_info.scopes?.join(', ') || 'None'}`);
      }
    } else {
      console.log('❌ Token update API failed');
      console.log(`Error: ${data.error}`);
      if (data.details) {
        console.log(`Details: ${JSON.stringify(data.details)}`);
      }
    }
  } catch (error) {
    console.error('Error testing token update API:', error);
  }
}

async function runTests() {
  console.log('Starting token management tests...');
  console.log('Using token:', testToken ? `${testToken.substring(0, 10)}...` : 'No token provided');
  
  await testTokenStatus();
  await testTokenValidation();
  await testTokenUpdate();
  
  console.log('\n=== Test Summary ===');
  console.log('Token management tests completed.');
}

runTests();
