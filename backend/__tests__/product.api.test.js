const request = require('supertest')
const app = require('../app')

describe('MineKart Product API', () => {
  test('GET /product should return products successfully', async () => {
    const response = await request(app).get('/product').set('Accept', 'application/json')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.body).toBeDefined()
    expect(response.body.success).toBe(true)
    expect(response.body.data).toBeInstanceOf(Array)
  }, 15000)
})
