# 🏖️ The Goan Wedding - Premier Wedding Vendor Directory

A beautiful, modern wedding vendor directory platform specifically designed for Goan weddings, featuring a comprehensive RSVP system, vendor management, and beautiful UI components.

## 🌟 Features

### 🎯 Core Platform
- **Vendor Directory**: 500+ trusted wedding professionals across Goa
- **Category-based Search**: Photographers, Venues, Caterers, Decorators, etc.
- **Location Filtering**: North Goa & South Goa regions
- **Advanced Search**: Price range, ratings, and multi-select filters
- **Vendor Profiles**: Detailed profiles with photos, reviews, and contact info

### 💒 RSVP System
- **Single-Page RSVP Generator**: Create beautiful Goan wedding RSVPs instantly
- **Instant Link & QR Code Generation**: Share with guests immediately
- **Goan Wedding Features**: Traditional ceremony & reception, dietary considerations
- **Guest Management**: Track responses, export to CSV, WhatsApp sharing
- **Couple Dashboard**: Real-time statistics and guest management
- **Beautiful Guest Forms**: Mobile-responsive with Goan wedding themes

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach
- **Goan Wedding Theme**: Pink, purple, and emerald color scheme
- **PWA Support**: Install as mobile app
- **Performance Optimized**: Fast loading and smooth interactions
- **SEO Optimized**: Meta tags, structured data, sitemaps

### 🔧 Admin Features
- **CMS Integration**: Netlify CMS for content management
- **Vendor Management**: Import/export vendor data
- **Analytics Dashboard**: Performance metrics and user insights
- **Security Features**: Anti-copy protection, security headers

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
│   │   │   ├── RSVP/       # RSVP system components
│   │   │   ├── PWA/        # Progressive Web App features
│   │   │   └── ui/         # Base UI components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main app component
│   └── public/             # Static assets
├── server/                 # Backend server
│   ├── worker.ts           # Cloudflare Worker
│   ├── routes.ts           # API routes
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

### Deployment
```bash
npm run deploy:staging   # Deploy to staging environment
npm run deploy:production # Deploy to production
```

### Utilities
```bash
npm run import:vendors   # Import vendor data from CSV
npm run optimize:images  # Optimize and compress images
npm test                 # Run test suite
```

## 🎯 RSVP System Usage

### 1. Create RSVP
Visit: `http://127.0.0.1:8787/rsvp/generate`

1. Fill in wedding details (bride, groom, date, venue, times)
2. Click "Generate Goan Wedding RSVP"
3. Get instant links and QR codes
4. Share with guests via WhatsApp or copy links

### 2. Guest RSVP
Guests visit the generated RSVP link to:
- View beautiful Goan wedding invitation
- Select ceremony/reception attendance
- Provide guest count and dietary restrictions
- Add Goan wedding specific details (children, transport, accommodation, traditional attire)
- Leave messages for the couple

### 3. Couple Dashboard
Access via: `/rsvp/dashboard/{weddingId}`

- View real-time response statistics
- Track Goan wedding specific metrics
- Export guest list to CSV
- Share updates via WhatsApp
- Search and filter responses

## 🏖️ Goan Wedding Features

### Traditional Elements
- **Ceremony & Reception**: Separate timing for traditional Goan weddings
- **Venue Suggestions**: Grand Hyatt, Taj Exotica, Marriott, etc.
- **Traditional Timing**: 4:00 PM ceremony, 7:00 PM reception
- **Goan Cuisine**: Dietary considerations for seafood, pork, traditional dishes

### Guest Experience
- **Traditional Attire**: Option to indicate wearing traditional Goan attire
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
2. Import CSV file with vendor data
3. Or use Netlify CMS for content management

### Customizing RSVP Questions
Edit `client/src/components/RSVP/GoanWeddingRSVP.tsx` to add/modify:
- Custom questions
- Goan wedding specific fields
- Dietary restriction options
- Transportation/accommodation needs

## 🔧 Configuration

### Environment Variables
```bash
DATABASE_URL=your_cloudflare_d1_database_url
SITE_URL=https://your-domain.com
NODE_ENV=production
CF_API_TOKEN=your_cloudflare_api_token
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

## 📊 Analytics & Monitoring

### Performance
- Core Web Vitals tracking
- Page load time monitoring
- Error rate tracking
- Real-time performance dashboard

### User Analytics
- Google Analytics integration
- User interaction tracking
- Conversion tracking
- Custom event tracking

## 🧪 Testing

### Running Tests
```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### Test Coverage
- Component tests: 80%+ coverage
- API endpoint tests
- E2E tests for critical flows
- PWA functionality tests

## 🚀 Deployment

### Cloudflare Pages
1. Connect GitHub repository
2. Configure build settings:
   - Build command: `npm run build:production`
   - Output directory: `dist/public`
3. Set environment variables
4. Deploy automatically on push

### Manual Deployment
```bash
npm run build:production
npm run deploy:production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues

**Server not starting:**
- Check if port 8787 is available
- Kill existing processes: `taskkill /F /PID <process_id>`
- Try different port in `wrangler.toml`

**Database errors:**
- Run migrations: `npm run db:migrate`
- Check D1 database connection
- Verify environment variables

**Build failures:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version (18+)
- Update dependencies: `npm update`

### Getting Help
- Check the issues section
- Create a new issue with detailed description
- Include error logs and system information

## 🎉 Acknowledgments

- Built with React, TypeScript, and Tailwind CSS
- Powered by Cloudflare Workers and D1
- Designed specifically for Goan wedding traditions
- Inspired by the beautiful wedding culture of Goa

---

**Made with ❤️ for Goan Weddings** 🏖️💒
