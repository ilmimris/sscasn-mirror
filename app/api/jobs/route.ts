import { sql } from "@vercel/postgres";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agencyId = searchParams.get('agency_id');
  const educationId = searchParams.get('education_id');
  const majorId = searchParams.get('major_id');
  const cursor = searchParams.get('cursor') || '0';
  const limit = parseInt(searchParams.get('limit') || '10');

  let query = `
    SELECT * FROM jobs
    WHERE 1=1
  `;

  if (agencyId) {
    query = `${query} AND agency_id = ${agencyId}`;
  }
  
  if (educationId) {
    query = `${query} AND education_level_id = ${educationId}`;
  }
  
  if (majorId) {
    query = `${query} AND education_program_id = ${majorId}`;
  }

  const finalQuery = sql`
    ${query}
    AND created_at > ${cursor}
    ORDER BY created_at
    LIMIT ${limit + 1}
  `;

  const result = await finalQuery;

  let nextCursor = null;
  if (result.rows.length > limit) {
    nextCursor = result.rows[limit - 1].id;
    result.rows.pop();
  }

  return new Response(JSON.stringify({
    data: result.rows,
    nextCursor: nextCursor,
    status: "Success"
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}