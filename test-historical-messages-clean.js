/**
 * Test script for the historical messages API endpoint
 * This is a clean version without any tokens or sensitive information
 */

async function testHistoricalMessagesApi() {
  try {
    console.log('Testing historical messages API...');
    
    // Test with a mock conversation ID
    const conversationId = 'conv_1001';
    
    // Make a request to the API endpoint
    const response = await fetch(`http://localhost:3000/api/instagram/historical-messages?conversation_id=${conversationId}&limit=10`);
    const data = await response.json();
    
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    // Check if the response contains mock data
    if (data.is_mock) {
      console.log('✅ API correctly returned mock data');
    } else {
      console.log('❌ API returned real data, which is unexpected for mock conversation ID');
    }
    
    // Check if pagination is included
    if (data.pagination) {
      console.log('✅ Pagination is correctly included in the response');
    } else {
      console.log('❌ Pagination is missing from the response');
    }
    
  } catch (error) {
    console.error('Error testing historical messages API:', error);
  }
}

// Run the test
testHistoricalMessagesApi();
