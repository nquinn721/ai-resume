#!/bin/bash

echo "🚀 Testing full build process..."

echo "📦 Building client..."
cd client
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Client build failed"
    exit 1
fi
echo "✅ Client build successful"

echo "🔧 Building server..."
cd ..
npm run build:server
if [ $? -ne 0 ]; then
    echo "❌ Server build failed"
    exit 1
fi
echo "✅ Server build successful"

echo "🎉 All builds completed successfully!"
echo "📁 Client build output: $(ls -la client/dist | wc -l) files"
echo "📁 Server build output: $(ls -la dist | wc -l) files"

echo ""
echo "🐳 Ready for Docker build!"
echo "Run: docker build -t ai-resume ."
