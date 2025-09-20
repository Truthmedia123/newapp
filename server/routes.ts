import type { Hono } from "hono";
import { getDb, type Env } from "./db";
import { authenticateAdmin } from "./auth";
import { 
  insertReviewSchema, 
  insertBusinessSubmissionSchema, 
  insertContactSchema,
  insertRsvpInvitationSchema,
  insertRsvpQuestionSchema,
  insertRsvpResponseSchema,
  insertWeddingEventSchema,
  insertRsvpTemplateSchema,
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
  weddingEvents,
  rsvpTemplates
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

  // Admin Vendor CRUD Operations
  app.post("/api/vendors", authenticateAdmin('vendors'), async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);
      const vendor = await db.insert(vendors).values(body).returning().get();
      return c.json(vendor, 201);
    } catch (error) {
      return c.json({ message: "Failed to create vendor", error: error.message }, 500);
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
    } catch (error) {
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
    } catch (error) {
      return c.json({ message: "Failed to delete vendor", error: error.message }, 500);
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

  // Admin Blog Post CRUD Operations
  app.post("/api/blog", authenticateAdmin('blog'), async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);
      const post = await db.insert(blogPosts).values(body).returning().get();
      return c.json(post, 201);
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      return c.json({ message: "Failed to delete blog post", error: error.message }, 500);
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
      // Add ceremonyDetails to the response (even though it's not in the database)
      return c.json({ ...wedding, ceremonyDetails: (wedding as any).ceremonyDetails || '' });
    } catch (error) {
      return c.json({ error: "Failed to fetch wedding" }, 500);
    }
  });

  app.post("/api/weddings", async (c) => {
    try {
      const body = await c.req.json();
      console.log('Creating wedding with data:', body);
      const db = getDb(c.env);
      
      // Extract ceremonyDetails from body but don't include it in the database insert
      // since it's not part of the schema
      const { ceremonyDetails, ...weddingData } = body;
      
      const wedding = await db.insert(weddings).values(weddingData).returning().get();
      console.log('Wedding created successfully:', wedding);
      return c.json({ ...wedding, ceremonyDetails });
    } catch (error) {
      console.error('Error creating wedding:', error);
      return c.json({ error: "Failed to create wedding", details: error.message }, 500);
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

  // Generate Invitations (admin only)
  app.post("/api/rsvp/invitations", async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);

      // Validate input
      if (!Array.isArray(body) || body.length === 0) {
        return c.json({ error: "Invalid guest list" }, 400);
      }

      const invitations = [];
      for (const guest of body) {
        // Validate required fields
        if (!guest.wedding_id || !guest.guest_name || !guest.guest_email) {
          return c.json({ error: "Missing required fields: wedding_id, guest_name, guest_email" }, 400);
        }

        // Generate unique invitation code
        const invitationCode = generateInvitationCode();
        
        const invitation = await db.insert(rsvpInvitations).values({
          weddingId: guest.wedding_id,
          guestName: guest.guest_name,
          guestEmail: guest.guest_email,
          invitationCode,
          maxGuests: guest.max_guests || 1,
          allowPlusOne: guest.allow_plus_one || false,
          status: "sent",
          sentAt: new Date(),
          createdAt: new Date()
        }).returning().get();

        invitations.push({
          ...invitation,
          rsvpLink: `${c.req.header('origin') || 'http://localhost:8787'}/rsvp/${invitationCode}`
        });
      }

      return c.json({ 
        success: true, 
        invitations,
        message: `Generated ${invitations.length} invitation links`
      });
    } catch (error) {
      console.error('Error generating invitations:', error);
      return c.json({ error: "Failed to generate invitations" }, 500);
    }
  });

  // Lookup Invitation (public)
  app.get("/api/rsvp/invitation/:code", async (c) => {
    try {
      const code = c.req.param("code");
      const db = getDb(c.env);

      // Get invitation with wedding details
      const invitation = await db.select()
        .from(rsvpInvitations)
        .leftJoin(weddings, eq(rsvpInvitations.weddingId, weddings.id))
        .where(eq(rsvpInvitations.invitationCode, code))
        .get();

      if (!invitation) {
        return c.json({ error: "Invitation not found" }, 404);
      }

      // Update viewed status
      await db.update(rsvpInvitations)
        .set({ 
          status: "viewed",
          viewedAt: new Date()
        })
        .where(eq(rsvpInvitations.invitationCode, code));

      // Get wedding events
      const events = await db.select().from(weddingEvents)
        .where(eq(weddingEvents.weddingId, invitation.wedding_id))
        .orderBy(weddingEvents.order)
        .all();

      // Get custom questions
      const questions = await db.select().from(rsvpQuestions)
        .where(eq(rsvpQuestions.weddingId, invitation.wedding_id))
        .orderBy(rsvpQuestions.order)
        .all();

      return c.json({ 
        invitation: invitation.rsvp_invitations,
        wedding: invitation.weddings,
        events,
        questions
      });
    } catch (error) {
      console.error('Error fetching invitation:', error);
      return c.json({ error: "Failed to fetch invitation" }, 500);
    }
  });

  // Submit RSVP
  app.post("/api/rsvp/submit", async (c) => {
    try {
      const body = await c.req.json();
      const db = getDb(c.env);

      // Validate required fields
      if (!body.invitationCode || !body.guestName || !body.guestEmail) {
        return c.json({ error: "Missing required fields: invitationCode, guestName, guestEmail" }, 400);
      }

      // Get invitation details
      const invitation = await db.select()
        .from(rsvpInvitations)
        .where(eq(rsvpInvitations.invitationCode, body.invitationCode))
        .get();

      if (!invitation) {
        return c.json({ error: "Invalid invitation code" }, 404);
      }

      // Check if already responded
      const existingRsvp = await db.select()
        .from(rsvps)
        .where(eq(rsvps.invitationId, invitation.id))
        .get();

      if (existingRsvp) {
        return c.json({ error: "RSVP already submitted for this invitation" }, 400);
      }

      // Create RSVP record
      const rsvp = await db.insert(rsvps).values({
        weddingId: invitation.weddingId,
        invitationId: invitation.id,
        guestName: body.guestName,
        guestEmail: body.guestEmail,
        guestPhone: body.guestPhone,
        attendingCeremony: body.attendingCeremony ?? true,
        attendingReception: body.attendingReception ?? true,
        numberOfGuests: body.numberOfGuests || 1,
        dietaryRestrictions: body.dietaryRestrictions,
        message: body.message,
        createdAt: new Date()
      }).returning().get();

      // Save custom question responses
      if (body.responses && typeof body.responses === 'object') {
        for (const [questionId, answer] of Object.entries(body.responses)) {
          if (answer !== null && answer !== undefined && answer !== '') {
            await db.insert(rsvpResponses).values({
              rsvpId: rsvp.id,
              questionId: parseInt(questionId),
              answer: String(answer)
            });
          }
        }
      }

      // Update invitation status
      await db.update(rsvpInvitations)
        .set({ status: "responded" })
        .where(eq(rsvpInvitations.id, invitation.id));

      return c.json({ 
        success: true, 
        rsvp,
        message: "RSVP submitted successfully!"
      });
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      return c.json({ error: "Failed to submit RSVP" }, 500);
    }
  });

  // RSVP Dashboard (admin only) - Secret Link Version
  app.get("/api/rsvp/manage/secret/:secret_link", async (c) => {
    try {
      const secretLink = c.req.param("secret_link");
      const db = getDb(c.env);

      if (!secretLink) {
        return c.json({ error: "Secret link is required" }, 400);
      }

      // Get wedding details by secret link
      const wedding = await db.select()
        .from(weddings)
        .where(eq(weddings.adminSecretLink, secretLink))
        .get();

      if (!wedding) {
        return c.json({ error: "Invalid secret link" }, 404);
      }

      // Get all invitations for this wedding
      const invitations = await db.select()
        .from(rsvpInvitations)
        .where(eq(rsvpInvitations.weddingId, wedding.id))
        .all();

      // Get all RSVP responses
      const rsvpResponses = await db.select()
        .from(rsvps)
        .where(eq(rsvps.weddingId, wedding.id))
        .all();

      // Calculate statistics
      const totalInvitations = invitations.length;
      const respondedCount = rsvpResponses.length;
      const attendingCount = rsvpResponses.filter((r: any) => r.attendingCeremony || r.attendingReception).length;
      const totalGuests = rsvpResponses.reduce((sum: number, r: any) => sum + (r.numberOfGuests || 1), 0);

      // Generate CSV data
      const csvData = rsvpResponses.map((rsvp: any) => ({
        guestName: rsvp.guestName,
        guestEmail: rsvp.guestEmail,
        attendingCeremony: rsvp.attendingCeremony ? 'Yes' : 'No',
        attendingReception: rsvp.attendingReception ? 'Yes' : 'No',
        numberOfGuests: rsvp.numberOfGuests,
        dietaryRestrictions: rsvp.dietaryRestrictions || '',
        message: rsvp.message || '',
        submittedAt: rsvp.createdAt
      }));

      return c.json({
        wedding,
        statistics: {
          totalInvitations,
          respondedCount,
          pendingCount: totalInvitations - respondedCount,
          attendingCount,
          totalGuests,
          responseRate: totalInvitations > 0 ? Math.round((respondedCount / totalInvitations) * 100) : 0
        },
        invitations,
        rsvpResponses,
        csvData
      });
    } catch (error) {
      console.error('Error fetching RSVP dashboard:', error);
      return c.json({ error: "Failed to fetch RSVP dashboard" }, 500);
    }
  });

  // RSVP Dashboard (admin only) - Original Wedding ID Version (kept for backward compatibility)
  app.get("/api/rsvp/manage/:wedding_id", async (c) => {
    try {
      const weddingId = parseInt(c.req.param("wedding_id"));
      const db = getDb(c.env);

      if (isNaN(weddingId)) {
        return c.json({ error: "Invalid wedding ID" }, 400);
      }

      // Get wedding details
      const wedding = await db.select()
        .from(weddings)
        .where(eq(weddings.id, weddingId))
        .get();

      if (!wedding) {
        return c.json({ error: "Wedding not found" }, 404);
      }

      // Get all invitations for this wedding
      const invitations = await db.select()
        .from(rsvpInvitations)
        .where(eq(rsvpInvitations.weddingId, weddingId))
        .all();

      // Get all RSVP responses
      const rsvpResponses = await db.select()
        .from(rsvps)
        .where(eq(rsvps.weddingId, weddingId))
        .all();

      // Calculate statistics
      const totalInvitations = invitations.length;
      const respondedCount = rsvpResponses.length;
      const attendingCount = rsvpResponses.filter((r: any) => r.attendingCeremony || r.attendingReception).length;
      const totalGuests = rsvpResponses.reduce((sum: number, r: any) => sum + (r.numberOfGuests || 1), 0);

      // Generate CSV data
      const csvData = rsvpResponses.map((rsvp: any) => ({
        guestName: rsvp.guestName,
        guestEmail: rsvp.guestEmail,
        attendingCeremony: rsvp.attendingCeremony ? 'Yes' : 'No',
        attendingReception: rsvp.attendingReception ? 'Yes' : 'No',
        numberOfGuests: rsvp.numberOfGuests,
        dietaryRestrictions: rsvp.dietaryRestrictions || '',
        message: rsvp.message || '',
        submittedAt: rsvp.createdAt
      }));

      return c.json({
        wedding,
        statistics: {
          totalInvitations,
          respondedCount,
          pendingCount: totalInvitations - respondedCount,
          attendingCount,
          totalGuests,
          responseRate: totalInvitations > 0 ? Math.round((respondedCount / totalInvitations) * 100) : 0
        },
        invitations,
        rsvpResponses,
        csvData
      });
    } catch (error) {
      console.error('Error fetching RSVP dashboard:', error);
      return c.json({ error: "Failed to fetch RSVP dashboard" }, 500);
    }
  });

  // Admin RSVP Template CRUD Operations
  app.post("/api/rsvptemplates", authenticateAdmin('templates'), async (c) => {
    try {
      const body = await c.req.json();
      // Ensure config is stored as JSON string
      const templateData = {
        ...body,
        config: typeof body.config === 'object' ? JSON.stringify(body.config) : body.config
      };
      const db = getDb(c.env);
      const template = await db.insert(rsvpTemplates).values(templateData).returning().get();
      // Return with parsed config
      return c.json({
        ...template,
        config: typeof template.config === 'string' ? JSON.parse(template.config) : template.config
      }, 201);
    } catch (error) {
      return c.json({ message: "Failed to create RSVP template", error: error.message }, 500);
    }
  });

  app.get("/api/rsvptemplates", async (c) => {
    try {
      const db = getDb(c.env);
      const templates = await db.select().from(rsvpTemplates).all();
      // Parse config JSON strings
      return c.json(templates.map(template => ({
        ...template,
        config: typeof template.config === 'string' ? JSON.parse(template.config) : template.config
      })));
    } catch (error) {
      return c.json({ message: "Failed to fetch RSVP templates", error: error.message }, 500);
    }
  });

  app.put("/api/rsvptemplates/:id", authenticateAdmin('templates'), async (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      const body = await c.req.json();
      // Ensure config is stored as JSON string
      const templateData = {
        ...body,
        config: typeof body.config === 'object' ? JSON.stringify(body.config) : body.config
      };
      const db = getDb(c.env);
      const template = await db.update(rsvpTemplates).set(templateData).where(eq(rsvpTemplates.id, id)).returning().get();
      
      if (!template) {
        return c.json({ message: "RSVP template not found" }, 404);
      }
      // Return with parsed config
      return c.json({
        ...template,
        config: typeof template.config === 'string' ? JSON.parse(template.config) : template.config
      });
    } catch (error) {
      return c.json({ message: "Failed to update RSVP template", error: error.message }, 500);
    }
  });

  app.delete("/api/rsvptemplates/:id", authenticateAdmin('templates'), async (c) => {
    try {
      const id = parseInt(c.req.param("id"));
      const db = getDb(c.env);
      const result = await db.delete(rsvpTemplates).where(eq(rsvpTemplates.id, id)).returning().get();
      
      if (!result) {
        return c.json({ message: "RSVP template not found" }, 404);
      }
      return c.json({ message: "RSVP template deleted successfully" });
    } catch (error) {
      return c.json({ message: "Failed to delete RSVP template", error: error.message }, 500);
    }
  });

  // Helper function for generating invitation codes
  function generateInvitationCode(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}
