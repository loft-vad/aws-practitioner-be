'use strict';

import productsList from './handlers/getProductsList';
import productsListDb from './handlers/getProductsListDb';
import productById from './handlers/getProductById';
import productByIdDb from './handlers/getProductByIdDb';
import postProductDb from './handlers/postProduct';

const AWS = require('aws-sdk');
const { REGION, SNS_ARN } = process.env;

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*"
};

const serverError = (error) => {
  return {
    statusCode: 400,
    body: error
  }
}

export const getProductsList = async (event) => {
  try {
    const products = await productsList();
    products.headers = defaultHeaders;
    console.log('products: ', products);
    return products;
  } catch (error) {
    return error;
  }
};

export const getProductsById = async (event) => {
  try {
    const { id } = await event.pathParameters;
    const productItem = await productById(id);
    productItem.headers = defaultHeaders;
    console.log('productItem: ', productItem);
    return productItem;
  } catch (error) {
    return error;
  }
};

export const postProduct = async (event) => {
  try {
    const { count, price, title, description } = JSON.parse(event.body);
    if (!count || !price || !title || !description) {
      return serverError('Insufficient product data to add.');
    }
    console.log('count, price, title, description: ', count, price, title, description);
    const result = await postProductDb(count, price, title, description);
    result.headers = defaultHeaders;
    console.log('postProduct result: ', result);
    return result;
  } catch (error) {
    return serverError(error);
  }
};

export const getProductsListDb = async (event) => {
  try {
    const products = await productsListDb();
    products.headers = defaultHeaders;
    console.log('products: ', products);
    return products;
  } catch (error) {
    return serverError(error);
  }
};

export const getProductsByIdDb = async (event) => {
  try {
    const { id } = await event.pathParameters;
    const productItem = await productByIdDb(id);
    productItem.headers = defaultHeaders;
    console.log('productItem: ', productItem);
    return productItem;
  } catch (error) {
    return serverError(error);
  }
};

export const catalogBatchProcess = async (event) => {
  const sns = new AWS.SNS({ region: REGION });
  const sqsRecords = event.Records;

  for (let i = 0; i < sqsRecords.length; i++) {
    const { count, price, title, description } = JSON.parse(sqsRecords[i].body);
    const result = await createProduct(count, price, title, description);

    const snsParams = {
      Subject: 'Product item is added',
      Message: `Title: ${title}, Description: ${description}, Price: ${price}, Quantity: ${count}`,
      TopicArn: SNS_ARN,
      MessageAttributes: {
        isDress: {
          DataType: 'String',
          StringValue: title.includes("dress").toString(),
        },
      },
    };

    sns.publish(snsParams, function (error, data) {
      if (error) {
        console.error("Adding to SNS - Error: ", error);
      } else {
        console.log("SNS added product items: " + JSON.stringify(data));
      }
    });
  }
};
