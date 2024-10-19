import "dotenv/config";
import { Client } from "pg";

async function query(queryComand: string, values?: (string | null)[]) {
  const client = new Client(process.env.PROD_DATABSE_URL);

  try {
    await client.connect();

    if (values) {
      const response = await client.query(queryComand, values);
      return response;
    } else {
      const response = await client.query(queryComand);
      return response;
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

export default { query };
