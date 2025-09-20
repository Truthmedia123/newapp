import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../../shared/schema.ts';

// Helper function to generate a secret link
function generateSecretLink() {
  return 'admin_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export async function onRequestGet({ env, request }) {
  try {
    const db = drizzle(env.DB, { schema });
    const weddingsList = await db.select().from(schema.weddings).all();
    
    return new Response(JSON.stringify(weddingsList), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching weddings:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch weddings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const db = drizzle(env.DB, { schema });
    const body = await request.json();
    console.log('Creating wedding with data:', body);
    
    // Generate a secret link if one wasn't provided
    const weddingData = {
      ...body,
      adminSecretLink: body.adminSecretLink || generateSecretLink()
    };
    
    const wedding = await db.insert(schema.weddings).values(weddingData).returning().get();
    console.log('Wedding created successfully:', wedding);
    
    return new Response(JSON.stringify(wedding), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error creating wedding:', error);
    return new Response(JSON.stringify({ error: 'Failed to create wedding', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}