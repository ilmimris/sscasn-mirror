import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // Create table if not exits
    await sql`CREATE TABLE IF NOT EXISTS formations (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    // Loop over majorPerLevel and insert to table
    await sql`INSERT INTO formations (id, name, created_at, updated_at)
              VALUES ('2', 'CPNS', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
              ON CONFLICT (id) DO UPDATE
              SET name = EXCLUDED.name,
                  updated_at = CURRENT_TIMESTAMP;`;

    return NextResponse.json({
        message: "Data formasi berhasil di-seed",
        status: "Success"
    })
}