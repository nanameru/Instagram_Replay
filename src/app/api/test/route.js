/**
 * Extremely simple API route for testing
 */

export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "API test endpoint is working"
  });
}
