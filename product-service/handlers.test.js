import mockProducts from './data/mock.json';

import getProductsList from './handlers/getProductsList';
import getProductsById from './handlers/getProductById';

describe('products service API test', () => {
  it('shoould return array of products', async () => {
    const res = await getProductsList();

    expect(res.statusCode).toBe(200);
    const body = res.body;
    expect(body).toEqual(JSON.stringify(mockProducts));
  });
})

describe('product api test', () => {
  it('should return item of product, selected by unique id', async () => {
    const res = await getProductsById(mockProducts[1].id);

    expect(res.statusCode).toBe(200);
    const body = res.body;
    expect(body).toBe(JSON.stringify(mockProducts[1]));
  });
})
