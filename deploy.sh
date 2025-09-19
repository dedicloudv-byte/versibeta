#!/bin/bash

# VLESS Worker Deploy Script
# Usage: ./deploy.sh

echo "🚀 Starting VLESS Worker Deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler not found. Installing..."
    npm install -g wrangler
fi

# Login to Cloudflare
echo "🔐 Please login to Cloudflare..."
wrangler login

# Create KV namespace if not exists
echo "📁 Setting up KV namespace..."
wrangler kv:namespace create VLESS_CONFIGS
wrangler kv:namespace create VLESS_CONFIGS --preview

# Update wrangler.toml with KV namespace ID
echo "⚙️  Updating configuration..."
KV_ID=$(wrangler kv:namespace list | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
PREVIEW_ID=$(wrangler kv:namespace list | grep -o '"preview_id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ ! -z "$KV_ID" ]; then
    sed -i "s/your-kv-namespace-id/$KV_ID/g" wrangler.toml
    sed -i "s/your-kv-preview-id/$PREVIEW_ID/g" wrangler.toml
fi

# Deploy to Cloudflare
echo "🌐 Deploying to Cloudflare Workers..."
wrangler deploy

echo "✅ Deployment completed successfully!"
echo "🌟 Your VLESS Worker is now live!"
echo ""
echo "📋 Next steps:"
echo "1. Visit your worker URL to use the interface"
echo "2. Configure custom domain (optional)"
echo "3. Test proxy connections"
echo ""
echo "🔗 Worker URL: https://your-worker-name.workers.dev"