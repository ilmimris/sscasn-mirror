import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

import fs from "fs/promises";
import path from "path";
import xlsx from "xlsx";

async function loadExcelData() {
  try {
    const filePath = path.join(
      process.cwd(),
      "app",
      "api",
      "seed",
      "jobs",
      "sscasn_data.xlsx"
    );
    const fileBuffer = await fs.readFile(filePath);
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    return jsonData.map((row: any) => ({
      id: row.formasi_id?.toString() || "",
      agency: row.ins_nm?.toString() || "",
      job_name: row.jp_nama?.toString() || "",
      formation_name: row.formasi_nm?.toString() || "",
      position_name: row.jabatan_nm?.toString() || "",
      location_name: row.lokasi_nm?.toString() || "",
      number_of_formations: row.jumlah_formasi?.toString() || "",
      is_disabled: row.disable?.toString() || "",
      min_salary: row.gaji_min?.toString() || "",
      max_salary: row.gaji_max?.toString() || "",
      education_level: row.jenjang_studi?.toString() || "",
      education_program: row.program_studi?.toString() || "",
    }));
  } catch (error) {
    console.error("Gagal memuat data dari file Excel:", error);
    return [];
  }
}

export async function POST(request: Request) {
  // Create table if not exits
  await sql`CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(255) PRIMARY KEY,
        agency_id VARCHAR(255),
        agency_name VARCHAR(255),
        job_name VARCHAR(255),
        formation_name VARCHAR(255),
        position_name VARCHAR(255),
        location_name VARCHAR(255),
        number_of_formations VARCHAR(255),
        is_disabled VARCHAR(255),
        min_salary VARCHAR(255),
        max_salary VARCHAR(255),
        education_level_id VARCHAR(255),
        education_level_name VARCHAR(255),
        education_program_id VARCHAR(255),
        education_program_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
  
  // Tambahkan indeks untuk cursor pagination menggunakan created_at
  await sql`CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs (created_at);`;
  
  await sql`CREATE INDEX IF NOT EXISTS idx_agency_education_program 
            ON jobs (agency_id, education_level_id, education_program_id);`;

  // Load data from excel
  const data = await loadExcelData();

  // Insert data to table
  for (const row of data) {
    const agency_id = await sql`SELECT id FROM agencies WHERE name = ${row.agency} LIMIT 1`;
    const education_level_id = await sql`SELECT id FROM educations WHERE name = ${row.education_level} LIMIT 1`;
    const education_program_id = await sql`SELECT id FROM majors WHERE name = ${row.education_program} LIMIT 1`;
  
    await sql`INSERT INTO jobs (id, agency_id, agency_name, job_name, formation_name, position_name, location_name, number_of_formations, is_disabled, min_salary, max_salary, education_level_id, education_level_name, education_program_id, education_program_name, created_at, updated_at) 
              VALUES (${row.id}, ${agency_id.rows[0].id}, ${row.agency}, ${row.job_name}, ${row.formation_name}, ${row.position_name}, ${row.location_name}, ${row.number_of_formations}, ${row.is_disabled}, ${row.min_salary}, ${row.max_salary}, ${education_level_id.rows[0].id}, ${row.education_level}, ${education_program_id.rows[0].id}, ${row.education_program}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
  }

  return NextResponse.json(
    { message: "Data berhasil dimuat dan disimpan", status: "Success" },
    { status: 200 }
  );
}
