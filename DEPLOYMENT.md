# Deployment Guide - Digital Flux Marketplace

This guide covers deploying the Digital Flux marketplace to production.

## 🎯 Deployment Overview

The platform is designed to be deployed on:
- **Frontend/Backend**: Vercel (recommended) or any Node.js hosting
- **Database**: Managed PostgreSQL (Supabase, Neon, Railway, or AWS RDS)
- **File Storage**: AWS S3
- **Payments**: Flutterwave (handled via API)

## 📋 Pre-Deployment Checklist

- [ ] Database is set up and accessible
- [ ] AWS S3 bucket is created and configured
- [ ] Flutterwave account is set up with API keys
- [ ] Environment variables are ready
- [ ] Domain name is configured (optional)

## 🚀 Step-by-Step Deployment

### 1. Database Setup

#### Option A: Supabase (Recommended for ease)

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

#### Option B: Neon

1. Go to [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard

#### Option C: Railway

1. Go to [Railway](https://railway.app)
2. Create a new PostgreSQL service
3. Copy the connection string from the service variables

### 2. AWS S3 Setup

1. **Create S3 Bucket**
   - Go to AWS Console > S3
   - Create bucket (e.g., `digital-flux-uploads`)
   - Choose region (e.g., `us-east-1`)
   - Uncheck "Block all public access" (or configure bucket policy)

2. **Configure CORS**
   - Go to bucket > Permissions > CORS
   - Add this configuration:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
       "AllowedOrigins": [
         "https://yourdomain.com",
         "https://*.vercel.app"
       ],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

3. **Create IAM User**
   - Go to IAM > Users > Create user
   - Attach policy: `AmazonS3FullAccess` (or create custom policy)
   - Create access key
   - Save Access Key ID and Secret Access Key

4. **Bucket Policy** (Optional, for public reads)
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

### 3. Flutterwave Setup

1. **Create Account**
   - Go to [Flutterwave](https://flutterwave.com)
   - Sign up and verify your account

2. **Get API Keys**
   - Go to Settings > API Keys
   - Copy Public Key and Secret Key
   - Get Encryption Key from API settings

3. **Configure Webhook**
   - Go to Settings > Webhooks
   - Add webhook URL: `https://yourdomain.com/api/webhooks/flutterwave`
   - Copy the webhook hash

4. **Enable Mobile Money**
   - Ensure MTN and Orange Money are enabled in your account
   - Verify your business details

### 4. Vercel Deployment

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure project settings

3. **Environment Variables**
   Add all variables from `.env.example`:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=...
   AWS_ACCESS_KEY_ID=...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=us-east-1
   AWS_S3_BUCKET_NAME=digital-flux-uploads
   FLW_PUBLIC_KEY=...
   FLW_SECRET_KEY=...
   FLW_ENCRYPTION_KEY=...
   FLW_WEBHOOK_HASH=...
   PLATFORM_OWNER_EMAIL=owner@yourcompany.com
   PLATFORM_COMMISSION_RATE=0.10
   PLATFORM_PRO_COMMISSION_RATE=0.05
   PLATFORM_OWNER_COMMISSION_RATE=0.00
   NODE_ENV=production
   ```

4. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://yourproject.vercel.app`

### 5. Database Migration

After deployment, run database migrations:

```bash
# Option 1: Using Vercel CLI
vercel env pull .env.local
npx prisma db push

# Option 2: Using direct connection
DATABASE_URL="your-production-url" npx prisma db push
```

### 6. Post-Deployment Setup

1. **Create Admin User**
   - Sign up through the app
   - Update user role in database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

2. **Set Platform Owner**
   - Create seller profile for owner
   - Mark as owner:
   ```sql
   UPDATE seller_profiles SET "isOwner" = true WHERE "userId" = 'owner-user-id';
   ```

3. **Update Flutterwave Webhook**
   - Update webhook URL in Flutterwave dashboard to your production URL
   - Test webhook delivery

4. **Configure Custom Domain** (Optional)
   - In Vercel, go to Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed
   - Update `NEXTAUTH_URL` to your custom domain

## 🔧 Production Optimizations

### 1. Database Connection Pooling

For high traffic, use connection pooling:

```env
DATABASE_URL="postgresql://user:pass@host/db?pgbouncer=true&connection_limit=1"
```

### 2. Enable Caching

Add Redis for session storage (optional):
- Use Upstash Redis
- Update NextAuth config to use Redis adapter

### 3. CDN for Static Assets

- Configure CloudFront for S3 bucket
- Update file URLs to use CDN domain

### 4. Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor database performance
- Set up uptime monitoring

## 🧪 Testing Production

1. **Test Authentication**
   - Sign up new user
   - Sign in/out
   - Test password reset (if implemented)

2. **Test Payments**
   - Create a test product
   - Make a test purchase
   - Verify webhook receives payment
   - Check payout is created

3. **Test File Uploads**
   - Upload a file
   - Verify it appears in S3
   - Test file download after purchase

4. **Test Search**
   - Create products with different boost scores
   - Verify owner products appear first

## 🔒 Security Checklist

- [ ] All environment variables are set
- [ ] Database is not publicly accessible
- [ ] S3 bucket has proper access controls
- [ ] Flutterwave webhook hash is verified
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented (optional)

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- Ensure SSL is enabled if required

### S3 Upload Failures
- Verify CORS configuration
- Check IAM permissions
- Verify bucket name and region

### Payment Webhook Not Working
- Verify webhook URL is correct
- Check webhook hash matches
- Review Vercel function logs

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

## 📊 Monitoring

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor function execution times
- Track API route performance

### Database Monitoring
- Use your database provider's monitoring tools
- Set up alerts for high connection counts
- Monitor query performance

## 🔄 Updates and Maintenance

1. **Update Code**
   ```bash
   git push origin main
   # Vercel automatically deploys
   ```

2. **Database Migrations**
   ```bash
   npx prisma migrate dev
   npx prisma migrate deploy  # For production
   ```

3. **Environment Variable Updates**
   - Update in Vercel dashboard
   - Redeploy to apply changes

## 📞 Support

For deployment issues:
- Check Vercel deployment logs
- Review database connection logs
- Verify all environment variables
- Check Flutterwave webhook logs

## 🎉 Success!

Your Digital Flux marketplace should now be live! 

Next steps:
1. Create your first admin account
2. Set up platform owner
3. Test all features
4. Start onboarding sellers

