import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vendors = sqliteTable("vendors", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  location: text("location").notNull(),
  address: text("address"),
  website: text("website"),
  instagram: text("instagram"),
  youtube: text("youtube"),
  facebook: text("facebook"),
  profileImage: text("profile_image"),
  coverImage: text("cover_image"),
  gallery: text("gallery"), // SQLite doesn't support arrays, will store as JSON string
  services: text("services"), // SQLite doesn't support arrays, will store as JSON string
  priceRange: text("price_range"),
  featured: integer("featured", { mode: "boolean" }).default(false),
  verified: integer("verified", { mode: "boolean" }).default(false),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vendorId: integer("vendor_id").references(() => vendors.id).notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  images: text("images"), // SQLite doesn't support arrays, will store as JSON string
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  vendorCount: integer("vendor_count").default(0),
});

export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  category: text("category").notNull(),
  tags: text("tags"), // SQLite doesn't support arrays, will store as JSON string
  published: integer("published", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const businessSubmissions = sqliteTable("business_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  location: text("location").notNull(),
  address: text("address"),
  website: text("website"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  services: text("services"), // SQLite doesn't support arrays, will store as JSON string
  priceRange: text("price_range"),
  status: text("status").default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const weddings = sqliteTable("weddings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  brideName: text("bride_name").notNull(),
  groomName: text("groom_name").notNull(),
  weddingDate: integer("wedding_date", { mode: "timestamp" }).notNull(),
  venue: text("venue").notNull(),
  venueAddress: text("venue_address").notNull(),
  ceremonyTime: text("ceremony_time").notNull(),
  receptionTime: text("reception_time"),
  coverImage: text("cover_image"),
  galleryImages: text("gallery_images"), // SQLite doesn't support arrays, will store as JSON string
  story: text("story"),
  slug: text("slug").notNull(),
  rsvpDeadline: integer("rsvp_deadline", { mode: "timestamp" }),
  maxGuests: integer("max_guests").default(100),
  isPublic: integer("is_public", { mode: "boolean" }).default(true),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

export const rsvps = sqliteTable("rsvps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  weddingId: integer("wedding_id").notNull().references(() => weddings.id),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone"),
  attendingCeremony: integer("attending_ceremony", { mode: "boolean" }).default(true),
  attendingReception: integer("attending_reception", { mode: "boolean" }).default(true),
  numberOfGuests: integer("number_of_guests").default(1),
  dietaryRestrictions: text("dietary_restrictions"),
  message: text("message"),
  createdAt: integer("created_at", { mode: "timestamp" }),
});

// Insert schemas
export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  rating: true,
  reviewCount: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  vendorCount: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

export const insertBusinessSubmissionSchema = createInsertSchema(businessSubmissions).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertWeddingSchema = createInsertSchema(weddings).omit({
  id: true,
  createdAt: true,
});

export const insertRsvpSchema = createInsertSchema(rsvps).omit({
  id: true,
  createdAt: true,
});

// Types
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BusinessSubmission = typeof businessSubmissions.$inferSelect;
export type InsertBusinessSubmission = z.infer<typeof insertBusinessSubmissionSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Wedding = typeof weddings.$inferSelect;
export type InsertWedding = z.infer<typeof insertWeddingSchema>;
export type Rsvp = typeof rsvps.$inferSelect;
export type InsertRsvp = z.infer<typeof insertRsvpSchema>;
