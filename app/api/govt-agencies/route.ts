import fs from 'fs/promises';
import path from 'path';

// Load data saat inisialisasi
const dataPath = path.join(process.cwd(), "app", "api", "govt-agencies", "data.json");
let govtAgenciesData: string;

// Fungsi untuk memuat data
async function loadData() {
  try {
    govtAgenciesData = await fs.readFile(dataPath, 'utf8');
  } catch (error) {
    console.error('Gagal memuat data pendidikan:', error);
    govtAgenciesData = '[]'; // Data kosong jika gagal memuat
  }
}

// Muat data saat aplikasi dimulai
loadData();

export async function GET(request: Request) {
  const startTime = Date.now();

  if (!govtAgenciesData) {
    await loadData();
  }

  try {
    const response = {
      data: JSON.parse(govtAgenciesData),
      error: null,
      code: 200,
      latency: `${(Date.now() - startTime).toFixed(2)} ms`,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorResponse = {
      data: null,
      error: "Terjadi kesalahan internal server",
      code: 500,
      latency: `${(Date.now() - startTime).toFixed(2)} ms`,
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
