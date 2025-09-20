import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { createServer } from "http";
import { serveStatic } from "./vite";
import { setupVite } from "./vite";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";
import { log } from "console";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Mock database for development
const mockDb = {
  vendors: [
    {
      id: 1,
      name: "Goa Photography Studio",
      category: "photographers",
      description: "Professional wedding photography capturing Goa's natural beauty",
      phone: "+91 98765 43210",
      email: "info@goaphotostudio.com",
      whatsapp: "+91 98765 43210",
      location: "North Goa",
      address: "123 Beach Road, Calangute, Goa",
      website: "https://goaphotostudio.com",
      instagram: "@goaphotostudio",
      youtube: "GoaPhotographyStudio",
      facebook: "GoaPhotographyStudio",
      profileImage: "/images/vendor1.jpg",
      coverImage: "/images/vendor1-cover.jpg",
      gallery: JSON.stringify(["/images/gallery1.jpg", "/images/gallery2.jpg"]),
      services: JSON.stringify(["Wedding Photography", "Pre-Wedding Shoot", "Candid Photography"]),
      priceRange: "₹50,000 - ₹1,50,000",
      featured: 1,
      verified: 1,
      rating: 4.8,
      reviewCount: 42,
      createdAt: Date.now(),
    },
    {
      id: 2,
      name: "Grand Hyatt Goa",
      category: "venues",
      description: "Luxury beachfront venue with stunning views and world-class amenities",
      phone: "+91 832 123 4567",
      email: "weddings@grandhyattgoa.com",
      whatsapp: "+91 832 123 4567",
      location: "North Goa",
      address: "Grand Hyatt Goa, Baga, Goa 403516",
      website: "https://goa.grand.hyatt.com",
      instagram: "@grandhyattgoa",
      youtube: "GrandHyattGoa",
      facebook: "GrandHyattGoa",
      profileImage: "/images/vendor2.jpg",
      coverImage: "/images/vendor2-cover.jpg",
      gallery: JSON.stringify(["/images/gallery3.jpg", "/images/gallery4.jpg"]),
      services: JSON.stringify(["Beach Weddings", "Indoor Venues", "Catering", "Accommodation"]),
      priceRange: "₹15,00,000 - ₹30,00,000",
      featured: 1,
      verified: 1,
      rating: 4.9,
      reviewCount: 128,
      createdAt: Date.now(),
    },
  ],
  blogPosts: [
    {
      id: 1,
      title: "Top 10 Wedding Venues in Goa",
      slug: "top-10-wedding-venues-in-goa",
      excerpt: "Discover the most beautiful and popular wedding venues across Goa",
      content: "Goa offers some of the most stunning wedding venues in India...",
      featuredImage: "/images/blog1.jpg",
      category: "venues",
      tags: JSON.stringify(["Goa", "wedding venues", "beach weddings"]),
      published: 1,
      createdAt: Date.now(),
    },
    {
      id: 2,
      title: "Goan Wedding Traditions You Should Know",
      slug: "goan-wedding-traditions",
      excerpt: "Explore the rich cultural traditions of Goan weddings",
      content: "Goan weddings are a beautiful blend of Portuguese and Indian traditions...",
      featuredImage: "/images/blog2.jpg",
      category: "traditions",
      tags: JSON.stringify(["Goan culture", "wedding traditions", "Portuguese influence"]),
      published: 1,
      createdAt: Date.now(),
    },
  ],
  categories: [
    {
      id: 1,
      name: "Photographers",
      slug: "photographers",
      description: "Capture your special moments with professional photographers",
      icon: "fas fa-camera",
      color: "#ec4899",
      vendorCount: 45,
    },
    {
      id: 2,
      name: "Venues",
      slug: "venues",
      description: "Beautiful locations for your dream wedding",
      icon: "fas fa-umbrella-beach",
      color: "#8b5cf6",
      vendorCount: 32,
    },
    {
      id: 3,
      name: "Caterers",
      slug: "caterers",
      description: "Delicious cuisine for your wedding celebration",
      icon: "fas fa-utensils",
      color: "#10b981",
      vendorCount: 28,
    },
  ],
  weddings: [
    {
      id: 1,
      brideName: "Priya",
      groomName: "Rohan",
      weddingDate: new Date("2024-12-15").getTime(),
      venue: "Taj Exotica Resort",
      venueAddress: "Taj Exotica Resort, Benaulim, Goa",
      ceremonyTime: "16:00",
      receptionTime: "19:00",
      coverImage: "/images/wedding1.jpg",
      galleryImages: JSON.stringify(["/images/wedding1-1.jpg", "/images/wedding1-2.jpg"]),
      story: "Priya and Rohan's love story began in college...",
      slug: "priya-rohan-2024",
      maxGuests: 150,
      isPublic: 1,
      contactEmail: "priya.rohan.wedding@gmail.com",
      contactPhone: "+91 98765 43210",
      createdAt: Date.now(),
      ceremonyVenue: "Taj Exotica Resort",
      ceremonyVenueAddress: "Taj Exotica Resort, Benaulim, Goa",
      receptionVenue: "Taj Exotica Resort",
      receptionVenueAddress: "Taj Exotica Resort, Benaulim, Goa",
      adminSecretLink: "admin_secret_2024",
    },
  ],
};

// Simple admin authentication middleware for development
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.header('x-admin-token') || '';
  const validTokens = ['admin-2025-goa', 'vendor-manager', 'content-editor'];
  
  if (!validTokens.includes(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  next();
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Vendors API
app.get("/api/vendors", (_req, res) => {
  res.json(mockDb.vendors);
});

app.get("/api/vendors/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const vendor = mockDb.vendors.find(v => v.id === id);
  
  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  
  res.json(vendor);
});

app.get("/api/vendors/category/:category", (req, res) => {
  const category = req.params.category;
  const vendorsInCategory = mockDb.vendors.filter(v => v.category === category);
  res.json(vendorsInCategory);
});

app.post("/api/vendors", authenticateAdmin, (req, res) => {
  const newVendor = {
    id: mockDb.vendors.length + 1,
    ...req.body
  };
  mockDb.vendors.push(newVendor);
  res.status(201).json(newVendor);
});

app.put("/api/vendors/:id", authenticateAdmin, (req, res) => {
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

app.delete("/api/vendors/:id", authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const vendorIndex = mockDb.vendors.findIndex(v => v.id === id);
  
  if (vendorIndex === -1) {
    return res.status(404).json({ message: "Vendor not found" });
  }
  
  mockDb.vendors.splice(vendorIndex, 1);
  res.json({ message: "Vendor deleted successfully" });
});

// Reviews API
app.get("/api/reviews/vendor/:vendorId", (_req, res) => {
  // In a real implementation, this would fetch from a reviews table
  res.json([]);
});

app.post("/api/reviews", (_req, res) => {
  // In a real implementation, this would insert into a reviews table
  res.status(201).json({ message: "Review submitted successfully" });
});

// Categories API
app.get("/api/categories", (_req, res) => {
  res.json(mockDb.categories);
});

// Blog API
app.get("/api/blog", (_req, res) => {
  res.json(mockDb.blogPosts);
});

app.get("/api/blog/:slug", (req, res) => {
  const slug = req.params.slug;
  const post = mockDb.blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return res.status(404).json({ message: "Blog post not found" });
  }
  
  res.json(post);
});

app.post("/api/blog", authenticateAdmin, (req, res) => {
  const newPost = {
    id: mockDb.blogPosts.length + 1,
    ...req.body
  };
  mockDb.blogPosts.push(newPost);
  res.status(201).json(newPost);
});

app.put("/api/blog/:id", authenticateAdmin, (req, res) => {
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

app.delete("/api/blog/:id", authenticateAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = mockDb.blogPosts.findIndex(p => p.id === id);
  
  if (postIndex === -1) {
    return res.status(404).json({ message: "Blog post not found" });
  }
  
  mockDb.blogPosts.splice(postIndex, 1);
  res.json({ message: "Blog post deleted successfully" });
});

// Business Submissions API
app.post("/api/business-submissions", (_req, res) => {
  // In a real implementation, this would insert into a business_submissions table
  res.status(201).json({ message: "Business submission received successfully" });
});

// Contact API
app.post("/api/contact", (_req, res) => {
  // In a real implementation, this would insert into a contacts table
  res.status(201).json({ message: "Contact form submitted successfully" });
});

// Weddings API
app.get("/api/weddings/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;
    const db = getDb({ DB: undefined });
    
    // Get wedding with events
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

app.post("/api/weddings", authenticateAdmin, async (req, res) => {
  try {
    const body = req.body;
    const db = getDb({ DB: undefined });
    
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
    
    const wedding = await db.insert(schema.weddings).values(weddingData).returning().get();
    console.log('Wedding created successfully:', wedding);
    
    // Return the wedding data including the secret link
    res.status(201).json({
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