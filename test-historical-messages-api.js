/**
 * Test script for the historical messages API endpoint
 * Tests both the JavaScript and TypeScript implementations
 */

const fetch = require('node-fetch');

// Base URL for API endpoints
const BASE_URL = 'http://localhost:3000';

// Test access token (this is just for testing, will be replaced with a valid token in production)
const TEST_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || 'test_token';

// Test conversation IDs
const MOCK_CONVERSATION_ID = 'conv_test';
const REAL_CONVERSATION_ID = '123456789'; // Replace with a real conversation ID if available

// Test functions
async function testMockConversation() {
  console.log('\n=== Testing Mock Conversation Retrieval ===');
  
  try {
    const response = await fetch(`${BASE_URL}/api/instagram/historical-messages?conversation_id=${MOCK_CONVERSATION_ID}`);
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Is Mock Data:', data.is_mock_data);
    console.log('Message Count:', data.messages?.length || 0);
    console.log('Has Pagination:', !!data.paging);
    
    if (data.error) {
      console.log('Error:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Test failed:', error.message);
    return null;
  }
}

async function testRealConversation() {
  console.log('\n=== Testing Real Conversation Retrieval ===');
  
  try {
    const response = await fetch(
      `${BASE_URL}/api/instagram/historical-messages?conversation_id=${REAL_CONVERSATION_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`
        }
      }
    );
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Is Mock Data:', data.is_mock_data);
    console.log('Message Count:', data.messages?.length || 0);
    console.log('Has Pagination:', !!data.paging);
    
    if (data.error) {
      console.log('Error:', data.error);
      console.log('Error Code:', data.error.code);
    }
    
    return data;
  } catch (error) {
    console.error('Test failed:', error.message);
    return null;
  }
}

async function testTokenValidation() {
  console.log('\n=== Testing Token Validation ===');
  
  try {
    // Test with invalid token
    const response = await fetch(
      `${BASE_URL}/api/instagram/historical-messages?conversation_id=${REAL_CONVERSATION_ID}`,
      {
        headers: {
          'Authorization': 'Bearer invalid_token'
        }
      }
    );
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Is Mock Data:', data.is_mock_data);
    console.log('Has Error:', !!data.error);
    
    if (data.error) {
      console.log('Error:', data.error.error);
      console.log('Error Code:', data.error.code);
    }
    
    return data;
  } catch (error) {
    console.error('Test failed:', error.message);
    return null;
  }
}

async function testPagination() {
  console.log('\n=== Testing Pagination ===');
  
  try {
    // First page
    const firstPageResponse = await fetch(`${BASE_URL}/api/instagram/historical-messages?conversation_id=${MOCK_CONVERSATION_ID}&limit=2`);
    const firstPageData = await firstPageResponse.json();
    
    console.log('First Page Status:', firstPageResponse.status);
    console.log('First Page Message Count:', firstPageData.messages?.length || 0);
    console.log('Has Next Page:', !!firstPageData.paging?.next);
    
    if (!firstPageData.paging?.next) {
      console.log('No next page available, pagination test incomplete');
      return null;
    }
    
    // Second page using the next link
    const nextPageUrl = new URL(firstPageData.paging.next, BASE_URL);
    const secondPageResponse = await fetch(nextPageUrl);
    const secondPageData = await secondPageResponse.json();
    
    console.log('Second Page Status:', secondPageResponse.status);
    console.log('Second Page Message Count:', secondPageData.messages?.length || 0);
    
    return {
      firstPage: firstPageData,
      secondPage: secondPageData
    };
  } catch (error) {
    console.error('Pagination test failed:', error.message);
    return null;
  }
}

async function testAllConversations() {
  console.log('\n=== Testing All Conversations Retrieval ===');
  
  try {
    const response = await fetch(
      `${BASE_URL}/api/instagram/historical-messages`,
      {
        headers: {
          'Authorization': `Bearer ${TEST_TOKEN}`
        }
      }
    );
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Is Mock Data:', data.is_mock_data);
    console.log('Conversation Count:', data.conversations?.length || 0);
    console.log('Has Pagination:', !!data.paging);
    
    if (data.error) {
      console.log('Error:', data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Test failed:', error.message);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== Starting Historical Messages API Tests ===');
  console.log('Base URL:', BASE_URL);
  
  // Test mock conversation retrieval
  await testMockConversation();
  
  // Test real conversation retrieval
  await testRealConversation();
  
  // Test token validation
  await testTokenValidation();
  
  // Test pagination
  await testPagination();
  
  // Test all conversations retrieval
  await testAllConversations();
  
  console.log('\n=== Historical Messages API Tests Complete ===');
}

// Run the tests
runAllTests().catch(error => {
  console.error('Test suite failed:', error);
});
