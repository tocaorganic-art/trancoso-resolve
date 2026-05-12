import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const metrics = await req.json();

    // Log performance metrics
    console.info('PERFORMANCE_METRIC', {
      timestamp: metrics.timestamp,
      pageLoadTime: Math.round(metrics.pageLoadTime),
      domContentLoaded: Math.round(metrics.domContentLoaded),
      firstPaint: Math.round(metrics.firstPaint)
    });

    // In production, you could:
    // - Store in database for trend analysis
    // - Alert if page load time exceeds threshold
    // - Generate reports for optimization

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Error logging performance:', error);
    return Response.json({ error: 'Failed to log performance' }, { status: 500 });
  }
});