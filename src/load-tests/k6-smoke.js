/* eslint-disable no-undef */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5173';

export default function () {
  // Test homepage
  let res = http.get(`${BASE_URL}/`);
  check(res, {
    'homepage status 200': (r) => r.status === 200,
    'homepage load time < 2s': (r) => r.timings.duration < 2000,
  });
  sleep(1);

  // Test API endpoints
  res = http.get(`${BASE_URL}/api/servicios`);
  check(res, {
    'API services status 200': (r) => r.status === 200,
    'API response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);

  // Test search
  res = http.post(`${BASE_URL}/api/search`, JSON.stringify({ query: 'faxina' }), {
    headers: { 'Content-Type': 'application/json' },
  });
  check(res, {
    'search status 200': (r) => r.status === 200,
    'search response time < 800ms': (r) => r.timings.duration < 800,
  });
  sleep(1);
}