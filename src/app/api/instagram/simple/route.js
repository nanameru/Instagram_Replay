/**
 * Extremely simple API route for testing
 * This route doesn't depend on any external modules
 */

export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Simple API test endpoint is working"
  });
}
