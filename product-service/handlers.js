'use strict';

import productsList from './handlers/getProductsList';
import productById from './handlers/getProductById';

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*"
};

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