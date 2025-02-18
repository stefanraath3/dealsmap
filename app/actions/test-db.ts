"use server";

import { db } from "@/lib/db";

export async function testDbConnection() {
  try {
    const result = await db.execute("SELECT 1"); // Basic test query
    console.log("Database connection successful:", result);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
