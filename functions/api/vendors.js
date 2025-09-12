import { drizzle } from 'drizzle-orm/d1';
import { eq, like, or } from 'drizzle-orm';
import * as schema from '../../shared/schema.ts';

export async function onRequestGet({ env, request }) {
  try {
    const db = drizzle(env.DB, { schema });
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const location = url.searchParams.get('location');
    const search = url.searchParams.get('search');
    
    let query = db.select().from(schema.vendors);
    
    if (category) {
      query = query.where(eq(schema.vendors.category, category));
    }
    if (location) {
      query = query.where(eq(schema.vendors.location, location));
    }
    if (search) {
      query = query.where(
        or(
          like(schema.vendors.name, `%${search}%`),
          like(schema.vendors.description, `%${search}%`)
        )
      );
    }
    
    const { results } = await query.all();
    
    return new Response(JSON.stringify(results), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch vendors' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestPost({ env, request }) {
  try {
    const db = drizzle(env.DB, { schema });
    const body = await request.json();
    
    const newVendor = await db.insert(schema.vendors).values(body).returning().get();
    
    return new Response(JSON.stringify(newVendor), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error creating vendor:', error);
    return new Response(JSON.stringify({ error: 'Failed to create vendor' }), {
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