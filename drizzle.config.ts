import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "your-account-id",
    databaseId: "eb586981-d322-4e17-a982-6397604e3fc4",
    token: process.env.CLOUDFLARE_API_TOKEN || "your-api-token",
  },
});
