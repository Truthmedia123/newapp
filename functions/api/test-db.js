export async function onRequestGet({ env }) {
  try {
    // Test database connection by querying the vendors table
    const { results } = await env.DB.prepare(
      "SELECT count(*) as count FROM vendors"
    ).all();
    
    return new Response(JSON.stringify({ 
      status: 'success',
      message: 'Database connection successful',
      vendorCount: results[0].count,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 500
    });
  }
}