/**
 * Instagram Webhook endpoint for receiving real-time DM notifications
 * This endpoint handles both webhook verification and incoming message events
 */

// Webhook verification endpoint (GET)
export async function GET(req) {
  const url = new URL(req.url);
  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');
  
  // Get verification token from environment variables
  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || 'instagram-webhook-verify-token';
  
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('Webhook verified successfully');
    return new Response(challenge);
  } else {
    console.error('Webhook verification failed');
    return new Response('Verification failed', { status: 403 });
  }
}

// Webhook event handler (POST)
export async function POST(req) {
  try {
    const body = await req.json();
    
    console.log('Received webhook event:', JSON.stringify(body, null, 2));
    
    // Process Instagram webhook events
    if (body.object === 'instagram' && body.entry && body.entry.length > 0) {
      for (const entry of body.entry) {
        // Process messaging events
        if (entry.messaging && entry.messaging.length > 0) {
          for (const messagingEvent of entry.messaging) {
            // Process message in background to avoid webhook timeout
            processMessageInBackground(messagingEvent);
          }
        }
      }
    }
    
    // Return success immediately to acknowledge receipt
    return Response.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return Response.json({ 
      status: 'error', 
      message: error.message 
    }, { status: 500 });
  }
}

// Process message in background to avoid webhook timeout
async function processMessageInBackground(messagingEvent) {
  try {
    const senderId = messagingEvent.sender.id;
    const recipientId = messagingEvent.recipient.id;
    const timestamp = messagingEvent.timestamp;
    const message = messagingEvent.message;
    
    console.log(`Processing message from ${senderId} to ${recipientId} at ${new Date(timestamp).toISOString()}`);
    
    if (message && message.text) {
      console.log(`Message content: ${message.text}`);
      
      // Save message to database (would be implemented in a real app)
      // await saveMessageToDatabase({
      //   senderId,
      //   recipientId,
      //   timestamp,
      //   text: message.text,
      //   isFromCustomer: true
      // });
      
      // Generate AI response (would be implemented in a real app)
      // const aiResponse = await generateResponse(message.text, conversationHistory);
      
      // For now, just log that we would generate a response
      console.log(`Would generate AI response for message: ${message.text}`);
    }
  } catch (error) {
    console.error('Error processing message in background:', error);
  }
}
