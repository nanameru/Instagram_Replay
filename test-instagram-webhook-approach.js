/**
 * Test script for Instagram webhook approach
 * This demonstrates how to set up a webhook to receive real-time DM notifications
 */

const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

// Get access token from environment variable
const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

if (!accessToken) {
  console.error('Error: INSTAGRAM_ACCESS_TOKEN not found in .env.local');
  process.exit(1);
}

// Function to subscribe to Instagram webhooks
async function subscribeToWebhook(pageId) {
  try {
    console.log(`Subscribing to webhook for page ${pageId}...`);
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/subscribed_apps?subscribed_fields=messages&access_token=${accessToken}`,
      { method: 'POST' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error subscribing to webhook:', JSON.stringify(errorData, null, 2));
      return false;
    }
    
    const data = await response.json();
    console.log('Webhook subscription response:', JSON.stringify(data, null, 2));
    
    return data.success === true;
  } catch (error) {
    console.error('Error subscribing to webhook:', error);
    return false;
  }
}

// Function to get Facebook pages
async function getFacebookPages() {
  try {
    console.log('Getting Facebook pages...');
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error getting Facebook pages:', JSON.stringify(errorData, null, 2));
      return null;
    }
    
    const data = await response.json();
    console.log('Facebook pages response:', JSON.stringify(data, null, 2));
    
    return data.data;
  } catch (error) {
    console.error('Error getting Facebook pages:', error);
    return null;
  }
}

// Main function
async function main() {
  console.log('=== Instagram Webhook Approach Test ===');
  console.log('Testing with token:', accessToken.substring(0, 10) + '...' + accessToken.substring(accessToken.length - 10));
  
  // Get Facebook pages
  const pages = await getFacebookPages();
  
  if (!pages || pages.length === 0) {
    console.error('❌ No Facebook pages found. Cannot proceed with webhook subscription.');
    return;
  }
  
  console.log(`\nFound ${pages.length} Facebook pages:`);
  pages.forEach((page, index) => {
    console.log(`${index + 1}. ${page.name} (ID: ${page.id})`);
  });
  
  // Try to subscribe to webhook for each page
  console.log('\nAttempting to subscribe to webhooks for each page...');
  
  for (const page of pages) {
    const success = await subscribeToWebhook(page.id);
    console.log(`Webhook subscription for page "${page.name}": ${success ? '✅ Success' : '❌ Failed'}`);
  }
  
  console.log('\n=== Webhook Implementation Guide ===');
  console.log('1. Create a webhook endpoint in your Next.js app:');
  console.log('   - Create file: src/app/api/instagram/webhook/route.js');
  console.log('   - Implement GET handler for webhook verification');
  console.log('   - Implement POST handler for receiving webhook events');
  
  console.log('\n2. Make your webhook endpoint publicly accessible:');
  console.log('   - Deploy your app or use a tunnel service like ngrok');
  console.log('   - Your webhook URL should be: https://your-domain.com/api/instagram/webhook');
  
  console.log('\n3. Set up webhook in Facebook Developer Portal:');
  console.log('   - Go to your app in Facebook Developer Portal');
  console.log('   - Add "Webhooks" product');
  console.log('   - Configure webhook with your public URL');
  console.log('   - Set verify token (must match what your endpoint expects)');
  console.log('   - Subscribe to "messages" field');
  
  console.log('\n4. Test your webhook:');
  console.log('   - Send a DM to your Instagram business account');
  console.log('   - Check your webhook endpoint logs for the incoming event');
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
});
