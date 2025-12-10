# Digital Flux - Digital Marketplace Platform

A full-featured SaaS digital marketplace platform similar to Selar.com, built with Next.js, Prisma, PostgreSQL, and AWS S3. Designed for creators in Cameroon with support for MTN/Orange Mobile Money via Flutterwave.

## 🚀 Features

### Core Functionality
- **Multi-Product Support**: Courses, Digital Products, Events, Services, and Masterclasses
- **User Roles**: Buyer, Seller, and Admin accounts
- **Commission System**: 
  - Platform owner: 0% commission
  - Default sellers: 10% commission
  - Pro plan sellers: 5% commission
- **Automatic Payouts**: Mobile Money disbursements via Flutterwave
- **Search with Ranking**: Owner products always appear first using boost scores
- **File Management**: AWS S3 integration for large file uploads (videos, PDFs, ZIPs)

### Payment Integration
- **Flutterwave Integration**: 
  - Card payments
  - MTN Mobile Money
  - Orange Money
  - Webhook verification
  - Automatic payouts

### Seller Dashboard
- Upload and manage products
- View sales and revenue
- Request payouts
- Subscription management (Free/Pro plans)

### Admin Dashboard
- Approve/reject products
- Manage users
- Boost products (control search ranking)
- Platform analytics
- Commission rate management

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: AWS S3
- **Payments**: Flutterwave
- **Styling**: Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- AWS account with S3 bucket
- Flutterwave account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digital-flux
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables (see Environment Variables section below)

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/digital_flux?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="digital-flux-uploads"

# Flutterwave
FLW_PUBLIC_KEY="your-flutterwave-public-key"
FLW_SECRET_KEY="your-flutterwave-secret-key"
FLW_ENCRYPTION_KEY="your-flutterwave-encryption-key"
FLW_WEBHOOK_HASH="your-flutterwave-webhook-hash"

# Platform Configuration
PLATFORM_OWNER_EMAIL="owner@yourcompany.com"
PLATFORM_COMMISSION_RATE=0.10
PLATFORM_PRO_COMMISSION_RATE=0.05
PLATFORM_OWNER_COMMISSION_RATE=0.00

# App Configuration
NODE_ENV="development"
```

### Getting Your Environment Variables

1. **Database (PostgreSQL)**: 
   - Use a local PostgreSQL instance or a cloud provider like Supabase, Neon, or Railway
   - Format: `postgresql://user:password@host:port/database?schema=public`

2. **NextAuth Secret**: 
   - Generate using: `openssl rand -base64 32`

3. **AWS S3**:
   - Create an S3 bucket in AWS Console
   - Create an IAM user with S3 permissions
   - Get access key and secret key

4. **Flutterwave**:
   - Sign up at [Flutterwave](https://flutterwave.com)
   - Get your API keys from the dashboard
   - Set up webhook URL: `https://yourdomain.com/api/webhooks/flutterwave`
   - Get webhook hash from Flutterwave dashboard

5. **Platform Owner**:
   - Set `PLATFORM_OWNER_EMAIL` to your company email
   - Mark the user as owner in the database (set `isOwner: true` in `seller_profiles`)

## 📁 Project Structure

```
digital-flux/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── products/     # Product CRUD
│   │   ├── payments/     # Payment processing
│   │   ├── upload/       # File upload (S3 signed URLs)
│   │   ├── search/       # Search with boost ranking
│   │   └── webhooks/     # Flutterwave webhooks
│   ├── admin/            # Admin dashboard
│   ├── seller/           # Seller dashboard
│   ├── auth/             # Authentication pages
│   ├── browse/           # Product browsing
│   ├── product/          # Product details
│   └── dashboard/        # User dashboard
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # NextAuth configuration
│   ├── flutterwave.ts    # Flutterwave integration
│   ├── s3.ts             # AWS S3 integration
│   └── utils.ts          # Helper functions
├── prisma/
│   └── schema.prisma     # Database schema
├── components/           # Reusable components
└── types/                # TypeScript types
```

## 🗄️ Database Schema

The platform uses the following main models:

- **User**: Buyer/Seller/Admin accounts
- **SellerProfile**: Seller-specific information
- **Product**: Generic product model (supports all types)
- **CourseMetadata**: Course-specific details
- **EventMetadata**: Event-specific details
- **ServiceMetadata**: Service-specific details
- **File**: Product files (videos, PDFs, etc.)
- **Transaction**: Purchase records
- **Payout**: Seller payout records
- **Subscription**: Pro plan subscriptions
- **Category**: Product categories
- **BoostScore**: Search ranking control

## 💳 Payment Flow

1. User clicks "Purchase" on a product
2. Payment is initialized via Flutterwave API
3. User completes payment (card or mobile money)
4. Flutterwave sends webhook to `/api/webhooks/flutterwave`
5. Transaction is verified and marked as completed
6. Commission is calculated based on seller plan
7. Payout record is created and processed automatically

## 🔍 Search & Ranking

The search system uses a boost score mechanism:

- **Owner products**: Automatically get boost score of 1000 (always appear first)
- **Admin boost**: Admins can manually set boost scores for any product
- **Default**: Products start with boost score of 0
- **Sorting**: Products are sorted by boost score (descending), then by creation date

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables
   - Deploy

3. **Database Setup**
   - Use a managed PostgreSQL service (Supabase, Neon, Railway)
   - Add `DATABASE_URL` to Vercel environment variables

4. **AWS S3 Setup**
   - Ensure your S3 bucket allows CORS from your Vercel domain
   - Update `NEXTAUTH_URL` to your production URL

5. **Flutterwave Webhook**
   - Update webhook URL in Flutterwave dashboard
   - Set to: `https://yourdomain.com/api/webhooks/flutterwave`

### AWS S3 CORS Configuration

Add this CORS configuration to your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": []
  }
]
```

## 📝 API Endpoints

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product details
- `PATCH /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Files
- `POST /api/upload` - Get S3 signed URL
- `POST /api/products/[id]/files` - Add file to product
- `GET /api/products/[id]/files` - Get product files (requires purchase)

### Payments
- `POST /api/payments/initialize` - Initialize payment

### Search
- `GET /api/search?q=query` - Search products

### Admin
- `POST /api/admin/boost/[id]` - Update boost score

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Webhook Verification**: Always verify Flutterwave webhook signatures
3. **File Access**: Files are only accessible to purchasers
4. **Role-Based Access**: Middleware protects admin/seller routes
5. **Input Validation**: All inputs are validated using Zod

## 🧪 Development

```bash
# Run development server
npm run dev

# Generate Prisma client
npm run db:generate

# Push database changes
npm run db:push

# Open Prisma Studio
npm run db:studio
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Flutterwave API Docs](https://developer.flutterwave.com/docs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, email support@yourcompany.com or create an issue in the repository.

