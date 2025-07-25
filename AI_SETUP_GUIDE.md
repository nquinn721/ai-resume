# AI Setup Guide

## How to Enable Real AI Responses

Your AI Resume Chat is now configured to use Google's Gemini AI model for intelligent responses.

### Step 1: Get a Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Click "Get API Key"
4. Create a new API key
5. Copy the generated API key (it starts with "AIza...")

### Step 2: Add the API Key

The API key has already been configured in your `.env` file:

```
GEMINI_API_KEY=AIzaSyCMOfS4hJpako_FbMLmM7XXqh5PLWtDetg
```

### Step 3: Restart the Server

1. Stop the current backend server (Ctrl+C)
2. Restart it with:
   ```bash
   npm run start:dev
   ```

### Step 4: Verify AI is Working

You can check if AI is enabled by visiting:

- `http://localhost:3000/api/chat/ai-status`

You should see:

```json
{
  "status": {
    "enabled": true,
    "model": "gemini-1.5-flash"
  }
}
```

### What Changes When AI is Enabled

**Without API Key:**

- Shows setup required message
- No AI responses available

**With API Key (Gemini-Powered):**

- Dynamic, contextual responses using Gemini 1.5 Flash
- Understands your actual resume content
- Can answer complex, nuanced questions
- Provides personalized explanations
- Optimized for sales-focused responses
- FREE tier available with generous limits

### Testing the AI

Try asking questions like:

- "What makes Nathan a good candidate for a React developer position?"
- "Explain Nathan's experience with cloud technologies"
- "What projects demonstrate Nathan's full-stack capabilities?"

The AI will analyze your actual resume content and provide detailed, persuasive responses designed to sell Nathan Quinn as the ideal candidate!

### Cost Information

Gemini AI Pricing:

- **Gemini 1.5 Flash**: FREE tier with generous limits
- **Input**: $0.075 per 1M tokens (after free tier)
- **Output**: $0.30 per 1M tokens (after free tier)

For typical resume chat usage, this will likely stay within the free tier limits.

### Troubleshooting

If you get errors after configuration:

1. Check that the API key is correct (starts with "AIza")
2. Ensure there are no extra spaces in the `.env` file
3. Verify your Google account has API access enabled
4. Check the backend logs for specific error messages
5. Make sure you've restarted the server after adding the API key
