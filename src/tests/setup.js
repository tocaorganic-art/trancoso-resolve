/* eslint-env node */
/* eslint-disable no-undef */
// Test setup and utilities
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.OPENAI_API_KEY = 'sk-mock';
process.env.BASE44_APP_ID = 'test-app-id';

// Mock globals
global.fetch = jest.fn();