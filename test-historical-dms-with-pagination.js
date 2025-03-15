/**
 * Test script for the historical messages API endpoint with pagination
 */

async function testHistoricalMessagesWithPagination() {
  try {
    console.log('Testing historical messages API with pagination...');
    
    // Test with a mock conversation ID
    const conversationId = 'conv_1001';
    
    // Make a request to the API endpoint
    const response = await fetch(`http://localhost:3000/api/instagram/historical-messages?conversation_id=${conversationId}&limit=2`);
    const data = await response.json();
    
    console.log('Initial API Response:', JSON.stringify(data, null, 2));
    
    // Check if the response contains mock data
    if (data.is_mock) {
      console.log('✅ API correctly returned mock data');
    } else {
      console.log('❌ API returned real data, which is unexpected for mock conversation ID');
    }
    
    // Check if pagination is included
    if (data.pagination && data.pagination.next) {
      console.log('✅ Pagination is correctly included in the response');
      
      // Test pagination by following the next link
      console.log('\nTesting pagination - next page...');
      const nextPageUrl = new URL(data.pagination.next, 'http://localhost:3000').href;
      const nextPageResponse = await fetch(nextPageUrl);
      const nextPageData = await nextPageResponse.json();
      
      console.log('Next Page Response:', JSON.stringify(nextPageData, null, 2));
      
      if (nextPageData.is_mock) {
        console.log('✅ Pagination correctly returned mock data');
      }
      
      // Test previous link if available
      if (nextPageData.pagination && nextPageData.pagination.previous) {
        console.log('\nTesting pagination - previous page...');
        const prevPageUrl = new URL(nextPageData.pagination.previous, 'http://localhost:3000').href;
        const prevPageResponse = await fetch(prevPageUrl);
        const prevPageData = await prevPageResponse.json();
        
        console.log('Previous Page Response:', JSON.stringify(prevPageData, null, 2));
        
        if (prevPageData.is_mock) {
          console.log('✅ Previous page pagination correctly returned mock data');
        }
      } else {
        console.log('❌ Previous page link is missing from the pagination response');
      }
    } else {
      console.log('❌ Pagination is missing from the response');
    }
    
  } catch (error) {
    console.error('Error testing historical messages API:', error);
  }
}

// Run the test
testHistoricalMessagesWithPagination();
