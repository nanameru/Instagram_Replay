const fetch = require('node-fetch');

async function testSimpleEndpoint() {
  console.log('=== Testing Simple API Endpoint ===');
  
  try {
    // Test simple API endpoint
    const response = await fetch('http://localhost:3000/api/instagram/simple', {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('Simple API Response:', result);
    
    if (result.status === 'ok') {
      console.log('✅ Simple API endpoint working!');
    } else {
      console.error('❌ Simple API endpoint returned unexpected format:', result);
    }
    
  } catch (error) {
    console.error('Error testing simple API endpoint:', error);
  }
}

async function testTestEndpoint() {
  console.log('\n=== Testing Test API Endpoint ===');
  
  try {
    // Test the test API endpoint
    const response = await fetch('http://localhost:3000/api/test', {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    console.log('Test API Response:', result);
    
    if (result.status === 'ok') {
      console.log('✅ Test API endpoint working!');
    } else {
      console.error('❌ Test API endpoint returned unexpected format:', result);
    }
    
  } catch (error) {
    console.error('Error testing test API endpoint:', error);
  }
}

async function main() {
  await testSimpleEndpoint();
  await testTestEndpoint();
}

main();
