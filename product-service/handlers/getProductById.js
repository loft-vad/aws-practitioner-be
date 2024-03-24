import mockProducts from '../data/mock.json'

export default function getProductById(id) {
  const item = mockProducts.find(item => item.id === id);

  return new Promise((resolve, reject) => {
    if (item) {
      resolve({
        statusCode: 200,
        body: JSON.stringify(item)
      });
    } else {
      reject({
        statusCode: 400,
        body: JSON.stringify(errorMessage)
      });
    }
  });
}
