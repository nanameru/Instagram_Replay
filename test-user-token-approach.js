/**
 * Test script for Instagram API using user token approach
 * This script tests if we can access Instagram DMs using a user token
 */

const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

// Get access token from environment variable
const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

if (!accessToken) {
  console.error('Error: INSTAGRAM_ACCESS_TOKEN not found in .env.local');
  process.exit(1);
}

// Function to get user profile
async function getUserProfile() {
  try {
    console.log('Getting user profile...');
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error getting user profile directly:', JSON.stringify(errorData, null, 2));
      return null;
    }
    
    const data = await response.json();
    console.log('User profile response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Function to get Instagram account
async function getInstagramAccount() {
  try {
    console.log('Getting Instagram account...');
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account{id,name,username}&access_token=${accessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error getting Instagram account directly:', JSON.stringify(errorData, null, 2));
      return null;
    }
    
    const data = await response.json();
    console.log('Instagram account response:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('Error getting Instagram account:', error);
    return null;
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

// Function to get Instagram business account
async function getInstagramBusinessAccount(pageId, pageAccessToken) {
  try {
    console.log(`Getting Instagram business account for page ${pageId}...`);
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error getting Instagram business account:', JSON.stringify(errorData, null, 2));
      return null;
    }
    
    const data = await response.json();
    console.log('Instagram business account response:', JSON.stringify(data, null, 2));
    
    return data.instagram_business_account;
  } catch (error) {
    console.error('Error getting Instagram business account:', error);
    return null;
  }
}

// Function to get Instagram conversations
async function getInstagramConversations(instagramBusinessAccountId, pageAccessToken) {
  try {
    console.log(`Getting Instagram conversations for account ${instagramBusinessAccountId}...`);
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/conversations?access_token=${pageAccessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error getting Instagram conversations:', JSON.stringify(errorData, null, 2));
      return null;
    }
    
    const data = await response.json();
    console.log('Instagram conversations response:', JSON.stringify(data, null, 2));
    
    return data.data;
  } catch (error) {
    console.error('Error getting Instagram conversations:', error);
    return null;
  }
}

// Function to get conversation messages
async function getConversationMessages(conversationId, pageAccessToken) {
  try {
    console.log(`Getting messages for conversation ${conversationId}...`);
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${conversationId}/messages?access_token=${pageAccessToken}`,
      { method: 'GET' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error getting conversation messages:', JSON.stringify(errorData, null, 2));
      return null;
    }
    
    const data = await response.json();
    console.log('Conversation messages response:', JSON.stringify(data, null, 2));
    
    return data.data;
  } catch (error) {
    console.error('Error getting conversation messages:', error);
    return null;
  }
}

// Main function
async function main() {
  console.log('=== Instagram API User Token Approach Test ===');
  console.log('Testing with token:', accessToken.substring(0, 10) + '...' + accessToken.substring(accessToken.length - 10));
  
  // Get user profile
  const userProfile = await getUserProfile();
  
  if (!userProfile) {
    console.error('❌ Failed to get user profile. Token may be invalid or expired.');
    return;
  }
  
  console.log(`✅ Successfully got user profile: ${userProfile.name} (ID: ${userProfile.id})`);
  
  // Try direct Instagram account approach
  const instagramAccount = await getInstagramAccount();
  
  if (instagramAccount && instagramAccount.data && instagramAccount.data.length > 0) {
    console.log('✅ Successfully got Instagram account directly');
    
    // Process each page with Instagram business account
    for (const page of instagramAccount.data) {
      if (page.instagram_business_account) {
        const instagramBusinessAccountId = page.instagram_business_account.id;
        console.log(`Found Instagram business account: ${instagramBusinessAccountId}`);
        
        // Get Instagram conversations
        const conversations = await getInstagramConversations(instagramBusinessAccountId, accessToken);
        
        if (conversations && conversations.length > 0) {
          console.log(`✅ Found ${conversations.length} conversations`);
          
          // Get messages for first conversation
          const firstConversation = conversations[0];
          const messages = await getConversationMessages(firstConversation.id, accessToken);
          
          if (messages && messages.length > 0) {
            console.log(`✅ Found ${messages.length} messages in conversation`);
            console.log('First few messages:');
            messages.slice(0, 3).forEach((message, index) => {
              console.log(`${index + 1}. ${message.message || '[No text content]'}`);
            });
          } else {
            console.log('❌ No messages found in conversation');
          }
        } else {
          console.log('❌ No conversations found');
        }
      }
    }
  } else {
    console.log('❌ Failed to get Instagram account directly, trying page-based approach...');
    
    // Get Facebook pages
    const pages = await getFacebookPages();
    
    if (!pages || pages.length === 0) {
      console.error('❌ No Facebook pages found. Cannot proceed with Instagram business account lookup.');
      return;
    }
    
    console.log(`Found ${pages.length} Facebook pages:`);
    pages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.name} (ID: ${page.id})`);
    });
    
    // Try to get Instagram business account for each page
    for (const page of pages) {
      const instagramBusinessAccount = await getInstagramBusinessAccount(page.id, page.access_token);
      
      if (instagramBusinessAccount) {
        console.log(`✅ Found Instagram business account ${instagramBusinessAccount.id} for page "${page.name}"`);
        
        // Get Instagram conversations
        const conversations = await getInstagramConversations(instagramBusinessAccount.id, page.access_token);
        
        if (conversations && conversations.length > 0) {
          console.log(`✅ Found ${conversations.length} conversations`);
          
          // Get messages for first conversation
          const firstConversation = conversations[0];
          const messages = await getConversationMessages(firstConversation.id, page.access_token);
          
          if (messages && messages.length > 0) {
            console.log(`✅ Found ${messages.length} messages in conversation`);
            console.log('First few messages:');
            messages.slice(0, 3).forEach((message, index) => {
              console.log(`${index + 1}. ${message.message || '[No text content]'}`);
            });
          } else {
            console.log('❌ No messages found in conversation');
          }
        } else {
          console.log('❌ No conversations found');
        }
      } else {
        console.log(`❌ No Instagram business account found for page "${page.name}"`);
      }
    }
  }
  
  console.log('\n=== Test Complete ===');
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error);
});
