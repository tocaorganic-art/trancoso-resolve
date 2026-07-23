// Thresholds para Web Vitals
const THRESHOLDS = {
  lcp:      { good: 2500,  bad: 4000  }, // ms
  fid:      { good: 100,   bad: 300   }, // ms
  cls:      { good: 0.1,   bad: 0.25  }, // score
  ttfb:     { good: 800,   bad: 1800  }, // ms
  loadTime: { good: 3000,  bad: 6000  }, // ms
};

function classify(metric, value) {
  if (value === null || value === undefined) return 'unknown';
  const t = THRESHOLDS[metric];
  if (!t) return 'unknown';
  if (value <= t.good) return 'good';
  if (value >= t.bad) return 'bad';
  return 'warning';
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const body = await req.json();
    const { page, lcp, fid, cls, ttfb, loadTime, timestamp } = body;

    const metrics = { lcp, fid, cls, ttfb, loadTime };
    const results = {};
    let overallStatus = 'ok';

    for (const [metric, value] of Object.entries(metrics)) {
      if (value === null || value === undefined) continue;
      const status = classify(metric, value);
      results[metric] = { value, status };

      if (status === 'bad') {
        overallStatus = 'critical';
      } else if (status === 'warning' && overallStatus !== 'critical') {
        overallStatus = 'warning';
      }
    }

    console.info('PERFORMANCE_METRIC', { page, timestamp, overallStatus, results });

    return Response.json({ status: overallStatus, metrics: results });
  } catch (error) {
    console.error('Error logging performance:', error);
    return Response.json({ error: 'Failed to log performance' }, { status: 500 });
  }
});
