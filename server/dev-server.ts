import express, { type Request, Response, NextFunction } from "express";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import { getDb } from "./db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

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
  ]
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
    const db = getDb({});
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
    const db = getDb({});
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
    console.log('Creating wedding with data:', body);
    
    // Convert date strings to Date objects
    const weddingData = {
      ...body,
      weddingDate: new Date(body.weddingDate),
      rsvpDeadline: body.rsvpDeadline ? new Date(body.rsvpDeadline) : null,
      createdAt: new Date(),
    };
    
    const db = getDb({});
    const wedding = await db.insert(schema.weddings).values(weddingData).returning().get();
    console.log('Wedding created successfully:', wedding);
    res.json(wedding);
  } catch (error: any) {
    console.error('Error creating wedding:', error);
    res.status(500).json({ error: "Failed to create wedding", details: error.message || String(error) });
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
