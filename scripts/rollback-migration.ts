#!/usr/bin/env tsx
import { exec } from 'child_process';
import { promisify } from 'util';
import { rename, writeFile } from 'fs/promises';
import { join } from 'path';

const execPromise = promisify(exec);

async function rollbackMigration() {
  try {
    console.log("🔄 Starting rollback process...");
    
    // 1. Switch USE_DIRECTUS back to false
    console.log("\n1. Switching USE_DIRECTUS back to false...");
    
    // Update wrangler.toml
    const wranglerContent = `
# Configuration for Cloudflare Pages (frontend)
name = "weddingreplit"
pages_build_output_dir = "dist/public"
compatibility_date = "2025-09-03"

[[d1_databases]]
binding = "DB"
database_name = "wedding_platform_db"
database_id = "eb586981-d322-4e17-a982-6397604e3fc4"

[vars]
NODE_ENV = "production"
SITE_URL = "https://weddingreplit.pages.dev"
USE_DIRECTUS = "false"

# Preview environment for Pages
[env.preview]
name = "weddingreplit-preview"

# Production environment for Pages
[env.production]
name = "weddingreplit"

[[env.production.d1_databases]]
binding = "DB"
database_name = "wedding_platform_db"
database_id = "eb586981-d322-4e17-a982-6397604e3fc4"

[env.production.vars]
NODE_ENV = "production"
SITE_URL = "https://weddingreplit.pages.dev"
USE_DIRECTUS = "false"
`;
    
    await writeFile(join(process.cwd(), 'wrangler.toml'), wranglerContent);
    console.log("✅ Updated wrangler.toml to use D1");
    
    // 2. Restore admin folder from backup
    console.log("\n2. Restoring admin folder from backup...");
    try {
      await rename(
        join(process.cwd(), 'client', 'public', 'admin-backup'),
        join(process.cwd(), 'client', 'public', 'admin')
      );
      console.log("✅ Restored admin folder from backup");
    } catch (error) {
      console.warn("⚠️  Could not restore admin folder:", error);
    }
    
    // 3. Revert redirects
    console.log("\n3. Reverting redirects...");
    const redirectsContent = `
# Netlify Identity routes - must come BEFORE the SPA fallback
/.netlify/identity/*  /.netlify/identity/:splat  200
/admin/*              /admin/index.html          200
/*                    /index.html                200
`;
    
    await writeFile(join(process.cwd(), 'client', 'public', '_redirects'), redirectsContent);
    console.log("✅ Reverted redirects to Netlify CMS");
    
    // 4. Restore Netlify Identity scripts
    console.log("\n4. Restoring Netlify Identity scripts...");
    const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="GoanWedding">
    <meta name="theme-color" content="#dc2626" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#b91c1c" media="(prefers-color-scheme: dark)">
    
    <title>TheGoanWedding.com - Premium Wedding Vendor Directory | Celebrate Your Big Day, Goan Style</title>
    <meta name="description" content="Discover the finest wedding vendors in Goa. From photographers to caterers, venues to decorators - find everything for your perfect Goan wedding celebration." />
    <meta name="keywords" content="goan wedding, wedding vendors goa, wedding photographers goa, wedding venues goa, destination wedding goa, goa wedding planner, goan wedding traditions" />
    
    <!-- Enhanced SEO Meta Tags -->
    <meta name="author" content="TheGoanWedding.com">
    <meta name="robots" content="index, follow">
    <meta name="googlebot" content="index, follow">
    
    <!-- Open Graph tags for social sharing -->
    <meta property="og:title" content="TheGoanWedding.com - Premium Wedding Vendor Directory">
    <meta property="og:description" content="Discover the finest wedding vendors in Goa. From photographers to caterers, venues to decorators - find everything for your perfect Goan wedding celebration.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://thegoanwedding.com">
    <meta property="og:image" content="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630">
    <meta property="og:image:alt" content="Beautiful Goan beach wedding ceremony">
    <meta property="og:locale" content="en_IN">
    <meta property="og:site_name" content="TheGoanWedding.com">
    
    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="TheGoanWedding.com - Premium Wedding Vendor Directory">
    <meta name="twitter:description" content="Discover the finest wedding vendors in Goa. From photographers to caterers, venues to decorators - find everything for your perfect Goan wedding celebration.">
    <meta name="twitter:image" content="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630">
    <meta name="twitter:image:alt" content="Beautiful Goan beach wedding ceremony">
    
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://images.unsplash.com">
    
    <!-- Google Fonts for wedding styles -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Dancing+Script:wght@400;500;600;700&family=Great+Vibes&family=Crimson+Text:wght@400;600&display=swap" rel="stylesheet">
    
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Favicon and PWA Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
    <link rel="manifest" href="/manifest.json">
    
    <!-- Netlify Identity Widget -->
    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <!-- Instagram embed JS -->
    <script async defer src="//www.instagram.com/embed.js"></script>
    <!-- Facebook SDK -->
    <div id="fb-root"></div>
    <script async defer crossorigin="anonymous"
      src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0">
    </script>
    
    <!-- Netlify Identity Widget Script -->
    <script>
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on('init', user => {
          if (!user) {
            // Check if this is an invite or recovery link
            if (window.location.hash.includes('invite_token') || 
                window.location.hash.includes('recovery_token')) {
              window.netlifyIdentity.open();
            }
          }
        });
        
        window.netlifyIdentity.on('login', user => {
          // Redirect to admin after login
          window.location.href = '/admin/';
        });
      }
    </script>
    
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    
    await writeFile(join(process.cwd(), 'client', 'index.html'), indexHtmlContent);
    console.log("✅ Restored Netlify Identity scripts");
    
    // 5. Remove the new admin.html file
    console.log("\n5. Removing new admin.html file...");
    try {
      await execPromise('rm client/public/admin.html');
      console.log("✅ Removed admin.html file");
    } catch (error) {
      console.warn("⚠️  Could not remove admin.html file:", error);
    }
    
    // 6. Deploy the rollback
    console.log("\n6. Deploying rollback...");
    const { stdout: deployOutput, stderr: deployError } = await execPromise('npm run deploy:pages');
    console.log(deployOutput);
    if (deployError) {
      console.error('Deployment error:', deployError);
    }
    
    console.log("\n🔄 Rollback completed successfully!");
    console.log("\n📋 Summary:");
    console.log("   - USE_DIRECTUS switched back to false");
    console.log("   - Admin folder restored from backup");
    console.log("   - Redirects reverted to Netlify CMS");
    console.log("   - Netlify Identity scripts restored");
    console.log("   - New admin.html file removed");
    console.log("   - Rollback deployed to production");
    
  } catch (error) {
    console.error('❌ Error during rollback:', error);
    process.exit(1);
  }
}

// Run the rollback
rollbackMigration();