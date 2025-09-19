# Installation Guide - VLESS Worker CDN

## Quick Start (5 Minutes)

### Method 1: Direct Deploy (Recommended)
1. Download all files from this repository
2. Go to [Cloudflare Workers](https://workers.cloudflare.com)
3. Create new worker
4. Copy paste `src/index.js` content
5. Deploy!

### Method 2: Using Wrangler CLI

#### Prerequisites
- Node.js 16+ installed
- Cloudflare account
- Wrangler CLI installed

#### Step-by-Step Installation

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Create KV Namespace**
   ```bash
   wrangler kv:namespace create VLESS_CONFIGS
   ```

4. **Update Configuration**
   Edit `wrangler.toml` with your details:
   ```toml
   name = "your-vless-worker-name"
   ```

5. **Deploy**
   ```bash
   ./deploy.sh
   ```

## Configuration Options

### Environment Variables
- `ENVIRONMENT`: production/development
- `CORS_ORIGIN`: for CORS settings

### KV Storage
- Stores VLESS configurations
- Persists across deployments
- Automatic cleanup after 30 days

### Custom Domain Setup
1. Go to Worker settings
2. Add custom routes
3. Configure DNS A record
4. Enable SSL/TLS

## Verification Steps

1. **Test Health Check**
   - Enter proxy IP: 1.1.1.1
   - Port: 443
   - Click "Check"

2. **Create Test VLESS**
   - Use any valid proxy
   - Generate UUID automatically
   - Copy VLESS link

3. **Import to Client**
   - V2Ray: Import link directly
   - Clash: Use YAML config
   - Shadowrocket: Scan QR

## Troubleshooting

### Common Issues

1. **Worker Not Responding**
   - Check KV namespace setup
   - Verify wrangler.toml configuration
   - Check Cloudflare status

2. **Proxy Health Check Fails**
   - Ensure proxy allows connections
   - Check firewall settings
   - Try different proxy

3. **VLESS Link Invalid**
   - Verify UUID format
   - Check server name
   - Validate path configuration

### Debug Mode
Add `?debug=true` to URL for detailed logs