# ✅ Setup Checklist

## MongoDB Atlas Setup
- [ ] Create account at https://cloud.mongodb.com
- [ ] Create M0 cluster (free tier)
- [ ] Create database user: `wb-admin` / `WB-SM-Password123!`
- [ ] Whitelist IP: `0.0.0.0/0`
- [ ] Get connection string
- [ ] Test connection string

## Vercel Setup
- [ ] Create account at https://vercel.com
- [ ] Connect GitHub account
- [ ] Import WB-SM repository
- [ ] Add environment variables:
  - [ ] `MONGODB_URI`: Your MongoDB connection string
  - [ ] `NEXTAUTH_SECRET`: `7c17afea45ec8238befd5e8b1b3b4e1e77323d535c3e49ae1211ca5e84083241`
  - [ ] `NEXTAUTH_URL`: Your Vercel app URL
- [ ] Deploy project
- [ ] Test live application

## Testing
- [ ] Access live URL
- [ ] Login as admin: `admin@datacollect.app` / `33333333`
- [ ] Test admin panel
- [ ] Test user management
- [ ] Test data entry
- [ ] Test all features

## Auto-Deploy Setup
- [ ] Enable auto-deployments in Vercel
- [ ] Test auto-deploy with a small change
- [ ] Verify GitHub → Vercel integration works

## Success Criteria
- [ ] Live website accessible worldwide
- [ ] MongoDB Atlas connected and working
- [ ] All features functional
- [ ] Auto-deployments working
- [ ] Professional hosting active

## Your Credentials
- **MongoDB Atlas**: `wb-admin` / `WB-SM-Password123!`
- **Admin Login**: `admin@datacollect.app` / `33333333`
- **GitHub**: `ahmshafiqulalamsiddique-ui/WB-SM`
- **Vercel**: Your project dashboard
