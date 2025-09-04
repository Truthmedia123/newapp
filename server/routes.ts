import type { Hono } from "hono";
import { getDb, type Env } from "./db";
import { 
  insertReviewSchema, 
  insertBusinessSubmissionSchema, 
  insertContactSchema,
  insertRsvpInvitationSchema,
  insertRsvpQuestionSchema,
  insertRsvpResponseSchema,
  insertWeddingEventSchema,
  vendors,
  reviews,
  categories,
  blogPosts,
  businessSubmissions,
  contacts,
  weddings,
  rsvps,
  rsvpInvitations,
  rsvpQuestions,
  rsvpResponses,
  weddingEvents
} from "@shared/schema";

import { eq, like, or } from "drizzle-orm";  

export function registerRoutes(app: Hono<{ Bindings: Env }>) {
  // Vendors
  app.get("/api/vendors", async (c) => {
    try {
      const { category, location, search } = c.req.query();
      const db = getDb(c.env);
      
      let query = db.select().from(vendors);
      
      if (category) {
        query = query.where(eq(vendors.category, category));
      }
      if (location) {
        query = query.where(eq(vendors.location, location));
      }
      if (search) {
        query = query.where(
          or(
            like(vendors.name, `%${search}%`),
            like(vendors.description, `%${search}%`)
          )
        );
      }
      
      const vendorsList = await query.all();
      return c.json(vendorsList);
    } catch (error) {
      return c.json({ message: "Failed to fetch vendors" }, 500);
    }
  });

  app.get("/api/vendors/featured", async (c) => {
    try {
      const db = getDb(c.env);
      const featuredVendors = await db.select().from(vendors).where(eq(vendors.featured, true)).all();
      return c.json(featuredVendors);
    } catch (error) {
      return c.json({ message: "Failed to fetch featured vendors" }, 500);
    }
  });

  app.get("/api/vendors/:id", async (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      const db = getDb(c.env);
      const vendor = await db.select().from(vendors).where(eq(vendors.id, id)).get();
      
      if (!vendor) {
        return c.json({ message: "Vendor not found" }, 404);
      }
      return c.json(vendor);
    } catch (error) {
      return c.json({ message: "Failed to fetch vendor" }, 500);
    }
  });

  // Reviews
  app.get("/api/vendors/:id/reviews", async (c) => {
    try {
      const vendorId = parseInt(c.req.param("id"));
      const db = getDb(c.env);
      const reviewsList = await db.select().from(reviews).where(eq(reviews.vendorId, vendorId)).all();
      return c.json(reviewsList);
    } catch (error) {
      return c.json({ message: "Failed to fetch reviews" }, 500);
    }
  });

  app.post("/api/vendors/:id/reviews", async (c) => {
    try {
      const vendorId = parseInt(c.req.param("id"));
      const body = await c.req.json();
      const reviewData = insertReviewSchema.parse({ ...body, vendorId });
      
      const db = getDb(c.env);
      const review = await db.insert(reviews).values(reviewData).returning().get();
      
      return c.json(review, 201);
    } catch (error) {
      if (error && typeof error === 'object' && 'errors' in error) {
        return c.json({ message: "Invalid review data", errors: (error as any).errors }, 400);
      }
      return c.json({ message: "Failed to create review" }, 500);
    }
  });

  // Categories
  app.get("/api/categories", async (c) => {
    try {
      const db = getDb(c.env);
      const categoriesList = await db.select().from(categories).all();
      return c.json(categoriesList);
    } catch (error) {
      return c.json({ message: "Failed to fetch categories" }, 500);
    }
  });

  app.get("/api/categories/:slug", async (c) => {
    try {
      const slug = c.req.param("slug");
      const db = getDb(c.env);
      const category = await db.select().from(categories).where(eq(categories.slug, slug)).get();
      
      if (!category) {
        return c.json({ message: "Category not found" }, 404);
      }
      return c.json(category);
    } catch (error) {
      return c.json({ message: "Failed to fetch category" }, 500);
    }
  });

  // Blog Posts
  app.get("/api/blog", async (c) => {
    try {
      const db = getDb(c.env);
      const posts = await db.select().from(blogPosts).where(eq(blogPosts.published, true)).all();
      return c.json(posts);
    } catch (error) {
      return c.json({ message: "Failed to fetch blog posts" }, 500);
    }
  });

  app.get("/api/blog/:slug", async (c) => {
    try {
      const slug = c.req.param("slug");
      const db = getDb(c.env);
      const post = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).get();
      
      if (!post) {
        return c.json({ message: "Blog post not found" }, 404);
      }
      return c.json(post);
    } catch (error) {
      return c.json({ message: "Failed to fetch blog post" }, 500);
    }
  });

  // Business Submissions - DISABLED (Admin-only management)
  // app.post("/api/business-submissions", async (c) => {
  //   try {
  //     const body = await c.req.json();
  //     const submissionData = insertBusinessSubmissionSchema.parse(body);
      
  //     const db = getDb(c.env);
  //     const submission = await db.insert(businessSubmissions).values(submissionData).returning().get();
      
  //     return c.json(submission, 201);
  //   } catch (error) {
  //     if (error && typeof error === 'object' && 'errors' in error) {
  //       return c.json({ message: "Invalid submission data", errors: (error as any).errors }, 400);
  //     }
  //     return c.json({ message: "Failed to create business submission" }, 500);
  //   }
  // });

  // Contact
  app.post("/api/contact", async (c) => {
    try {
      const body = await c.req.json();
      const contactData = insertContactSchema.parse(body);
      
      const db = getDb(c.env);
      const contact = await db.insert(contacts).values(contactData).returning().get();
      
      return c.json(contact, 201);
    } catch (error) {
      if (error && typeof error === 'object' && 'errors' in error) {
        return c.json({ message: "Invalid contact data", errors: (error as any).errors }, 400);
      }
      return c.json({ message: "Failed to send contact message" }, 500);
    }
  });

  // Wedding routes
  app.get("/api/weddings", async (c) => {
    try {
      const db = getDb(c.env);
      const weddingsList = await db.select().from(weddings).all();
      return c.json(weddingsList);
    } catch (error) {
      return c.json({ error: "Failed to fetch weddings" }, 500);
    }
  });

  app.get("/api/weddings/:slug", async (c) => {
    try {
      const slug = c.req.param("slug");
      const db = getDb(c.env);
      const wedding = await db.select().from(weddings).where(eq(weddings.slug, slug)).get();
      
      if (!wedding) {
        return c.json({ error: "Wedding not found" }, 404);
      }
      return c.json(wedding);
    } catch (error) {
      return c.json({ error: "Failed to fetch wedding" }, 500);
    }
  });

  app.post("/api/weddings", async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);
      const wedding = await db.insert(weddings).values(body).returning().get();
      return c.json(wedding);
    } catch (error) {
      return c.json({ error: "Failed to create wedding" }, 500);
    }
  });

  app.get("/api/weddings/:id/rsvps", async (c) => {
    try {
      const weddingId = parseInt(c.req.param("id"));
      const db = getDb(c.env);
      const rsvpsList = await db.select().from(rsvps).where(eq(rsvps.weddingId, weddingId)).all();
      return c.json(rsvpsList);
    } catch (error) {
      return c.json({ error: "Failed to fetch RSVPs" }, 500);
    }
  });

  app.post("/api/weddings/:id/rsvps", async (c) => {
    try {
      const weddingId = parseInt(c.req.param("id"));
      const body = await c.req.json();
      const rsvpData = { ...body, weddingId };
      
      const db = getDb(c.env);
      const rsvp = await db.insert(rsvps).values(rsvpData).returning().get();
      return c.json(rsvp);
    } catch (error) {
      return c.json({ error: "Failed to submit RSVP" }, 500);
    }
  });

  // RSVP Generator routes
  app.post("/api/rsvp/generate", async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);

      // Create wedding
      const wedding = await db.insert(weddings).values(body.wedding).returning().get();

      // Create events
      for (const event of body.events) {
        await db.insert(weddingEvents).values({...event, weddingId: wedding.id});
      }

      // Create questions
      for (const question of body.questions) {
        await db.insert(rsvpQuestions).values({...question, weddingId: wedding.id});
      }

      // Generate invitations for guests
      const invitations = [];
      for (const guest of body.guests) {
        const invitation = await db.insert(rsvpInvitations).values({
          weddingId: wedding.id,
          guestName: guest.name,
          guestEmail: guest.email,
          invitationCode: generateInvitationCode(),
          maxGuests: guest.maxGuests || 1,
          allowPlusOne: guest.allowPlusOne || false,
          invitedEvents: JSON.stringify(guest.invitedEvents || [])
        }).returning().get();
        invitations.push(invitation);
      }

      return c.json({ wedding, invitations });
    } catch (error) {
      return c.json({ error: "Failed to generate RSVP" }, 500);
    }
  });

  app.get("/api/rsvp/invitation/:code", async (c) => {
    try {
      const code = c.req.param("code");
      const db = getDb(c.env);

      const invitation = await db.select()
        .from(rsvpInvitations)
        .leftJoin(weddings, eq(rsvpInvitations.weddingId, weddings.id))
        .where(eq(rsvpInvitations.invitationCode, code))
        .get();

      if (!invitation) {
        return c.json({ error: "Invitation not found" }, 404);
      }

      // Get events and questions
      const events = await db.select().from(weddingEvents)
        .where(eq(weddingEvents.weddingId, invitation.wedding_id)).all();

      const questions = await db.select().from(rsvpQuestions)
        .where(eq(rsvpQuestions.weddingId, invitation.wedding_id)).all();

      return c.json({ ...invitation, events, questions });
    } catch (error) {
      return c.json({ error: "Failed to fetch invitation" }, 500);
    }
  });

  app.post("/api/rsvp/submit", async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);

      // Create RSVP record
      const rsvp = await db.insert(rsvps).values({
        weddingId: body.weddingId,
        guestName: body.guests[0]?.name || '',
        guestEmail: body.guests[0]?.email || '',
        numberOfGuests: body.guests.length,
        attendingCeremony: body.attendingCeremony || true,
        attendingReception: body.attendingReception || true
      }).returning().get();

      // Save custom question responses
      for (const [questionId, answer] of Object.entries(body.responses)) {
        await db.insert(rsvpResponses).values({
          rsvpId: rsvp.id,
          questionId: parseInt(questionId),
          answer: String(answer)
        });
      }

      return c.json({ success: true, rsvp });
    } catch (error) {
      return c.json({ error: "Failed to submit RSVP" }, 500);
    }
  });

  // Helper function for generating invitation codes
  function generateInvitationCode(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}
