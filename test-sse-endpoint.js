const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testSSEEndpoint() {
  console.log('=== Testing SSE Endpoint ===');
  console.log('This test will connect to the SSE endpoint and listen for events for 15 seconds');
  
  try {
    // Use node-fetch in a way that simulates EventSource for SSE
    const response = await fetch('http://localhost:3000/api/instagram/events?customerId=123', {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    if (!response.body) {
      throw new Error('Response body is null');
    }
    
    console.log('Connected to SSE endpoint');
    
    // Set up a timeout to end the test after 15 seconds
    const timeout = setTimeout(() => {
      console.log('Test completed after 15 seconds');
      process.exit(0);
    }, 15000);
    
    // Read the stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    async function readStream() {
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('Stream closed by server');
            clearTimeout(timeout);
            process.exit(0);
            return;
          }
          
          const chunk = decoder.decode(value, { stream: true });
          console.log('Received chunk:', chunk);
          
          // Parse and display events
          const events = chunk.split('\n\n').filter(Boolean);
          for (const event of events) {
            if (event.startsWith('data: ')) {
              try {
                const data = JSON.parse(event.substring(6));
                console.log('Parsed event:', data);
              } catch (e) {
                console.error('Error parsing event data:', e);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error reading stream:', error);
        clearTimeout(timeout);
        process.exit(1);
      }
    }
    
    readStream();
    
  } catch (error) {
    console.error('Error testing SSE endpoint:', error);
    process.exit(1);
  }
}

testSSEEndpoint();
