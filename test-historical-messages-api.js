/**
 * Test script for the historical messages API endpoint
 */

async function testHistoricalMessagesApi() {
  try {
    console.log('Testing historical messages API endpoint...');
    
    // Test with a mock conversation ID
    const conversationId = 'conv_1001';
    
    // Make a request to the API endpoint
    const response = await fetch(`http://localhost:3000/api/instagram/historical-messages?conversation_id=${conversationId}&limit=10`);
    const data = await response.json();
    
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    // Check if the response contains mock data
    if (data.is_mock) {
      console.log('✅ API correctly returned mock data due to permission limitations');
    } else {
      console.log('❌ API returned real data, which is unexpected given the permission limitations');
    }
    
    // Check if pagination is included
    if (data.pagination && data.pagination.next) {
      console.log('✅ Pagination is correctly included in the response');
      
      // Test pagination by following the next link
      console.log('\nTesting pagination...');
      const nextPageUrl = new URL(data.pagination.next, 'http://localhost:3000').href;
      const nextPageResponse = await fetch(nextPageUrl);
      const nextPageData = await nextPageResponse.json();
      
      console.log('Next Page Response:', JSON.stringify(nextPageData, null, 2));
      
      if (nextPageData.is_mock) {
        console.log('✅ Pagination correctly returned mock data');
      }
    } else {
      console.log('❌ Pagination is missing from the response');
    }
    
  } catch (error) {
    console.error('Error testing historical messages API:', error);
  }
}

// Run the test
testHistoricalMessagesApi();
