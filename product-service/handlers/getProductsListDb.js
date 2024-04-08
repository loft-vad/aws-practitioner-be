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

export default async function productsListDb(id) {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { rows: products_items_stock } = await client.query("SELECT p.id, s.count, p.price, p.title, p.description from products as p, stocks as s where p.id = s.products_id");
    return {
      statusCode: 200,
      body: JSON.stringify(products_items_stock)
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
