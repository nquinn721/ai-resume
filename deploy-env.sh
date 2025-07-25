#!/bin/bash

# Update Cloud Run service with environment variables
gcloud run services update ai-resume \
  --set-env-vars="GEMINI_API_KEY=AIzaSyCMOfS4hJpako_FbMLmM7XXqh5PLWtDetg,NODE_ENV=production" \
  --region=us-central1

echo "✅ Environment variables updated in Cloud Run"
echo "🚀 Service will restart with new configuration"
