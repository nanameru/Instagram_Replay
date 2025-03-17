/**
 * Server-Sent Events (SSE) endpoint for real-time updates
 * This allows the frontend to receive real-time updates about new messages
 */

export async function GET(req) {
  const encoder = new TextEncoder();
  const customerId = new URL(req.url).searchParams.get('customerId');
  
  // Create a stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const initialData = encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);
      controller.enqueue(initialData);
      
      // Set up interval to check for new messages
      const interval = setInterval(async () => {
        try {
          // In a real implementation, we would check for new messages here
          // For now, just send a heartbeat
          const data = encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`);
          controller.enqueue(data);
          
          // Simulate occasional new message (for demo purposes)
          if (Math.random() < 0.2) { // 20% chance of new message
            const mockMessage = {
              type: 'new_message',
              message: {
                id: `msg-${Date.now()}`,
                senderId: customerId,
                text: `新しいメッセージ (${new Date().toLocaleTimeString('ja-JP')})`,
                timestamp: Date.now(),
                isFromCustomer: true
              }
            };
            
            const messageData = encoder.encode(`data: ${JSON.stringify(mockMessage)}\n\n`);
            controller.enqueue(messageData);
          }
        } catch (error) {
          console.error('Error sending SSE:', error);
          
          // Send error to client
          const errorData = encoder.encode(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
          controller.enqueue(errorData);
        }
      }, 5000); // Check every 5 seconds
      
      // Clean up interval when client disconnects
      req.signal.addEventListener('abort', () => {
        console.log('Client disconnected from SSE');
        clearInterval(interval);
      });
    }
  });
  
  // Return the stream as an SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
