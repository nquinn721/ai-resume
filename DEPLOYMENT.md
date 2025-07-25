# 🚀 Cloud Deployment Guide

## Google Cloud Run Deployment

### 📋 Prerequisites

- Google Cloud account with billing enabled
- Google Cloud CLI installed
- Docker installed (or use Cloud Build)

### 🔑 Setting up Gemini API Key

#### Option 1: Environment Variables (Quick Setup)

```bash
# Deploy with environment variables
gcloud run deploy ai-resume \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=AIzaSyCMOfS4hJpako_FbMLmM7XXqh5PLWtDetg,NODE_ENV=production"
```

#### Option 2: Secret Manager (Recommended for Production)

```bash
# 1. Create secret
echo "AIzaSyCMOfS4hJpako_FbMLmM7XXqh5PLWtDetg" | gcloud secrets create gemini-api-key --data-file=-

# 2. Deploy with secret
gcloud run deploy ai-resume \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest" \
  --set-env-vars="NODE_ENV=production"
```

#### Option 3: Cloud Console (Manual)

1. Go to [Google Cloud Console](https://console.cloud.google.com/run)
2. Select your service → "Edit & Deploy New Revision"
3. Variables & Secrets tab → Add Variable:
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyCMOfS4hJpako_FbMLmM7XXqh5PLWtDetg`
4. Add another variable:
   - Name: `NODE_ENV`
   - Value: `production`
5. Click "Deploy"

### 🌐 Other Cloud Platforms

#### Railway

```bash
railway login
railway init
railway up
# Add GEMINI_API_KEY in Railway dashboard
```

#### Render.com

1. Connect GitHub repository
2. Set environment variables:
   - `GEMINI_API_KEY`: `AIzaSyCMOfS4hJpako_FbMLmM7XXqh5PLWtDetg`
   - `NODE_ENV`: `production`

#### Vercel

```bash
npm i -g vercel
vercel
# Add environment variables in Vercel dashboard
```

### 🔧 Environment Variables Required

- `GEMINI_API_KEY`: Your Google Gemini API key
- `NODE_ENV`: Set to "production"
- `PORT`: Usually auto-set by cloud providers

### 🏥 Health Check

Your deployment should respond to:

- Health: `https://your-app.run.app/api/health`
- AI Status: `https://your-app.run.app/api/chat/ai-status`

### 📱 Testing Deployment

```bash
# Test health endpoint
curl https://your-app.run.app/api/health

# Test AI status
curl https://your-app.run.app/api/chat/ai-status

# Should return: {"status":{"enabled":true,"model":"gemini-1.5-flash"}}
```
