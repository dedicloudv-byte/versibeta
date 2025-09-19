# VLESS Worker CDN - Premium Proxy Generator

Aplikasi VLESS Worker yang siap deploy ke Cloudflare Worker dengan fitur lengkap termasuk CDN super, reverse domain, health check proxy, dan interface yang mewah.

## Fitur Utama

### Super CDN
- Global CDN acceleration menggunakan jaringan Cloudflare
- Multi-region endpoints untuk performa optimal
- Smart routing berdasarkan lokasi user

### Reverse Domain
- Domain routing terbalik untuk bypass filter
- DNS resolution otomatis
- Support untuk custom domains

### Multi-Protocol Support
- WebSocket (WS): Untuk browser dan app support
- TCP: Koneksi langsung untuk performa maksimal
- UDP: Untuk gaming dan streaming
- DNS: Untuk resolving yang cepat

### Health Check System
- Real-time proxy monitoring
- Ping test dengan ISP detection
- Status indicator visual
- Auto-fallback untuk proxy mati

### Interface Premium
- Design modern dengan glassmorphism
- Animasi smooth dan responsive
- Color scheme yang mewah
- Mobile-friendly interface

## Cara Deploy

### 1. Setup Cloudflare Worker

1. Login ke Cloudflare Dashboard
2. Pilih menu Workers & Pages
3. Klik Create Application
4. Pilih Create Worker

### 2. Upload Code

1. Install dependencies:
   npm install

2. Update wrangler.toml dengan:
   - Nama worker yang diinginkan
   - KV namespace ID (buat di dashboard Cloudflare)

3. Deploy menggunakan Wrangler:
   npm run deploy

### 3. Setup KV Namespace

1. Di Cloudflare Dashboard, buat KV namespace:
   - Nama: VLESS_CONFIGS
   - Simpan ID yang diberikan

2. Update wrangler.toml dengan ID yang didapat