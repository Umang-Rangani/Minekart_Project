describe('Basic backend tests', () => {
  test('addition should work correctly', () => {
    expect(2 + 3).toBe(5);
  });

  test('product price should be positive', () => {
    const product = {
      name: 'Test Product',
      price: 500,
    };

    expect(product.price).toBeGreaterThan(0);
  });
});