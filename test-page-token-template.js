/**
 * Template for testing Instagram Page Access Token
 * IMPORTANT: Replace 'YOUR_ACCESS_TOKEN' with your actual token before running
 */

const https = require('https');

async function testPageToken() {
  try {
    // Replace with your access token - DO NOT COMMIT ACTUAL TOKENS
    const accessToken = 'YOUR_ACCESS_TOKEN';
    
    console.log('Testing Instagram Page Access Token...');
    
    // Instagram Graph API base URL
    const INSTAGRAM_GRAPH_API_BASE = 'https://graph.facebook.com';
    const API_VERSION = 'v18.0';
    
    // Test endpoint for pages
    const pagesEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/me/accounts`;
    
    // Parameters for the API request
    const pagesParams = new URLSearchParams({
      access_token: accessToken
    });
    
    console.log('Fetching pages information...');
    
    // Use Node.js https module
    const pagesUrl = `${pagesEndpoint}?${pagesParams}`;
    
    const pagesData = await new Promise((resolve, reject) => {
      https.get(pagesUrl, (res) => {
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
    
    console.log('Pages data:', JSON.stringify(pagesData, null, 2));
    
    if (pagesData.data && pagesData.data.length > 0) {
      console.log(`Found ${pagesData.data.length} pages`);
      
      // Get the first page
      const page = pagesData.data[0];
      console.log(`Using page: ${page.name} (${page.id})`);
      
      // Get the page access token
      const pageAccessToken = page.access_token;
      
      // Test the page access token
      const pageEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/${page.id}`;
      const pageParams = new URLSearchParams({
        access_token: pageAccessToken,
        fields: 'name,id,instagram_business_account'
      });
      
      console.log('Fetching page details with Instagram business account...');
      
      const pageUrl = `${pageEndpoint}?${pageParams}`;
      
      const pageData = await new Promise((resolve, reject) => {
        https.get(pageUrl, (res) => {
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
      
      console.log('Page data:', JSON.stringify(pageData, null, 2));
      
      if (pageData.instagram_business_account) {
        console.log('✅ Page has an Instagram business account');
        console.log(`Instagram business account ID: ${pageData.instagram_business_account.id}`);
        
        // Test the Instagram business account
        const igAccountId = pageData.instagram_business_account.id;
        const igAccountEndpoint = `${INSTAGRAM_GRAPH_API_BASE}/${API_VERSION}/${igAccountId}`;
        const igAccountParams = new URLSearchParams({
          access_token: pageAccessToken,
          fields: 'name,username,profile_picture_url'
        });
        
        console.log('Fetching Instagram business account details...');
        
        const igAccountUrl = `${igAccountEndpoint}?${igAccountParams}`;
        
        const igAccountData = await new Promise((resolve, reject) => {
          https.get(igAccountUrl, (res) => {
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
        
        console.log('Instagram business account data:', JSON.stringify(igAccountData, null, 2));
        
        return {
          success: true,
          page: pageData,
          instagram: igAccountData
        };
      } else {
        console.log('❌ Page does not have an Instagram business account');
        return {
          success: false,
          page: pageData,
          error: 'No Instagram business account'
        };
      }
    } else {
      console.log('❌ No pages found');
      return {
        success: false,
        error: 'No pages found'
      };
    }
    
  } catch (error) {
    console.error('Error testing page token:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testPageToken().then(result => {
  console.log('Test completed with result:', result.success ? 'SUCCESS' : 'FAILURE');
});
