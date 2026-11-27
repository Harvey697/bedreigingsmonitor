// Vercel Serverless Function: /api/health
const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'bedreigingsmonitor-nl',
      runtime: 'vercel-serverless',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
  );
}
