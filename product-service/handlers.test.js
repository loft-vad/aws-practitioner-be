import mockProducts from './data/mock.json';

import getProductsList from './handlers/getProductsList';
import getProductsById from './handlers/getProductById';
import { catalogBatchProcess } from './handlers';

const AWS = require('aws-sdk-mock');

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

describe('catalogBatchProcess', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  it('should call createProduct and publish to SNS for each SQS record', async () => {
    const mockCreateProduct = jest.fn().mockResolvedValue({});
    AWS.mock('SNS', 'publish', () => ({
      publish: jest.fn().mockReturnThis(),
    }));

    const event = {
      Records: [
        {
          body: JSON.stringify({
            count: 10,
            price: 20,
            title: 'Test Dress',
            description: 'Test Description',
          }),
        },
        {
          body: JSON.stringify({
            count: 5,
            price: 15,
            title: 'Test Shirt',
            description: 'Test Description',
          }),
        },
      ],
    };

    await catalogBatchProcess(event);

    expect(mockCreateProduct).toHaveBeenCalledTimes(2); // Ensure createProduct is called twice
    expect(AWS.SNS().publish).toHaveBeenCalledTimes(2); // Ensure SNS publish is called twice
    expect(AWS.SNS().publish).toHaveBeenCalledWith({
      Subject: 'Product item is added',
      Message: 'Title: Test Dress, Description: Test Description, Price: 20, Quantity: 10',
      TopicArn: 'createProductTopic',
      MessageAttributes: {
        isDress: {
          DataType: 'String',
          StringValue: 'true',
        },
      },
    });
    expect(AWS.SNS().publish).toHaveBeenCalledWith({
      Subject: 'Product item is added',
      Message: 'Title: Test Shirt, Description: Test Description, Price: 15, Quantity: 5',
      TopicArn: 'createProductTopic',
      MessageAttributes: {
        isDress: {
          DataType: 'String',
          StringValue: 'false',
        },
      },
    });
  });
});

AWS.restore('SNS', 'publish');