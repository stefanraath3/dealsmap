import "dotenv/config";
import pkg from "pg";
const { Client } = pkg;

async function testConnection() {
  // Use environment variable for connection string
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("Testing connection...");

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log("Connection successful!");

    // Check if deals table exists
    const tableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'deals'
      );
    `;
    const tableExists = await client.query(tableQuery);
    console.log("Deals table exists:", tableExists.rows[0].exists);

    // Get deals table structure
    const structureQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'deals';
    `;
    const structure = await client.query(structureQuery);
    console.log("Deals table structure:", structure.rows);

    // Count records in deals table
    const countQuery = `SELECT COUNT(*) FROM deals;`;
    const count = await client.query(countQuery);
    console.log("Number of deals:", count.rows[0].count);

    // Get a sample of deals
    const sampleQuery = `SELECT id, title, description FROM deals LIMIT 3;`;
    const sample = await client.query(sampleQuery);
    console.log("Sample deals:", sample.rows);

    await client.end();
  } catch (err) {
    console.error("Connection error:", err);
  }
}

// Run test connection
testConnection();
