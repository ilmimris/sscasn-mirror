import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';

// Load data saat inisialisasi
const dataPath = path.join(process.cwd(), "app", "api", "seed", "educations", "data.json");
let educationData: string;

// Fungsi untuk memuat data
async function loadData() {
  try {
    educationData = await fs.readFile(dataPath, 'utf8');
  } catch (error) {
    console.error('Gagal memuat data pendidikan:', error);
    educationData = '[]'; // Data kosong jika gagal memuat
  }
}

// Muat data saat aplikasi dimulai
loadData();

export async function POST(request: Request) {
  // Seed educations level from data.json file
  // Pastikan data telah dimuat sebelum menggunakannya
  if (!educationData) {
    await loadData();
  }

  // Create table if not exists
  await sql`CREATE TABLE IF NOT EXISTS educations (
    id VARCHAR(255) PRIMARY KEY, 
    nama VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;

  // Insert data to database
  const educations = JSON.parse(educationData);
  for (const education of educations) {
    const { id, nama } = education;
    await sql`INSERT INTO educations (id, name, created_at, updated_at) 
              VALUES (${id}, ${nama}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`;
  }

  return NextResponse.json({ 
    message: "Data pendidikan berhasil di-seed",
    status: "Success"
   });
}