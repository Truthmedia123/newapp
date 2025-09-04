export async function onRequestGet() {
  return new Response(JSON.stringify({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  }), {
    headers: { "Content-Type": "application/json" },
  });
}
