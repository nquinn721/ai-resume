#!/bin/bash

# Create secret in Google Secret Manager
echo "AIzaSyCMOfS4hJpako_FbMLmM7XXqh5PLWtDetg" | gcloud secrets create gemini-api-key --data-file=-

# Grant Cloud Run access to the secret
gcloud secrets add-iam-policy-binding gemini-api-key \
    --member="serviceAccount:your-project-number-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"

# Update Cloud Run to use the secret
gcloud run services update ai-resume \
    --set-secrets="GEMINI_API_KEY=gemini-api-key:latest" \
    --region=us-central1

echo "✅ Secret created and configured in Cloud Run"
echo "🔐 API key is now securely stored in Secret Manager"
