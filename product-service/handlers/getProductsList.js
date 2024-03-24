import mockProducts from '../data/mock.json'

export default function getProductsList() {
  return new Promise((resolve, reject) => {
    if (mockProducts) {
      resolve({
        statusCode: 200,
        body: JSON.stringify(mockProducts)
      });
    } else {
      reject({
        statusCode: 400,
        body: JSON.stringify(errorMessage)
      });
    }
  });
}