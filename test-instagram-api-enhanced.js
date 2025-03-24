/**
 * Test script for enhanced Instagram historical DM retrieval
 * Tests multiple API access approaches and fallback mechanisms
 */

const fetch = require('node-fetch');

// Access token from environment variable
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || 'EAAhYeSTN9z8BO6Aqh4kkPyr1vOkqacWEHW336oAiE5cWhwPHgmD8TdB4Psa9o0lEDK5ayUKLNvpGsfHUDSZBenC2ZBXe8owqkj6IzjApVipjMqHQh7hMcAUEjZC3xW375vf2tOatfKvUB2jxpMdvLMfZB9Pv1t1s0nVvcKvXSmkSh991tmfgZA7bH28yzOoE4ZCUzLds3iXtEavwmVrRWCUp7tC6AkaHnMJDfn2aQZD';

// Base URL for API
const BASE_URL = 'http://localhost:3000';

// Test functions
async function testMockConversation() {
  console.log('\n=== Testing Mock Conversation ===');
  
  try {
    // Test with mock conversation ID
    const mockResponse = await fetch(
      `${BASE_URL}/api/instagram/historical-messages?conversation_id=conv_1001`
    );
    
    const mockData = await mockResponse.json();
    
    console.log('Status:', mockResponse.status);
    console.log('Is Mock Data:', mockData.is_mock_data);
    console.log('Message Count:', mockData.messages?.length || 0);
    console.log('Has Pagination:', !!mockData.paging);
    
    if (mockData.error) {
      console.log('Error:', mockData.error);
    }
    
    return { success: mockResponse.ok, data: mockData };
  } catch (error) {
    console.error('Test failed:', error);
    return { success: false, error };
  }
}

async function testWithRealToken() {
  console.log('\n=== Testing With Real Token ===');
  
  try {
    // Test with real access token
    const realResponse = await fetch(
      `${BASE_URL}/api/instagram/historical-messages?conversation_id=real_conversation`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      }
    );
    
    const realData = await realResponse.json();
    
    console.log('Status:', realResponse.status);
    console.log('Is Mock Data:', realData.is_mock_data);
    console.log('Message Count:', realData.messages?.length || 0);
    console.log('Has Pagination:', !!realData.paging);
    
    if (realData.error) {
      console.log('Error:', realData.error);
      console.log('Error Code:', realData.error.code);
      
      if (realData.error.details) {
        console.log('Error Details Available');
      }
    }
    
    return { success: realResponse.ok, data: realData };
  } catch (error) {
    console.error('Test failed:', error);
    return { success: false, error };
  }
}

async function testPagination() {
  console.log('\n=== Testing Pagination ===');
  
  try {
    // Test pagination with mock conversation
    const firstPageResponse = await fetch(
      `${BASE_URL}/api/instagram/historical-messages?conversation_id=conv_1001&limit=5`
    );
    
    const firstPageData = await firstPageResponse.json();
    
    console.log('First Page Status:', firstPageResponse.status);
    console.log('First Page Message Count:', firstPageData.messages?.length || 0);
    console.log('Has Next Page:', !!firstPageData.paging?.next);
    
    if (!firstPageData.paging?.next) {
      console.log('No next page token available, cannot test pagination');
      return { success: true, data: firstPageData, pagination: false };
    }
    
    // Extract the next page token and fetch the second page
    const nextPageUrl = new URL(firstPageData.paging.next, BASE_URL);
    const secondPageResponse = await fetch(nextPageUrl);
    
    const secondPageData = await secondPageResponse.json();
    
    console.log('Second Page Status:', secondPageResponse.status);
    console.log('Second Page Message Count:', secondPageData.messages?.length || 0);
    
    // Check if messages are different between pages
    const firstPageIds = new Set(firstPageData.messages.map(msg => msg.id));
    const secondPageIds = new Set(secondPageData.messages.map(msg => msg.id));
    const uniqueIds = new Set([...firstPageIds, ...secondPageIds]);
    
    console.log('Total Unique Messages:', uniqueIds.size);
    console.log('Pagination Working Correctly:', uniqueIds.size === (firstPageIds.size + secondPageIds.size));
    
    return { 
      success: secondPageResponse.ok, 
      data: { firstPage: firstPageData, secondPage: secondPageData },
      pagination: true
    };
  } catch (error) {
    console.error('Pagination test failed:', error);
    return { success: false, error };
  }
}

async function testMultipleApproaches() {
  console.log('\n=== Testing Multiple API Access Approaches ===');
  
  try {
    // Test with invalid token to trigger multiple approaches
    const invalidToken = 'INVALID_TOKEN_TO_TEST_FALLBACK';
    
    const response = await fetch(
      `${BASE_URL}/api/instagram/historical-messages?conversation_id=test_approaches`,
      {
        headers: {
          'Authorization': `Bearer ${invalidToken}`
        }
      }
    );
    
    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Is Mock Data:', data.is_mock_data);
    
    if (data.error) {
      console.log('Error:', data.error.error);
      console.log('Error Code:', data.error.code);
    }
    
    // Check if we got mock data as fallback
    console.log('Fallback to Mock Data:', data.is_mock_data === true);
    console.log('Has Messages Despite Error:', (data.messages?.length || 0) > 0);
    
    return { success: response.ok, data };
  } catch (error) {
    console.error('Multiple approaches test failed:', error);
    return { success: false, error };
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== Starting Enhanced Historical Messages API Tests ===');
  console.log('Access Token:', ACCESS_TOKEN ? `${ACCESS_TOKEN.substring(0, 10)}...` : 'None');
  console.log('Base URL:', BASE_URL);
  
  const results = {
    mockConversation: await testMockConversation(),
    realToken: await testWithRealToken(),
    pagination: await testPagination(),
    multipleApproaches: await testMultipleApproaches()
  };
  
  console.log('\n=== Test Results Summary ===');
  console.log('Mock Conversation Test:', results.mockConversation.success ? 'PASSED' : 'FAILED');
  console.log('Real Token Test:', results.realToken.success ? 'PASSED' : 'FAILED');
  console.log('Pagination Test:', results.pagination.success ? 'PASSED' : 'FAILED');
  console.log('Multiple Approaches Test:', results.multipleApproaches.success ? 'PASSED' : 'FAILED');
  
  console.log('\n=== Enhanced Historical Messages API Tests Complete ===');
  
  return results;
}

// Run the tests
runAllTests().catch(error => {
  console.error('Test suite failed:', error);
});
