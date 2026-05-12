/* eslint-disable no-undef */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.2'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:5173';

export default function () {
  const res = http.get(`${BASE_URL}/`);
  check(res, {
    'status 200': (r) => r.status === 200,
    'duration < 3s': (r) => r.timings.duration < 3000,
  });
  sleep(1);
}