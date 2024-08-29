import fs from 'fs/promises';
import path from 'path';

// Load data saat inisialisasi
const dataPath = path.join(process.cwd(), "app", "api", "educations", "data.json");
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

export async function GET(request: Request) {
  const startTime = Date.now();

  // Pastikan data telah dimuat sebelum menggunakannya
  if (!educationData) {
    await loadData();
  }

  try {
    const response = {
      data: JSON.parse(educationData),
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
      stack: error,
      code: 500,
      latency: `${(Date.now() - startTime).toFixed(2)} ms`,
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
