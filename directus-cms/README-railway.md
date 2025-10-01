# Railway Deployment Guide for Directus CMS

This guide explains how to deploy your Directus CMS for TheGoanWedding.com to Railway.

## Prerequisites

1. A Railway account (https://railway.app)
2. Railway CLI installed (`npm install -g @railway/cli`)
3. Docker installed (for local testing)

## Deployment Steps

### 1. Connect to Railway

Login to your Railway account:
```bash
railway login
```

### 2. Create a New Project

Create a new project on Railway:
```bash
railway init
```

Select "Empty Project" and name it "thegoanwedding-directus".

### 3. Configure Environment Variables

Set the required environment variables in Railway:
```bash
railway variables set KEY=your-32-char-key
railway variables set SECRET=your-32-char-secret
railway variables set ADMIN_EMAIL=admin@thegoanwedding.com
railway variables set ADMIN_PASSWORD=your-secure-password
```

### 4. Deploy to Railway

Deploy your application:
```bash
railway up
```

### 5. Run Database Bootstrap

After the first deployment, you need to bootstrap the database:
```bash
railway run npm run bootstrap
```

### 6. Access Your Application

Get your application URL:
```bash
railway url
```

## Environment Variables

The following environment variables should be set in Railway:

- `KEY` - 32-character security key
- `SECRET` - 32-character security secret
- `ADMIN_EMAIL` - Admin user email
- `ADMIN_PASSWORD` - Admin user password
- `DB_CLIENT` - Database client (sqlite3 for Railway)
- `DB_FILENAME` - Database filename (./database/data.db)

## Database Persistence

Railway provides persistent storage for your database. The SQLite database will be stored in the `database` directory.

## Custom Domain

To use a custom domain:

1. In the Railway dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow Railway's DNS configuration instructions

## Monitoring and Logs

View your application logs:
```bash
railway logs
```

## Scaling

Railway automatically scales your application based on demand. You can configure custom scaling settings in the Railway dashboard.

## Backup and Restore

For database backups:

1. Use Railway's built-in backup feature
2. Or manually export your database:
   ```bash
   railway run sqlite3 database/data.db .dump > backup.sql
   ```

## Troubleshooting

Common issues and solutions:

1. **Deployment fails**: Check logs with `railway logs`
2. **Database connection issues**: Verify DB_CLIENT and DB_FILENAME settings
3. **Permission errors**: Ensure proper file permissions in Dockerfile
4. **Port issues**: Make sure PORT is set to 8055

## Support

For issues with Railway deployment:
- [Railway Documentation](https://docs.railway.app)
- [Directus Documentation](https://docs.directus.io)
- Project documentation in the main repository