export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    const uptimeData = {
      serverUptime: await (async () => {
        // Implementasi untuk mendapatkan uptime server sebenarnya
        const uptimeInSeconds = process.uptime();
        const days = Math.floor(uptimeInSeconds / 86400);
        const hours = Math.floor((uptimeInSeconds % 86400) / 3600);
        const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
        return `${days} hari ${hours} jam ${minutes} menit`;
      })(),
      lastRestart: await (async () => {
        // Mendapatkan waktu restart terakhir
        const lastRestartTime = new Date(Date.now() - (process.uptime() * 1000));
        return lastRestartTime.toISOString();
      })(),
      currentLoad: await (async () => {
        // Menggunakan modul 'os' untuk mendapatkan beban CPU
        const os = require('os');
        const cpus = os.cpus();
        const avgLoad = os.loadavg()[0];
        const cpuCount = cpus.length;
        return `${Math.round((avgLoad / cpuCount) * 100)}%`;
      })(),
      memoryUsage: await (async () => {
        // Mendapatkan penggunaan memori sebenarnya
        const totalMem = process.memoryUsage().heapTotal;
        const usedMem = process.memoryUsage().heapUsed;
        return `${(usedMem / 1024 / 1024).toFixed(2)} MB / ${(totalMem / 1024 / 1024).toFixed(2)} MB`;
      })()
    };

    const response = {
      data: uptimeData,
      error: null,
      code: 200,
      latency: `${(Date.now() - startTime).toFixed(2)} ms`
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const errorResponse = {
      data: null,
      error: "Terjadi kesalahan internal server",
      code: 500,
      latency: `${(Date.now() - startTime).toFixed(2)} ms`
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}