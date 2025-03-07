import { db, testDbConnection } from "@/db/db";
import { deals } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing database connection...");
    const connectionTest = await testDbConnection();

    if (!connectionTest.success) {
      console.error("Database connection failed:", connectionTest.error);
      return NextResponse.json(
        {
          error: "Database connection failed",
          details:
            connectionTest.error instanceof Error
              ? connectionTest.error.message
              : String(connectionTest.error),
        },
        { status: 500 }
      );
    }

    console.log("Database connection successful:", connectionTest.time);
    console.log("Attempting to fetch deals from database...");

    const result = await db.select().from(deals);
    console.log(`Successfully fetched ${result.length} deals`);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching deals:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));

    // Return a more descriptive error response
    return NextResponse.json(
      {
        error: "Failed to fetch deals",
        message: error instanceof Error ? error.message : "Unknown error",
        code: error instanceof Error && "code" in error ? error.code : null,
      },
      { status: 500 }
    );
  }
}
