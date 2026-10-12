
const request = require('supertest');
const app = require('../app');

describe('MineKart Product API', () => {
  test('GET /product should return products successfully', async () => {
    const response = await request(app)
      .get('/product')
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);

    console.log('Product API response:', response.body);
  });
});
