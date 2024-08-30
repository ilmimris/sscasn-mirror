import {sql} from "@vercel/postgres";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

// Load data saat inisialisasi
const dataPath = path.join(
  process.cwd(),
  "app",
  "api",
  "seed",
  "govt-agencies",
  "data.json"
);
let govtAgenciesData: string;

// Fungsi untuk memuat data
async function loadData() {
  try {
    govtAgenciesData = await fs.readFile(dataPath, "utf8");
  } catch (error) {
    console.error("Gagal memuat data pendidikan:", error);
    govtAgenciesData = "[]"; // Data kosong jika gagal memuat
  }
}

// Muat data saat aplikasi dimulai
loadData();

export async function POST(request: Request) {
    if (!govtAgenciesData) {
        await loadData();
    }

    // Create table if not exists
    await sql`CREATE TABLE IF NOT EXISTS agencies (
        id VARCHAR(255) PRIMARY KEY,
        lokasiId VARCHAR(255),
        nama VARCHAR(255),
        jenis VARCHAR(1),
        cepatKode VARCHAR(10),
        prosesBerkasDipusat VARCHAR(1),
        mgrCepatKode VARCHAR(10),
        status VARCHAR(1),
        cepatKode5 VARCHAR(10),
        cepatKode5Lama VARCHAR(10),
        namaBaru VARCHAR(255),
        namaJabatan VARCHAR(255),
        jenisInstansiId VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

    // Insert data to database
    const govtAgencies = JSON.parse(govtAgenciesData);
    for (const agency of govtAgencies) {
        const {
            id,
            lokasiId,
            nama,
            jenis,
            cepatKode,
            prosesBerkasDipusat,
            mgrCepatKode,
            status,
            cepatKode5,
            cepatKode5Lama,
            namaBaru,
            namaJabatan,
            jenisInstansiId
        } = agency;

        await sql`INSERT INTO agencies (
            id,
            lokasiId,
            nama,
            jenis,
            cepatKode,
            prosesBerkasDipusat,
            mgrCepatKode,
            status,
            cepatKode5,
            cepatKode5Lama,
            namaBaru,
            namaJabatan,
            jenisInstansiId,
            created_at,
            updated_at
        ) VALUES (
            ${id},
            ${lokasiId},
            ${nama},
            ${jenis},
            ${cepatKode},
            ${prosesBerkasDipusat},
            ${mgrCepatKode},
            ${status},
            ${cepatKode5},
            ${cepatKode5Lama},
            ${namaBaru},
            ${namaJabatan},
            ${jenisInstansiId},
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        ) ON CONFLICT (id) DO NOTHING;`;
    }

    return NextResponse.json({
        pesan: "Data instansi pemerintah berhasil di-seed",
        status: "Sukses"
    });
}