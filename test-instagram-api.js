// Test script to verify Instagram API access
const https = require('https');

async function testInstagramAPI() {
  try {
    // Get Instagram access token from environment
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.error('Error: Instagram access token not configured');
      return;
    }
    
    console.log('Testing Instagram API with access token...');
    
    // Instagram Graph API base URL
    const INSTAGRAM_GRAPH_API_BASE = 'https://graph.facebook.com';
    const API_VERSION = 'v18.0';
    
    // Test endpoint for user profile - remove username field which is deprecated
    const profileEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me`;
    
    // Parameters for the API request
    const profileParams = new URLSearchParams({
      access_token: accessToken,
      fields: 'id,name'
    });
    
    console.log('Fetching profile information...');
    
    // Use Node.js https module instead of fetch
    const profileUrl = `${profileEndpoint}?${profileParams}`;
    console.log('Profile URL:', profileUrl);
    
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
    console.log('Conversations URL:', conversationsUrl);
    
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
    
  } catch (error) {
    console.error('Error testing Instagram API:', error);
  }
}

// Run the test
testInstagramAPI();
