/**
 * Template for testing Instagram API access with a token
 * IMPORTANT: Replace 'YOUR_ACCESS_TOKEN' with your actual token before running
 */

const https = require('https');

async function testInstagramAPI() {
  try {
    // Replace with your access token - DO NOT COMMIT ACTUAL TOKENS
    const accessToken = 'YOUR_ACCESS_TOKEN';
    
    console.log('Testing Instagram API with access token...');
    
    // Instagram Graph API base URL
    const INSTAGRAM_GRAPH_API_BASE = 'https://graph.facebook.com';
    const API_VERSION = 'v18.0';
    
    // Test endpoint for user profile
    const profileEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me`;
    
    // Parameters for the API request
    const profileParams = new URLSearchParams({
      access_token: accessToken,
      fields: 'id,name'
    });
    
    console.log('Fetching profile information...');
    
    // Use Node.js https module instead of fetch
    const profileUrl = `${profileEndpoint}?${profileParams}`;
    
    const profileData = await new Promise((resolve, reject) => {
      https.get(profileUrl, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode !== 200) {
            console.error(`Instagram API error: ${res.statusCode} ${res.statusMessage}`);
            console.error('Response:', data);
            reject(new Error(`API error: ${res.statusCode}`));
            return;
          }
          
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
    
    console.log('Profile data:', profileData);
    
    // Test endpoint for conversations
    const conversationsEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me/conversations`;
    
    // Parameters for the conversations request
    const conversationsParams = new URLSearchParams({
      access_token: accessToken,
      fields: 'participants,messages{from,message,created_time}'
    });
    
    console.log('Fetching conversations...');
    
    const conversationsUrl = `${conversationsEndpoint}?${conversationsParams}`;
    
    try {
      const conversationsData = await new Promise((resolve, reject) => {
        https.get(conversationsUrl, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            if (res.statusCode !== 200) {
              console.error(`Instagram API error: ${res.statusCode} ${res.statusMessage}`);
              console.error('Response:', data);
              reject(new Error(`API error: ${res.statusCode}`));
              return;
            }
            
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        }).on('error', (err) => {
          reject(err);
        });
      });
      
      console.log('Conversations data:', JSON.stringify(conversationsData, null, 2));
      return { success: true, profile: profileData, conversations: conversationsData };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return { success: false, profile: profileData, error: error.message };
    }
    
  } catch (error) {
    console.error('Error testing Instagram API:', error);
    return { success: false, error: error.message };
  }
}

// Run the test
testInstagramAPI().then(result => {
  console.log('Test completed with result:', result.success ? 'SUCCESS' : 'FAILURE');
  if (!result.success && result.profile) {
    console.log('Profile access succeeded but conversations access failed.');
    console.log('This indicates that the token has basic permissions but lacks read_mailbox permission.');
  }
});
