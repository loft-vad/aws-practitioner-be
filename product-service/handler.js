'use strict';

import productsList from './handlers/getProductsList';
import productById from './handlers/getProductById';

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*"
};

// module.exports.getProductsList = async (event) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(
//       {
//         message: 'Go Serverless v1.0! Your function executed successfully!',
//         input: event,
//       },
//       null,
//       2
//     ),
//   };

//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };

export const getProductsList = async (event) => {
  const products = await productsList();
  products.headers = defaultHeaders;
  console.log('products: ', products);
  return products;
};

export const getProductsById = async (event) => {
  const { id } = await event.pathParameters;
  const productItem = await productById(id);
  productItem.headers = defaultHeaders;
  console.log('productItem: ', productItem);
  return productItem;
};