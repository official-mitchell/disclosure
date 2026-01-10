# Production Deployment Setup

## Current Status
- ✅ Production build successful
- ✅ All environment variables configured in Vercel
- ⚠️ Deployment Protection is ENABLED (needs to be disabled)

## Disable Deployment Protection

Your app is currently protected by Vercel Authentication, which prevents public access. To make it accessible to players:

1. Go to https://vercel.com/alluminate/disclosure/settings/deployment-protection
2. **Disable "Standard Protection"** or **"Vercel Authentication"**
3. Save changes
4. Redeploy: `vercel --prod`

## Environment Variables Already Set

The following environment variables are configured in Vercel Production:

- `SESSION_SECRET` - JWT session encryption
- `GM_PASSWORD` - Set to "admin123"
- `DATABASE_URL` - PostgreSQL connection
- `POSTGRES_URL` - Additional database URL
- `PRISMA_DATABASE_URL` - Prisma database connection

## Production URLs

After disabling protection, your app will be accessible at:
- **Production**: https://disclosure-l8509w93x-alluminate.vercel.app
- **Custom Domain** (if configured): Check Vercel dashboard

## Testing Production

Once deployment protection is disabled, test:

1. **GM Login**: https://disclosure-l8509w93x-alluminate.vercel.app/gm/login
   - Password: `admin123`

2. **Player Login**: https://disclosure-l8509w93x-alluminate.vercel.app/login
   - Use any player name and PIN from the database

3. **API Health Check**:
   ```bash
   curl -X POST https://disclosure-l8509w93x-alluminate.vercel.app/api/auth/gm \
     -H "Content-Type: application/json" \
     -d '{"password":"admin123"}'
   ```

## Deployment Commands

```bash
# Deploy to production
vercel --prod

# Check deployment logs
vercel logs [deployment-url]

# List all deployments
vercel ls

# Promote a specific deployment to production
vercel promote [deployment-url]
```

## Important Notes

1. **Database Connection**: Ensure your production database URL is accessible from Vercel's infrastructure
2. **Session Secret**: Make sure SESSION_SECRET is a secure random string (min 32 characters)
3. **CORS**: Currently no CORS restrictions - consider adding if needed
4. **Rate Limiting**: Consider adding rate limiting for production API endpoints

## Monitoring

Monitor your deployment at:
- https://vercel.com/alluminate/disclosure
- Check logs: `vercel logs`
