const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Update path if needed

// ⏱️ Increase timeout for slow tests
jest.setTimeout(15000); // 15 seconds

describe('Smart_Summary API Tests', () => {

  // ✅ Close DB after all tests to prevent open handles
  afterAll(async () => {
    await mongoose.disconnect();
  });

  // ✅ Test 1: Summary generation
  test('POST /api/summarize - valid input', async () => {
    const res = await request(app)
      .post('/api/summarize')
      .send({ text: "This is a test summary input for AI summarization." });

    expect(res.statusCode).toBe(200);
    expect(res.body.summary).toBeDefined();
  });

  

  // ✅ Test 2: Fetch summaries
  test('GET /api/summaries - fetch list', async () => {
    const res = await request(app).get('/api/summaries');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // ✅ Test 3: Ask helper bot
  test('POST /api/ask - bot response', async () => {
    const res = await request(app)
      .post('/api/ask')
      .send({ question: "how to use this tool" });

    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toMatch(/click 'Summarize'/i);
  });
});
