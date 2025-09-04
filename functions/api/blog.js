import { getDb } from "../../server/db.js";
import * as schema from "../../shared/schema.js";
import { drizzle } from "drizzle-orm/d1";

export async function onRequestGet(context) {
  try {
    const db = drizzle(context.env.DB, { schema });
    const { results } = await db.prepare("SELECT * FROM blog_posts").all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch blog posts" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
