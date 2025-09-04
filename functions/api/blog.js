import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import * as schema from '../../shared/schema.js';

export async function onRequestGet({ env, request }) {
  try {
    const db = drizzle(env.DB, { schema });
    const url = new URL(request.url);
    const slug = url.pathname.split('/').pop();
    
    if (slug && slug !== 'blog') {
      // Get specific blog post by slug
      const { results } = await db
        .select()
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.slug, slug))
        .all();
      
      if (results.length === 0) {
        return new Response(JSON.stringify({ error: 'Blog post not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify(results[0]), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } else {
      // Get all published blog posts
      const { results } = await db
        .select()
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.published, true))
        .all();
      
      return new Response(JSON.stringify(results), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch blog posts' }), {
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