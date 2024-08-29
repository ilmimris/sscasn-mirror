export async function GET(request: Request) {
    const startTime = Date.now();
  
    try {
      const response = {
        data: [{"id":"2","nama":"CPNS"}],
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
  