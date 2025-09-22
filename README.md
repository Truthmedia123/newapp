# 🏖️ TheGoanWedding - Premier Wedding Vendor Directory

A beautiful, modern wedding vendor directory platform specifically designed for Goan weddings, featuring a comprehensive vendor management system and beautiful UI components.

## 🌟 Features

### 🎯 Core Platform
- **Vendor Directory**: 500+ trusted wedding professionals across Goa
- **Category-based Search**: Photographers, Venues, Caterers, Decorators, etc.
- **Location Filtering**: North Goa & South Goa regions
- **Advanced Search**: Price range, ratings, and multi-select filters
- **Vendor Profiles**: Detailed profiles with photos, reviews, and contact info
- **Social Media Integration**: Facebook, Instagram, LinkedIn, Twitter links
- **Embedded Content**: Instagram posts, YouTube videos, and more

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach
- **Goan Wedding Theme**: Pink, purple, and emerald color scheme
- **PWA Support**: Install as mobile app
- **Performance Optimized**: Fast loading and smooth interactions
- **SEO Optimized**: Meta tags, structured data, sitemaps
- **Accessibility**: WCAG 2.1 AA compliant
- **Dark Mode**: Automatic theme switching

### 🔧 Admin Features
- **CMS Integration**: Netlify CMS for content management
- **Vendor Management**: Import/export vendor data with social media fields
- **Analytics Dashboard**: Performance metrics and user insights
- **Security Features**: Anti-copy protection, security headers
- **Bulk Import**: CSV import with template support
- **Rate Limiting**: API protection against abuse
- **Caching**: Improved performance with intelligent caching

### 📱 User Engagement
- **Wishlist**: Save favorite vendors
- **Recently Viewed**: Quick access to recently viewed vendors
- **Vendor Comparison**: Compare multiple vendors side-by-side
- **Social Sharing**: Share vendors on social media
- **Newsletter Signup**: Stay updated with wedding tips
- **Reviews & Ratings**: Customer feedback system

### 💰 Monetization
- **Google AdSense**: Responsive ad placement
- **Sponsored Listings**: Premium vendor placement
- **Affiliate Links**: Revenue sharing opportunities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd weddingreplit
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your configuration
DATABASE_URL=your_database_url
SITE_URL=http://localhost:8787
NODE_ENV=development
```

4. **Run the development server**
```bash
# Option 1: Cloudflare Pages Dev (Recommended)
npm run pages:dev

# Option 2: Express Dev Server
npm run dev
```

5. **Open your browser**
```
http://127.0.0.1:8787
```

## 📁 Project Structure

```
weddingreplit/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── PWA/        # Progressive Web App features
│   │   │   ├── admin/      # Admin dashboard components
│   │   │   ├── ads/        # AdSense components
│   │   │   ├── blog/       # Blog components
│   │   │   ├── communication/ # Chat system
│   │   │   ├── couples/    # Couple tools
│   │   │   ├── cultural/   # Cultural content
│   │   │   ├── engagement/ # User engagement features
│   │   │   ├── layout/     # Layout components
│   │   │   ├── performance/ # Performance monitoring
│   │   │   ├── protection/ # Content protection
│   │   │   ├── search/     # Search components
│   │   │   ├── seo/        # SEO components
│   │   │   ├── ui/         # Base UI components
│   │   │   └── vendor/     # Vendor components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main app component
│   └── public/             # Static assets
├── server/                 # Backend server
│   ├── worker.ts           # Cloudflare Worker
│   ├── routes.ts           # API routes
│   ├── middleware/         # Rate limiting and caching
│   └── dev-server.ts       # Express dev server
├── functions/              # Cloudflare Pages Functions
│   └── api/                # API endpoints
├── shared/                 # Shared schemas and types
├── migrations/             # Database migrations
├── scripts/                # Utility scripts
└── public/                 # Static files for Pages
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev              # Start Express dev server (port 3001)
npm run pages:dev        # Start Cloudflare Pages dev server (port 8787)
npm run build            # Build for development
npm run build:production # Build for production
```

### Database
```bash
npm run db:push          # Push schema changes to database
npm run db:seed          # Seed database with initial data
npm run db:migrate       # Run database migrations
```

### Testing
```bash
npm test                 # Run test suite
npm test -- --coverage   # Run tests with coverage report
npm run test:watch       # Run tests in watch mode
```

### Deployment
```bash
npm run deploy:staging   # Deploy to staging environment
npm run deploy:production # Deploy to production
```

### Utilities
```bash
npm run import:vendors   # Import vendor data from CSV
npm run optimize:images  # Optimize and compress images
npm run audit            # Run accessibility and performance audits
```

## 🏖️ Goan Wedding Features

### Traditional Elements
- **Venue Suggestions**: Grand Hyatt, Taj Exotica, Marriott, etc.
- **Traditional Timing**: 4:00 PM ceremony, 7:00 PM reception

### Guest Experience
- **Transportation**: Assistance for out-of-town guests
- **Accommodation**: Help with hotel bookings
- **Children**: Special considerations for families with children

## 🎨 Customization

### Colors & Theme
The platform uses a Goan wedding color scheme:
- **Primary**: Pink (#ec4899)
- **Secondary**: Purple (#8b5cf6) 
- **Accent**: Emerald (#10b981)
- **Background**: Gradient from pink to purple

### Adding New Vendors
1. Use the admin dashboard: `/admin/dashboard?token=admin-secret-2024`
2. Import CSV file with vendor data (including social media fields)
3. Or use Netlify CMS for content management

## 🔧 Configuration

### Environment Variables
```bash
DATABASE_URL=your_cloudflare_d1_database_url
SITE_URL=https://thegoanwedding.com
NODE_ENV=production
CF_API_TOKEN=your_cloudflare_api_token
GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx # For AdSense integration
```

### Cloudflare Setup
1. Create a Cloudflare account
2. Set up D1 database
3. Configure Pages project
4. Add environment variables
5. Deploy using `npm run deploy:production`

### Netlify CMS
1. Access CMS at `/admin`
2. Configure collections in `public/admin/config.yml`
3. Set up Git-based workflow for content management

## 📱 PWA Features

### Installation
- **Mobile**: Add to home screen from browser
- **Desktop**: Install prompt in supported browsers
- **Offline**: Basic functionality when offline

### Service Worker
- Caches static assets
- Provides offline fallbacks
- Updates automatically

## 🔒 Security Features

### Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Content-Security-Policy: Strict policies

### Protection
- Anti-copy protection
- Right-click disabled on sensitive content
- Developer tools shortcuts disabled
- Rate limiting on API endpoints
- Cache control for sensitive data

## 📊 Analytics & Monitoring

### Performance
- Google Analytics integration
- Core Web Vitals monitoring
- Page load time tracking
- User engagement metrics

### Testing
- Unit tests with Jest and React Testing Library
- Integration tests for API endpoints
- Accessibility audits with axe-core
- Performance audits with Lighthouse

### CI/CD
- GitHub Actions for automated testing
- Code coverage reporting
- Security scanning with Snyk
- Automated deployments to staging and production

## 🧪 Testing

The platform includes comprehensive testing:

### Unit Tests
- Component testing with React Testing Library
- API endpoint testing with Jest
- Database query testing

### Integration Tests
- End-to-end workflow testing
- API integration testing
- Database integration testing

### Accessibility Testing
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support

### Performance Testing
- Page load time monitoring
- Core Web Vitals tracking
- Mobile performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React, TypeScript, and Cloudflare Workers
- UI components powered by Tailwind CSS and Radix UI
- Data management with Drizzle ORM
- Testing with Jest and React Testing Library
- CI/CD with GitHub Actions