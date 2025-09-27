import { Hono } from 'hono';
import { getDb } from './db';
import { eq } from 'drizzle-orm';
import { 
  vendors, 
  reviews, 
  categories, 
  blogPosts, 
  businessSubmissions, 
  contacts, 
  weddings,
  weddingEvents
} from '@shared/schema';
import { authenticateAdmin } from './auth';
import type { Env } from './db';
import { rateLimit } from './middleware/rateLimit';
import { cache } from './middleware/cache';
import { MeiliSearch } from 'meilisearch';

export function registerRoutes(app: Hono<{ Bindings: Env }>) {
  // Health check
  app.get("/api/health", (c) => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Initialize MeiliSearch client
  const client = new MeiliSearch({ 
    host: process.env.MEILI_HOST || 'http://localhost:7700', 
    apiKey: process.env.MEILI_KEY || 'masterKey'
  });

  // Search API with MeiliSearch
  app.get("/api/search/vendors", async (c) => {
    try {
      const q = c.req.query('q') as string;
      if (!q) {
        return c.json({ hits: [] });
      }
      
      const index = client.index('vendors');
      const search = await index.search(q, { limit: 10 });
      return c.json(search.hits);
    } catch (error) {
      console.error('Error searching vendors:', error);
      return c.json({ error: "Failed to search vendors" }, 500);
    }
  });

  // Vendors API with caching and rate limiting
  app.get("/api/vendors", cache(900000), rateLimit(100), async (c) => {
    try {
      const db = getDb(c.env);
      const allVendors = await db.select().from(vendors).all();
      return c.json(allVendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      return c.json({ error: "Failed to fetch vendors" }, 500);
    }
  });

  app.get("/api/vendors/:id", cache(900000), rateLimit(100), async (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      const db = getDb(c.env);
      const vendor = await db.select().from(vendors).where(eq(vendors.id, id)).get();
      
      if (!vendor) {
        return c.json({ error: "Vendor not found" }, 404);
      }
      
      return c.json(vendor);
    } catch (error) {
      console.error('Error fetching vendor:', error);
      return c.json({ error: "Failed to fetch vendor" }, 500);
    }
  });

  app.get("/api/vendors/category/:category", cache(900000), rateLimit(100), async (c) => {
    try {
      const category = c.req.param("category");
      const db = getDb(c.env);
      const vendorsInCategory = await db.select().from(vendors).where(eq(vendors.category, category)).all();
      return c.json(vendorsInCategory);
    } catch (error) {
      console.error('Error fetching vendors by category:', error);
      return c.json({ error: "Failed to fetch vendors by category" }, 500);
    }
  });

  app.post("/api/vendors", authenticateAdmin('vendors'), async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);
      const vendor = await db.insert(vendors).values(body).returning().get();
      return c.json(vendor, 201);
    } catch (error: any) {
      return c.json({ message: "Failed to create vendor", error: error.message }, 500);
    }
  });

  // Bulk vendor import
  app.post("/api/vendors/bulk", authenticateAdmin('vendors'), async (c) => {
    try {
      const { vendors: vendorsData } = await c.req.json();
      const db = getDb(c.env);
      
      // Process each vendor
      const importedVendors = [];
      for (const vendorData of vendorsData) {
        // Parse priceRange if it's a string
        let priceRange = vendorData.priceRange;
        if (typeof priceRange === 'string' && priceRange.startsWith('[') && priceRange.endsWith(']')) {
          try {
            priceRange = JSON.parse(priceRange);
          } catch (e) {
            // If parsing fails, keep as is
          }
        }
        
        // Convert isVerified to boolean if it's a string
        let isVerified = vendorData.isVerified;
        if (typeof isVerified === 'string') {
          isVerified = isVerified.toLowerCase() === 'true';
        }
        
        const processedVendor = {
          ...vendorData,
          priceRange: typeof priceRange === 'string' ? priceRange : JSON.stringify(priceRange),
          isVerified: isVerified,
        };
        
        const vendor = await db.insert(vendors).values(processedVendor).returning().get();
        importedVendors.push(vendor);
      }
      
      return c.json({ 
        message: "Vendors imported successfully", 
        imported: importedVendors.length,
        vendors: importedVendors
      }, 201);
    } catch (error: any) {
      console.error('Error importing vendors:', error);
      return c.json({ message: "Failed to import vendors", error: error.message }, 500);
    }
  });

  app.put("/api/vendors/:id", authenticateAdmin('vendors'), async (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      const body = await c.req.json();
      const db = getDb(c.env);
      const vendor = await db.update(vendors).set(body).where(eq(vendors.id, id)).returning().get();
      
      if (!vendor) {
        return c.json({ message: "Vendor not found" }, 404);
      }
      
      return c.json(vendor);
    } catch (error: any) {
      return c.json({ message: "Failed to update vendor", error: error.message }, 500);
    }
  });

  app.delete("/api/vendors/:id", authenticateAdmin('vendors'), async (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      const db = getDb(c.env);
      const result = await db.delete(vendors).where(eq(vendors.id, id)).returning().get();
      
      if (!result) {
        return c.json({ message: "Vendor not found" }, 404);
      }
      
      return c.json({ message: "Vendor deleted successfully" });
    } catch (error: any) {
      return c.json({ message: "Failed to delete vendor", error: error.message }, 500);
    }
  });

  // Reviews API
  app.get("/api/reviews/vendor/:vendorId", async (c) => {
    try {
      const vendorId = parseInt(c.req.param("vendorId"));
      const db = getDb(c.env);
      const vendorReviews = await db.select().from(reviews).where(eq(reviews.vendorId, vendorId)).all();
      return c.json(vendorReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return c.json({ error: "Failed to fetch reviews" }, 500);
    }
  });

  app.post("/api/reviews", async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);
      const review = await db.insert(reviews).values(body).returning().get();
      return c.json(review, 201);
    } catch (error: any) {
      return c.json({ message: "Failed to create review", error: error.message }, 500);
    }
  });

  // Categories API with caching and rate limiting
  app.get("/api/categories", cache(900000), rateLimit(100), async (c) => {
    try {
      const db = getDb(c.env);
      const allCategories = await db.select().from(categories).all();
      return c.json(allCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return c.json({ error: "Failed to fetch categories" }, 500);
    }
  });

  // Blog API with caching and rate limiting
  app.get("/api/blog", cache(900000), rateLimit(100), async (c) => {
    try {
      const db = getDb(c.env);
      const posts = await db.select().from(blogPosts).all();
      return c.json(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return c.json({ error: "Failed to fetch blog posts" }, 500);
    }
  });

  app.get("/api/blog/:slug", cache(900000), rateLimit(100), async (c) => {
    try {
      const slug = c.req.param("slug");
      const db = getDb(c.env);
      const post = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).get();
      
      if (!post) {
        return c.json({ error: "Blog post not found" }, 404);
      }
      
      return c.json(post);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return c.json({ error: "Failed to fetch blog post" }, 500);
    }
  });

  app.post("/api/blog", authenticateAdmin('blog'), async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);
      const post = await db.insert(blogPosts).values(body).returning().get();
      return c.json(post, 201);
    } catch (error: any) {
      return c.json({ message: "Failed to create blog post", error: error.message }, 500);
    }
  });

  app.put("/api/blog/:id", authenticateAdmin('blog'), async (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      const body = await c.req.json();
      const db = getDb(c.env);
      const post = await db.update(blogPosts).set(body).where(eq(blogPosts.id, id)).returning().get();
      
      if (!post) {
        return c.json({ message: "Blog post not found" }, 404);
      }
      
      return c.json(post);
    } catch (error: any) {
      return c.json({ message: "Failed to update blog post", error: error.message }, 500);
    }
  });

  app.delete("/api/blog/:id", authenticateAdmin('blog'), async (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      const db = getDb(c.env);
      const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning().get();
      
      if (!result) {
        return c.json({ message: "Blog post not found" }, 404);
      }
      
      return c.json({ message: "Blog post deleted successfully" });
    } catch (error: any) {
      return c.json({ message: "Failed to delete blog post", error: error.message }, 500);
    }
  });

  // Business Submissions API
  app.post("/api/business-submissions", async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);
      const submission = await db.insert(businessSubmissions).values(body).returning().get();
      return c.json(submission, 201);
    } catch (error: any) {
      return c.json({ message: "Failed to submit business", error: error.message }, 500);
    }
  });

  // Contact API
  app.post("/api/contact", async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);
      const contact = await db.insert(contacts).values(body).returning().get();
      return c.json(contact, 201);
    } catch (error: any) {
      return c.json({ message: "Failed to submit contact", error: error.message }, 500);
    }
  });

  // Weddings API
  app.get("/api/weddings/:slug", cache(900000), rateLimit(100), async (c) => {
    try {
      const slug = c.req.param("slug");
      const db = getDb(c.env);
      
      // Get wedding with events
      const wedding = await db.select().from(weddings).where(eq(weddings.slug, slug)).get();
      
      if (!wedding) {
        return c.json({ error: "Wedding not found" }, 404);
      }
      
      // Get wedding events
      const events = await db.select().from(weddingEvents)
        .where(eq(weddingEvents.weddingId, wedding.id))
        .orderBy(weddingEvents.order)
        .all();
      
      return c.json({ ...wedding, events });
    } catch (error) {
      console.error('Error fetching wedding:', error);
      return c.json({ error: "Failed to fetch wedding" }, 500);
    }
  });

  app.post("/api/weddings", authenticateAdmin('templates'), async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);
      
      // Generate a secret link if one wasn't provided
      const adminSecretLink = body.adminSecretLink || Math.random().toString(36).substring(2, 15) + 
                             Math.random().toString(36).substring(2, 15);
      
      // Prepare wedding data
      const weddingData = {
        ...body,
        admin_secret_link: adminSecretLink, // Use the database column name
        weddingDate: new Date(body.weddingDate),
        createdAt: new Date(),
        // For backward compatibility, set venue and venueAddress to ceremony venue
        venue: body.ceremonyVenue || body.venue || '',
        venueAddress: body.ceremonyVenueAddress || body.venueAddress || '',
      };
      
      console.log('Processing wedding data:', weddingData);
      
      const wedding = await db.insert(weddings).values(weddingData).returning().get();
      console.log('Wedding created successfully:', wedding);
      
      // Return the wedding data including the secret link
      return c.json({
        ...wedding,
        adminSecretLink
      }, 201);
    } catch (error: any) {
      console.error('Error creating wedding:', error);
      console.error('Error stack:', error.stack);
      return c.json({ 
        error: "Failed to create wedding", 
        details: error.message || String(error),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 500);
    }
  });

  // Wedding Events API
  app.get("/api/weddings/:id/events", cache(900000), rateLimit(100), async (c) => {
    try {
      const weddingId = parseInt(c.req.param("id"));
      const db = getDb(c.env);
      const events = await db.select().from(weddingEvents)
        .where(eq(weddingEvents.weddingId, weddingId))
        .orderBy(weddingEvents.order)
        .all();
      return c.json(events);
    } catch (error) {
      console.error('Error fetching wedding events:', error);
      return c.json({ error: "Failed to fetch wedding events" }, 500);
    }
  });

  app.post("/api/weddings/:id/events", authenticateAdmin('templates'), async (c) => {
    try {
      const weddingId = parseInt(c.req.param("id"));
      const body = await c.req.json();
      const db = getDb(c.env);
      
      const eventData = {
        ...body,
        weddingId,
        date: new Date(body.date),
      };
      
      const event = await db.insert(weddingEvents).values(eventData).returning().get();
      return c.json(event, 201);
    } catch (error: any) {
      return c.json({ message: "Failed to create wedding event", error: error.message }, 500);
    }
  });

  app.put("/api/weddings/:id/events/:eventId", authenticateAdmin('templates'), async (c) => {
    try {
      const eventId = parseInt(c.req.param("eventId"));
      const body = await c.req.json();
      const db = getDb(c.env);
      
      const eventData = {
        ...body,
        date: body.date ? new Date(body.date) : undefined,
      };
      
      const event = await db.update(weddingEvents).set(eventData).where(eq(weddingEvents.id, eventId)).returning().get();
      
      if (!event) {
        return c.json({ message: "Wedding event not found" }, 404);
      }
      
      return c.json(event);
    } catch (error: any) {
      return c.json({ message: "Failed to update wedding event", error: error.message }, 500);
    }
  });

  app.delete("/api/weddings/:id/events/:eventId", authenticateAdmin('templates'), async (c) => {
    try {
      const eventId = parseInt(c.req.param("eventId"));
      const db = getDb(c.env);
      const result = await db.delete(weddingEvents).where(eq(weddingEvents.id, eventId)).returning().get();
      
      if (!result) {
        return c.json({ message: "Wedding event not found" }, 404);
      }
      
      return c.json({ message: "Wedding event deleted successfully" });
    } catch (error: any) {
      return c.json({ message: "Failed to delete wedding event", error: error.message }, 500);
    }
  });
}

export { registerRoutes as setupRoutes };