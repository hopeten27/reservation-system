# Deployment Guide

## Frontend to Vercel

1. **Connect GitHub repo to Vercel**
2. **Set build settings:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api/v1
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

4. **Deploy:** Push to main branch or click deploy in Vercel dashboard

## Backend to Render

1. **Connect GitHub repo to Render**
2. **Create Web Service:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES_IN=30d
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Deploy:** Push to main branch or manual deploy

## Post-Deployment

1. **Update frontend CORS URL** in `backend/src/app.js`
2. **Test all endpoints** with production URLs
3. **Set up MongoDB Atlas** for production database
4. **Configure Stripe webhooks** with production URL

## Quick Commands

```bash
# Frontend
cd frontend && npm run build

# Backend  
cd backend && npm start
```