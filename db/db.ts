import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

config({ path: ".env.local" });

// Switch to pg library which handles SASL auth differently
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 3,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Create client for single queries
export const db = drizzle(pool);

// Health check function to test connection
export async function testDbConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    client.release();
    return { success: true, time: result.rows[0].now };
  } catch (error) {
    console.error("Database connection test failed:", error);
    return { success: false, error };
  }
}
