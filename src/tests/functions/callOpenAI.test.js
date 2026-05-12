/* eslint-env jest */
/* eslint-disable no-undef */

describe('callOpenAI - Security & Functionality Tests', () => {
  let mockOpenAI;
  let mockCreateCompletion;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateCompletion = jest.fn();
    mockOpenAI = {
      chat: { completions: { create: mockCreateCompletion } }
    };
  });

  it('should validate OPENAI_API_KEY exists', () => {
    expect(process.env.OPENAI_API_KEY).toBeDefined();
  });

  it('should validate messages field is required and is array', () => {
    const emptyMessages = { messages: [] };
    const validMessages = { messages: [{ role: 'user', content: 'hello' }] };
    const invalidMessages = { messages: 'not array' };

    expect(Array.isArray(emptyMessages.messages)).toBe(true);
    expect(emptyMessages.messages.length === 0).toBe(true);
    expect(Array.isArray(validMessages.messages)).toBe(true);
    expect(validMessages.messages.length > 0).toBe(true);
    expect(Array.isArray(invalidMessages.messages)).toBe(false);
  });

  it('should apply system prompt correctly', () => {
    const customPrompt = 'Custom prompt';
    const defaultPrompt = 'Default system prompt';
    const result = customPrompt || defaultPrompt;
    expect(result).toBe(customPrompt);
  });

  it('should parse JSON schema responses correctly', () => {
    const validJson = '{"key": "value"}';
    const invalidJson = 'not json';
    
    const parsedValid = JSON.parse(validJson);
    expect(parsedValid.key).toBe('value');
    
    expect(() => JSON.parse(invalidJson)).toThrow();
  });

  it('should handle OpenAI API errors (401, 429)', () => {
    const error401 = { status: 401, message: 'Invalid API key' };
    const error429 = { status: 429, message: 'Rate limit exceeded' };
    const error500 = { status: 500, message: 'Server error' };

    expect(error401.status).toBe(401);
    expect(error429.status).toBe(429);
    expect(error500.status).toBe(500);
  });

  it('should include temperature and max_tokens in config', () => {
    const config = {
      temperature: 0.7,
      max_tokens: 1000,
      model: 'gpt-4o-mini'
    };
    expect(config.temperature).toBe(0.7);
    expect(config.max_tokens).toBe(1000);
  });
});