import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import { getDb } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

// Initialize database when server starts
console.log('Initializing database...');
const db = getDb({});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mock database for development
const mockDb = {
  vendors: [
    {
      id: 1,
      name: "Goa Wedding Photography",
      category: "Photography",
      location: "North Goa",
      description: "Professional wedding photography services in Goa",
      rating: 4.8,
      featured: true,
      profileImage: "/assets/hero.jpg",
      gallery: ["/assets/hero.jpg"],
      contact: {
        phone: "+91 9876543210",
        email: "info@goaweddingphoto.com",
        website: "https://goaweddingphoto.com"
      }
    },
    {
      id: 2,
      name: "Beach Wedding Venues",
      category: "Venues",
      location: "South Goa",
      description: "Beautiful beach wedding venues with stunning ocean views",
      rating: 4.9,
      featured: true,
      profileImage: "/assets/hero.jpg",
      gallery: ["/assets/hero.jpg"],
      contact: {
        phone: "+91 9876543211",
        email: "info@beachweddinggoa.com",
        website: "https://beachweddinggoa.com"
      }
    }
  ],
  categories: [
    { id: 1, name: "Photography", slug: "photography" },
    { id: 2, name: "Videography", slug: "videography" },
    { id: 3, name: "Venues", slug: "venues" },
    { id: 4, name: "Caterers", slug: "caterers" },
    { id: 5, name: "Decorators", slug: "decorators" },
    { id: 6, name: "Makeup Artists", slug: "makeup-artists" },
    { id: 7, name: "Bridal Wear", slug: "bridal-wear" },
    { id: 8, name: "Groom Wear", slug: "groom-wear" },
    { id: 9, name: "Jewelry", slug: "jewelry" },
    { id: 10, name: "Music & DJ", slug: "music-dj" },
    { id: 11, name: "Transportation", slug: "transportation" },
    { id: 12, name: "Wedding Planners", slug: "wedding-planners" }
  ],
  blogPosts: [
    {
      id: 1,
      title: "Top 10 Wedding Venues in Goa",
      slug: "top-10-wedding-venues-goa",
      content: "Discover the most beautiful wedding venues in Goa...",
      excerpt: "A comprehensive guide to the best wedding venues in Goa",
      published: true,
      publishedAt: new Date().toISOString(),
      author: "The Goan Wedding Team"
    }
  ],
  rsvpTemplates: [
    {
      id: 1,
      name: "Hindu Wedding RSVP",
      type: "Hindu",
      config: {
        fields: ["name", "email", "attendance", "dietary"],
        customMessage: "We cordially invite you to celebrate our special day"
      }
    },
    {
      id: 2,
      name: "Christian Wedding RSVP",
      type: "Christian",
      config: {
        fields: ["name", "email", "attendance", "plusOne"],
        customMessage: "You are cordially invited to witness our union"
      }
    }
  ]
};

// Add authentication middleware for development
const ADMIN_TOKENS = {
  'admin-2025-goa': 'full-access',
  'vendor-manager': 'vendor-only',
  'content-editor': 'blog-only',
};

const authenticateAdmin = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = (req.headers['x-admin-token'] || '') as string;
    const permissions = ADMIN_TOKENS[token as 'admin-2025-goa' | 'vendor-manager' | 'content-editor'];
    
    if (!permissions) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (
      permissions === 'full-access' ||
      (permissions === 'vendor-only' && action === 'vendors') ||
      (permissions === 'blog-only' && action === 'blog') ||
      (permissions === 'full-access' && (action === 'templates' || action === 'analytics'))
    ) {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  };
};

// API Routes for development
app.get("/api/vendors", (req, res) => {
  const { category, location, search } = req.query;
  let vendors = [...mockDb.vendors];
  
  if (category) {
    vendors = vendors.filter(v => v.category.toLowerCase() === (category as string).toLowerCase());
  }
  if (location) {
    vendors = vendors.filter(v => v.location.toLowerCase().includes((location as string).toLowerCase()));
  }
  if (search) {
    const searchTerm = (search as string).toLowerCase();
    vendors = vendors.filter(v => 
      v.name.toLowerCase().includes(searchTerm) || 
      v.description.toLowerCase().includes(searchTerm)
    );
  }
  
  res.json(vendors);
});

app.get("/api/vendors/featured", (req, res) => {
  const featuredVendors = mockDb.vendors.filter(v => v.featured);
  res.json(featuredVendors);
});

app.get("/api/vendors/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const vendor = mockDb.vendors.find(v => v.id === id);
  
  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  
  res.json(vendor);
});

app.get("/api/categories", (req, res) => {
  res.json(mockDb.categories);
});

app.get("/api/categories/:slug", (req, res) => {
  const slug = req.params.slug;
  const category = mockDb.categories.find(c => c.slug === slug);
  
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  
  res.json(category);
});

app.get("/api/blog", (req, res) => {
  const publishedPosts = mockDb.blogPosts.filter(p => p.published);
  res.json(publishedPosts);
});

app.get("/api/blog/:slug", (req, res) => {
  const slug = req.params.slug;
  const post = mockDb.blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return res.status(404).json({ message: "Blog post not found" });
  }
  
  res.json(post);
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Simple test route
app.get("/test", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test Page</title>
    </head>
    <body>
        <h1>Test Page</h1>
        <p>If you can see this, the server is working correctly.</p>
        <p><a href="/">Go to main app</a></p>
    </body>
    </html>
  `);
});

// Wedding API routes for development
app.get("/api/weddings", async (req, res) => {
  try {
    console.log('Getting weddings from database...');
    const weddingsList = await db.select().from(schema.weddings).all();
    res.json(weddingsList);
  } catch (error: any) {
    console.error('Error fetching weddings:', error);
    res.status(500).json({ error: "Failed to fetch weddings" });
  }
});

app.get("/api/weddings/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    console.log('Getting wedding with slug:', slug);
    const wedding = await db.select().from(schema.weddings).where(eq(schema.weddings.slug, slug)).get();
    
    if (!wedding) {
      return res.status(404).json({ error: "Wedding not found" });
    }
    res.json(wedding);
  } catch (error: any) {
    console.error('Error fetching wedding:', error);
    res.status(500).json({ error: "Failed to fetch wedding" });
  }
});

app.post("/api/weddings", async (req, res) => {
  try {
    const body = req.body;
    console.log('Received wedding creation request with data:', body);
    
    // Validate required fields
    if (!body.brideName || !body.groomName || !body.weddingDate || 
        !body.ceremonyVenue || !body.ceremonyVenueAddress || 
        !body.ceremonyTime || !body.contactEmail) {
      console.error('Missing required fields:', {
        brideName: !!body.brideName,
        groomName: !!body.groomName,
        weddingDate: !!body.weddingDate,
        ceremonyVenue: !!body.ceremonyVenue,
        ceremonyVenueAddress: !!body.ceremonyVenueAddress,
        ceremonyTime: !!body.ceremonyTime,
        contactEmail: !!body.contactEmail
      });
      return res.status(400).json({ 
        error: "Missing required fields",
        details: "brideName, groomName, weddingDate, ceremonyVenue, ceremonyVenueAddress, ceremonyTime, and contactEmail are required"
      });
    }
    
    // Generate a secret link if one wasn't provided
    const adminSecretLink = body.adminSecretLink || generateSecretLink();
    
    // Prepare wedding data
    const weddingData = {
      ...body,
      admin_secret_link: adminSecretLink, // Use the database column name
      weddingDate: new Date(body.weddingDate),
      rsvpDeadline: body.rsvpDeadline ? new Date(body.rsvpDeadline) : null,
      createdAt: new Date(),
      // For backward compatibility, set venue and venueAddress to ceremony venue
      venue: body.ceremonyVenue || body.venue || '',
      venueAddress: body.ceremonyVenueAddress || body.venueAddress || '',
    };
    
    console.log('Processing wedding data:', weddingData);
    
    const wedding = await db.insert(schema.weddings).values(weddingData).returning().get();
    console.log('Wedding created successfully:', wedding);
    
    // Return the wedding data including the secret link
    res.json({
      ...wedding,
      adminSecretLink
    });
  } catch (error: any) {
    console.error('Error creating wedding:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: "Failed to create wedding", 
      details: error.message || String(error),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// RSVP endpoints for weddings
app.get("/api/weddings/:id/rsvps", async (req, res) => {
  try {
    const weddingId = parseInt(req.params.id);
    const rsvps = await db.select().from(schema.rsvps).where(eq(schema.rsvps.weddingId, weddingId)).all();
    res.json(rsvps);
  } catch (error: any) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ error: "Failed to fetch RSVPs" });
  }
});

app.post("/api/weddings/:id/rsvps", async (req, res) => {
  try {
    const weddingId = parseInt(req.params.id);
    const body = req.body;
    
    // Check if wedding exists
    const wedding = await db.select().from(schema.weddings).where(eq(schema.weddings.id, weddingId)).get();
    if (!wedding) {
      return res.status(404).json({ error: "Wedding not found" });
    }
    
    // Create RSVP
    const rsvpData = {
      ...body,
      weddingId,
      createdAt: new Date(),
    };
    
    const rsvp = await db.insert(schema.rsvps).values(rsvpData).returning().get();
    res.json(rsvp);
  } catch (error: any) {
    console.error('Error creating RSVP:', error);
    res.status(500).json({ error: "Failed to create RSVP", details: error.message || String(error) });
  }
});

// RSVP API routes (mimicking Cloudflare Functions)
function generateInvitationCode() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Handle POST /api/rsvp/invitations
app.post("/api/rsvp/invitations", async (req, res) => {
  try {
    const body = req.body;
    
    // Validate input
    if (!Array.isArray(body) || body.length === 0) {
      return res.status(400).json({ error: "Invalid guest list" });
    }

    const invitations = [];
    
    for (const guest of body) {
      // Validate required fields
      if (!guest.wedding_id || !guest.guest_name || !guest.guest_email) {
        return res.status(400).json({ error: "Missing required fields: wedding_id, guest_name, guest_email" });
      }

      // Generate unique invitation code
      const invitationCode = generateInvitationCode();
      
      const invitation = await db.insert(schema.rsvpInvitations).values({
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
        rsvpLink: `${req.protocol}://${req.get('host')}/rsvp/${invitationCode}`
      });
    }

    return res.json({ 
      success: true, 
      invitations,
      message: `Generated ${invitations.length} invitation links`
    });
  } catch (error) {
    console.error('Error in RSVP invitations endpoint:', error);
    return res.status(500).json({ error: "Failed to process RSVP invitations request" });
  }
});

// Handle POST /api/rsvp/submit
app.post("/api/rsvp/submit", async (req, res) => {
  try {
    const body = req.body;
    
    // Validate required fields
    if (!body.invitationCode || !body.guestName || !body.guestEmail) {
      return res.status(400).json({ error: "Missing required fields: invitationCode, guestName, guestEmail" });
    }

    // Get invitation details
    const invitation = await db.select()
      .from(schema.rsvpInvitations)
      .where(eq(schema.rsvpInvitations.invitationCode, body.invitationCode))
      .get();

    if (!invitation) {
      return res.status(404).json({ error: "Invalid invitation code" });
    }

    // Check if already responded
    const existingRsvp = await db.select()
      .from(schema.rsvps)
      .where(eq(schema.rsvps.invitationId, invitation.id))
      .get();

    if (existingRsvp) {
      return res.status(400).json({ error: "RSVP already submitted for this invitation" });
    }

    // Create RSVP record
    const rsvp = await db.insert(schema.rsvps).values({
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
          await db.insert(schema.rsvpResponses).values({
            rsvpId: rsvp.id,
            questionId: parseInt(questionId),
            answer: String(answer)
          });
        }
      }
    }

    // Update invitation status
    await db.update(schema.rsvpInvitations)
      .set({ status: "responded" })
      .where(eq(schema.rsvpInvitations.id, invitation.id));

    return res.json({ 
      success: true, 
      rsvp,
      message: "RSVP submitted successfully!"
    });
  } catch (error) {
    console.error('Error in RSVP submit endpoint:', error);
    return res.status(500).json({ error: "Failed to process RSVP submission" });
  }
});

// Handle GET /api/rsvp/invitation/:code
app.get("/api/rsvp/invitation/:code", async (req, res) => {
  try {
    const code = req.params.code;
    
    // Get invitation with wedding details
    const invitationResult = await db.select()
      .from(schema.rsvpInvitations)
      .leftJoin(schema.weddings, eq(schema.rsvpInvitations.weddingId, schema.weddings.id))
      .where(eq(schema.rsvpInvitations.invitationCode, code))
      .get();

    if (!invitationResult) {
      return res.status(404).json({ error: "Invitation not found" });
    }

    // Extract invitation and wedding data
    const invitation = invitationResult.rsvp_invitations;
    const wedding = invitationResult.weddings;

    // Update viewed status
    await db.update(schema.rsvpInvitations)
      .set({ 
        status: "viewed",
        viewedAt: new Date()
      })
      .where(eq(schema.rsvpInvitations.invitationCode, code));

    // Get wedding events
    const events = await db.select().from(schema.weddingEvents)
      .where(eq(schema.weddingEvents.weddingId, invitation.weddingId))
      .orderBy(schema.weddingEvents.order)
      .all();

    // Get custom questions
    const questions = await db.select().from(schema.rsvpQuestions)
      .where(eq(schema.rsvpQuestions.weddingId, invitation.weddingId))
      .orderBy(schema.rsvpQuestions.order)
      .all();

    return res.json({ 
      invitation,
      wedding,
      events,
      questions
    });
  } catch (error) {
    console.error('Error fetching RSVP data:', error);
    return res.status(500).json({ error: "Failed to fetch RSVP data" });
  }
});

// Admin Vendor CRUD Operations (Development)
app.post("/api/vendors", authenticateAdmin('vendors'), (req, res) => {
  const newVendor = {
    id: mockDb.vendors.length + 1,
    ...req.body
  };
  mockDb.vendors.push(newVendor);
  res.status(201).json(newVendor);
});

app.put("/api/vendors/:id", authenticateAdmin('vendors'), (req, res) => {
  const id = parseInt(req.params.id);
  const vendorIndex = mockDb.vendors.findIndex(v => v.id === id);
  
  if (vendorIndex === -1) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  
  mockDb.vendors[vendorIndex] = {
    ...mockDb.vendors[vendorIndex],
    ...req.body
  };
  
  res.json(mockDb.vendors[vendorIndex]);
});

app.delete("/api/vendors/:id", authenticateAdmin('vendors'), (req, res) => {
  const id = parseInt(req.params.id);
  const vendorIndex = mockDb.vendors.findIndex(v => v.id === id);
  
  if (vendorIndex === -1) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  
  mockDb.vendors.splice(vendorIndex, 1);
  res.json({ message: "Vendor deleted successfully" });
});

// Admin Blog Post CRUD Operations (Development)
app.post("/api/blog", authenticateAdmin('blog'), (req, res) => {
  const newPost = {
    id: mockDb.blogPosts.length + 1,
    ...req.body
  };
  mockDb.blogPosts.push(newPost);
  res.status(201).json(newPost);
});

app.put("/api/blog/:id", authenticateAdmin('blog'), (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = mockDb.blogPosts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({ message: "Blog post not found" });
  }
  
  mockDb.blogPosts[postIndex] = {
    ...mockDb.blogPosts[postIndex],
    ...req.body
  };
  
  res.json(mockDb.blogPosts[postIndex]);
});

app.delete("/api/blog/:id", authenticateAdmin('blog'), (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = mockDb.blogPosts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({ message: "Blog post not found" });
  }
  
  mockDb.blogPosts.splice(postIndex, 1);
  res.json({ message: "Blog post deleted successfully" });
});

// RSVP Templates CRUD Operations (Development)
app.get("/api/rsvptemplates", (req, res) => {
  res.json(mockDb.rsvpTemplates);
});

app.post("/api/rsvptemplates", authenticateAdmin('templates'), (req, res) => {
  const newTemplate = {
    id: mockDb.rsvpTemplates.length + 1,
    ...req.body
  };
  mockDb.rsvpTemplates.push(newTemplate);
  res.status(201).json(newTemplate);
});

app.put("/api/rsvptemplates/:id", authenticateAdmin('templates'), (req, res) => {
  const id = parseInt(req.params.id);
  const templateIndex = mockDb.rsvpTemplates.findIndex(t => t.id === id);
  
  if (templateIndex === -1) {
    return res.status(404).json({ message: "RSVP template not found" });
  }
  
  mockDb.rsvpTemplates[templateIndex] = {
    ...mockDb.rsvpTemplates[templateIndex],
    ...req.body
  };
  
  res.json(mockDb.rsvpTemplates[templateIndex]);
});

app.delete("/api/rsvptemplates/:id", authenticateAdmin('templates'), (req, res) => {
  const id = parseInt(req.params.id);
  const templateIndex = mockDb.rsvpTemplates.findIndex(t => t.id === id);
  
  if (templateIndex === -1) {
    return res.status(404).json({ message: "RSVP template not found" });
  }
  
  mockDb.rsvpTemplates.splice(templateIndex, 1);
  res.json({ message: "RSVP template deleted successfully" });
});

// Add the secret link route for RSVP dashboard
app.get("/api/rsvp/manage/secret/:secret_link", async (req, res) => {
  console.log('Secret link route hit with param:', req.params.secret_link);
  try {
    const secretLink = req.params.secret_link;

    if (!secretLink) {
      console.log('No secret link provided');
      return res.status(400).json({ error: "Secret link is required" });
    }

    // Get wedding details by secret link
    const wedding = await db.select()
      .from(schema.weddings)
      .where(eq(schema.weddings.adminSecretLink, secretLink))
      .get();

    if (!wedding) {
      console.log('No wedding found for secret link:', secretLink);
      return res.status(404).json({ error: "Invalid secret link" });
    }

    console.log('Found wedding for secret link:', wedding.id);

    // Get all invitations for this wedding
    const invitations = await db.select()
      .from(schema.rsvpInvitations)
      .where(eq(schema.rsvpInvitations.weddingId, wedding.id))
      .all();

    // Get all RSVP responses
    const rsvpResponses = await db.select()
      .from(schema.rsvps)
      .where(eq(schema.rsvps.weddingId, wedding.id))
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

    return res.json({
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
  } catch (error: any) {
    console.error('Error fetching RSVP dashboard:', error);
    return res.status(500).json({ error: "Failed to fetch RSVP dashboard" });
  }
});

// Keep the original wedding ID route for backward compatibility
app.get("/api/rsvp/manage/:wedding_id", async (req, res) => {
  console.log('Wedding ID route hit with param:', req.params.wedding_id);
  try {
    const weddingId = parseInt(req.params.wedding_id);

    if (isNaN(weddingId)) {
      console.log('Invalid wedding ID provided');
      return res.status(400).json({ error: "Invalid wedding ID" });
    }

    // Get wedding details
    const wedding = await db.select()
      .from(schema.weddings)
      .where(eq(schema.weddings.id, weddingId))
      .get();

    if (!wedding) {
      console.log('No wedding found for ID:', weddingId);
      return res.status(404).json({ error: "Wedding not found" });
    }

    console.log('Found wedding for ID:', wedding.id);

    // Get all invitations for this wedding
    const invitations = await db.select()
      .from(schema.rsvpInvitations)
      .where(eq(schema.rsvpInvitations.weddingId, weddingId))
      .all();

    // Get all RSVP responses
    const rsvpResponses = await db.select()
      .from(schema.rsvps)
      .where(eq(schema.rsvps.weddingId, weddingId))
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

    return res.json({
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
  } catch (error: any) {
    console.error('Error fetching RSVP dashboard:', error);
    return res.status(500).json({ error: "Failed to fetch RSVP dashboard" });
  }
});

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(status).json({ message });
  log(`Error: ${message}`, "error");
});

// Setup Vite in development
const server = createServer(app);

(async () => {
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  
  const port = 8787;
  const listenOptions: any = {
    port,
    host: "0.0.0.0",
  };
  
  // reusePort is not supported on Windows
  if (process.platform !== "win32") {
    listenOptions.reusePort = true;
  }
  
  server.listen(listenOptions, () => {
    log(`🚀 Development server running on http://localhost:${port}`);
    log(`📱 PWA features enabled`);
    log(`🔧 Hot reload active`);
  });
})();

// Helper function to generate a secret link
function generateSecretLink() {
  return 'admin_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}
