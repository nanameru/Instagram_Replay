/**
 * Simple test API route for Instagram integration
 */

export async function GET(request) {
  try {
    // Get Instagram access token from environment variables
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    // Return basic status information
    return Response.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      token_available: !!accessToken,
      environment: process.env.NODE_ENV,
      message: "Instagram API test endpoint is working"
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    
    return Response.json({
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
