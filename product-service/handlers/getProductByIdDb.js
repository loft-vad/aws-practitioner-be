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

export default async function productByIdDb(id) {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { rows: product_item_stock } = await client.query(`
    select p.id, s.count, p.price, p.title, p.description 
    from products as p
    inner join
    "stocks" as s 
    on p.id = s.products_id 
    where s.products_id = '${id}'
    `);
    return {
      statusCode: 200,
      body: JSON.stringify(product_item_stock)
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
