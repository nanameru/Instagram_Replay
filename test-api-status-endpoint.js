const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testApiStatusEndpoint() {
  console.log('=== Testing API Status Endpoint ===');
  
  try {
    // Test API status endpoint
    const response = await fetch('http://localhost:3000/api/instagram/status', {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('API Status:', result);
    
    if (result.status) {
      console.log('✅ API Status endpoint working!');
      
      // Check token validity
      if (result.tokenValid === true) {
        console.log('✅ Access token is valid');
      } else if (result.tokenValid === false) {
        console.log('❌ Access token is invalid or expired');
      } else {
        console.log('⚠️ Token validity not checked');
      }
      
      // Check permissions
      if (result.permissions && Array.isArray(result.permissions)) {
        console.log('Permissions:', result.permissions.join(', '));
      }
    } else {
      console.error('❌ API Status endpoint returned unexpected format:', result);
    }
    
  } catch (error) {
    console.error('Error testing API status endpoint:', error);
  }
}

testApiStatusEndpoint();
