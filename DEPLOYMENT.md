# BitForce Deployment Guide

## Quick Start

### 1. Database Setup (Neon - Free Tier)

1. Go to https://neon.tech and create account
2. Create new project "bitforce"
3. Copy the connection string (looks like `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb`)
4. Save it - you'll need it for both Render and local dev

### 2. Backend Deployment (Render)

1. Go to https://render.com and connect GitHub
2. Click "New +" → "Blueprint"
3. Select the BitForce repo
4. Render will detect `render.yaml` and create the service
5. Set environment variables in Render dashboard:
   - `DATABASE_URL` = your Neon connection string
   - `STRIPE_SECRET_KEY` = your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` = your Stripe webhook secret
   - `BASE_URL` = https://your-domain.com (or Render URL initially)

**Or manual setup:**
1. New → Web Service
2. Connect BitForce repo
3. Settings:
   - Build: `npm install && npm run build`
   - Start: `npm run start`
   - Health check: `/api/health`

### 3. Frontend Deployment (Vercel)

1. Go to https://vercel.com and connect GitHub
2. Import BitForce repo
3. Framework: Vite
4. Root directory: `client`
5. Build command: `npm run build`
6. Output: `dist`
7. Add environment variable:
   - `VITE_API_URL` = your Render backend URL

### 4. Database Migration

After backend is deployed, run migrations:

```bash
# Local (with DATABASE_URL set)
npm run db:push

# Or via Render shell
npx drizzle-kit push
```

### 5. Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-render-url.onrender.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook signing secret to Render env vars

### 6. Domain Setup (Optional)

**For custom domain:**
1. Add domain in Vercel (frontend)
2. Add domain in Render (backend API)
3. Update `BASE_URL` env var
4. Update Stripe webhook URL

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| SESSION_SECRET | Yes | Random string for session encryption |
| STRIPE_SECRET_KEY | Yes | Stripe API secret key |
| STRIPE_WEBHOOK_SECRET | Yes | Stripe webhook signing secret |
| BASE_URL | Yes | Your app's public URL |
| BFT_PLATFORM_URL | No | BitForce Token platform URL |
| GEMINI_API_KEY | No | For AI image generation |
| ADMIN_USER_IDS | No | Comma-separated admin user IDs |

## Troubleshooting

**Health check failing:**
- Check DATABASE_URL is correct
- Check Render logs for errors

**Auth not working:**
- Verify SESSION_SECRET is set
- Check cookies are being set (HTTPS required in production)

**Stripe payments failing:**
- Verify webhook secret matches
- Check Stripe dashboard for failed webhooks
