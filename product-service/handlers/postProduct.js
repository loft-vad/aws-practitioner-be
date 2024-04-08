import { Client } from 'pg';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
};

export default async function postProductDb(count, price, title, description) {

  const client = new Client(dbOptions);
  await client.connect();

  try {

    await client.query("begin transaction;");

    const { rows: [putProductResult] } = await client.query(`
      insert into products (title, description, price) 
      values ('${title}', '${description}', ${price})
      returning *
    `);

    console.log('putProductResult: ', putProductResult);

    const products_id = putProductResult.id;

    const { rows: [putStockResult] } = await client.query(`
      insert into stocks (products_id, count) 
      values ('${products_id}', ${count})
      returning *
    `);

    console.log('putStockResult: ', putStockResult);

    await client.query("commit;");

    return {
      statusCode: 200,
      body: JSON.stringify({ ...putProductResult, ...putStockResult })
    };
  } catch (error) {
    console.error('Error during DB request execution: ', error);
    return {
      statusCode: 500,
      body: "server error"
    };
  } finally {
    client.end();
  }
}
