const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testWebhookVerification() {
  console.log('=== Testing Webhook Verification ===');
  
  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'test_verify_token';
  
  try {
    // Test webhook verification endpoint
    const verificationUrl = `http://localhost:3000/api/instagram/webhook?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=test_challenge`;
    
    console.log(`Sending verification request to: ${verificationUrl}`);
    
    const response = await fetch(verificationUrl, {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    if (text === 'test_challenge') {
      console.log('✅ Webhook verification successful!');
    } else {
      console.error('❌ Webhook verification failed. Expected "test_challenge", got:', text);
    }
    
  } catch (error) {
    console.error('Error testing webhook verification:', error);
  }
}

async function testWebhookEvent() {
  console.log('\n=== Testing Webhook Event Handling ===');
  
  try {
    // Test webhook event handling
    const webhookUrl = 'http://localhost:3000/api/instagram/webhook';
    
    const mockEvent = {
      object: 'instagram',
      entry: [
        {
          id: '123456789',
          time: Date.now(),
          messaging: [
            {
              sender: { id: 'sender_123' },
              recipient: { id: 'recipient_456' },
              timestamp: Date.now(),
              message: {
                mid: 'mid.123456789',
                text: 'テストメッセージ'
              }
            }
          ]
        }
      ]
    };
    
    console.log('Sending mock event to webhook endpoint:', JSON.stringify(mockEvent, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mockEvent)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('✅ Webhook event handling successful!');
    } else {
      console.error('❌ Webhook event handling failed:', result);
    }
    
  } catch (error) {
    console.error('Error testing webhook event handling:', error);
  }
}

async function main() {
  await testWebhookVerification();
  await testWebhookEvent();
}

main();
