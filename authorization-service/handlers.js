import basicAuthorizerFunction from './handlers/basicAuthorizer';

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

export const basicAuthorizer = async (event) => {
  try {
    console.log('event: ', event);
    const result = basicAuthorizerFunction(event);
    return result;
  } catch (error) {
    return serverError(error);
  }
};
