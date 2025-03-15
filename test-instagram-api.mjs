/**
 * Test script for Instagram API integration
 * Run with: node test-instagram-api.mjs
 */

import { promises as fs } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

if (!INSTAGRAM_ACCESS_TOKEN) {
  console.error('Error: INSTAGRAM_ACCESS_TOKEN not found in environment variables');
  process.exit(1);
}

// Instagram Graph API base URL
const INSTAGRAM_GRAPH_API_BASE = 'https://graph.facebook.com';
const API_VERSION = 'v18.0';

/**
 * Test Instagram profile API
 */
async function testProfileAPI() {
  console.log('\n=== Testing Instagram Profile API ===');
  
  try {
    // Endpoint for profile information
    const endpoint = `${INSTAGRAM_GRAPH_API_BASE}/me`;
    
    // Parameters for the API request
    const params = new URLSearchParams({
      access_token: INSTAGRAM_ACCESS_TOKEN,
      fields: 'id,name'
    });
    
    console.log(`Making request to: ${endpoint}?${params}`);
    
    // Make the API request
    const response = await fetch(`${endpoint}?${params}`);
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    // Save response to file for reference
    await fs.writeFile('profile_response.txt', JSON.stringify(data, null, 2));
    
    return {
      success: response.ok,
      data
    };
  } catch (error) {
    console.error('Error testing profile API:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test Instagram conversations API
 */
async function testConversationsAPI() {
  console.log('\n=== Testing Instagram Conversations API ===');
  
  try {
    // Endpoint for conversations
    const endpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me/conversations`;
    
    // Parameters for the API request
    const params = new URLSearchParams({
      access_token: INSTAGRAM_ACCESS_TOKEN,
      fields: 'participants,updated_time,messages.limit(1){from,message,created_time}'
    });
    
    console.log(`Making request to: ${endpoint}?${params}`);
    
    // Make the API request
    const response = await fetch(`${endpoint}?${params}`);
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    // Save response to file for reference
    await fs.writeFile('conversations_response.txt', JSON.stringify(data, null, 2));
    
    return {
      success: response.ok,
      data
    };
  } catch (error) {
    console.error('Error testing conversations API:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Main function to run all tests
 */
async function runTests() {
  console.log('Starting Instagram API tests...');
  
  const profileResult = await testProfileAPI();
  const conversationsResult = await testConversationsAPI();
  
  console.log('\n=== Test Results ===');
  console.log('Profile API:', profileResult.success ? 'SUCCESS' : 'FAILED');
  console.log('Conversations API:', conversationsResult.success ? 'SUCCESS' : 'FAILED');
  
  if (!profileResult.success || !conversationsResult.success) {
    console.log('\n=== Error Details ===');
    
    if (!profileResult.success) {
      console.log('Profile API Error:', profileResult.error || JSON.stringify(profileResult.data?.error, null, 2));
    }
    
    if (!conversationsResult.success) {
      console.log('Conversations API Error:', conversationsResult.error || JSON.stringify(conversationsResult.data?.error, null, 2));
    }
  }
  
  console.log('\nAPI test completed.');
}

// Run the tests
runTests();
