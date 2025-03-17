/**
 * API endpoint for subscribing to Instagram webhooks
 * This allows the frontend to subscribe to webhooks for specific pages
 */

export async function POST(req) {
  try {
    const { pageId, accessToken } = await req.json();
    
    if (!pageId || !accessToken) {
      return Response.json({ 
        status: 'error', 
        message: 'Page ID and access token are required' 
      }, { status: 400 });
    }
    
    console.log(`Subscribing to webhook for page ${pageId}`);
    
    // Subscribe to webhook for the page
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/subscribed_apps?subscribed_fields=messages&access_token=${accessToken}`,
      { method: 'POST' }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error subscribing to webhook:', JSON.stringify(errorData, null, 2));
      
      return Response.json({ 
        status: 'error', 
        message: 'Failed to subscribe to webhook',
        details: errorData
      }, { status: response.status });
    }
    
    const data = await response.json();
    console.log('Webhook subscription response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      return Response.json({ 
        status: 'success', 
        message: 'Webhook subscription created successfully' 
      });
    } else {
      return Response.json({ 
        status: 'error', 
        message: 'Failed to create webhook subscription',
        details: data
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error subscribing webhook:', error);
    return Response.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}
