import { getDb } from "../../server/db.js";
import * as schema from "../../shared/schema.js";
import { drizzle } from "drizzle-orm/d1";

export async function onRequestGet(context) {
  try {
    const db = drizzle(context.env.DB, { schema });
    const { results } = await db.prepare("SELECT * FROM vendors").all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch vendors" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const db = drizzle(context.env.DB, { schema });
    // Handle vendor creation logic here
    return new Response(JSON.stringify({ message: "Vendor created" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create vendor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
