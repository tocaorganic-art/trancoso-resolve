import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const errorData = await req.json();

    // Log error with structured format
    console.error('CLIENT_ERROR', {
      timestamp: errorData.timestamp,
      message: errorData.message,
      context: errorData.context,
      url: errorData.url,
      userAgent: errorData.userAgent?.substring(0, 200) // Truncate for size
    });

    // In production, you could:
    // - Send to external error tracking (Sentry, Rollbar, etc.)
    // - Store in database for analysis
    // - Alert if critical error

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Error logging error:', error);
    return Response.json({ error: 'Failed to log error' }, { status: 500 });
  }
});