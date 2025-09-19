import { generateVLESSConfig } from './vless-generator.js';
import { checkProxyHealth } from './proxy-checker.js';
import { reverseDomain } from './utils.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (path === '/' || path === '/index.html') {
      return new Response(await getHTML(), {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      });
    }

    if (path === '/api/check-proxy' && request.method === 'POST') {
      const { proxy, port } = await request.json();
      const result = await checkProxyHealth(proxy, port);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/api/create-vless' && request.method === 'POST') {
      const config = await request.json();
      const vlessConfig = await generateVLESSConfig(config, env);
      
      // Store config in KV
      const id = crypto.randomUUID();
      await env.VLESS_CONFIGS.put(id, JSON.stringify(vlessConfig));
      
      return new Response(JSON.stringify({ id, ...vlessConfig }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (path === '/api/get-config' && request.method === 'GET') {
      const id = url.searchParams.get('id');
      if (!id) {
        return new Response(JSON.stringify({ error: 'ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const config = await env.VLESS_CONFIGS.get(id);
      if (!config) {
        return new Response(JSON.stringify({ error: 'Config not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(config, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle VLESS protocol
    if (path.startsWith('/vless/')) {
      return handleVLESSProtocol(request, env);
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleVLESSProtocol(request, env) {
  const upgradeHeader = request.headers.get('Upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected websocket', { status: 400 });
  }

  const [client, server] = Object.values(new WebSocketPair());
  
  server.accept();
  
  server.addEventListener('message', async (event) => {
    try {
      const data = event.data;
      // Handle VLESS protocol data
      await processVLESSData(data, server);
    } catch (error) {
      console.error('VLESS processing error:', error);
      server.close();
    }
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

async function processVLESSData(data, websocket) {
  // Implement VLESS protocol processing
  // This is a simplified version - actual implementation would be more complex
  console.log('Processing VLESS data:', data);
}

function getHTML() {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VLESS Worker CDN - Premium Proxy Generator</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            color: white;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .main-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .form-section {
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 25px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: white;
            font-size: 1.1rem;
        }

        .form-group input, .form-group select {
            width: 100%;
            padding: 15px;
            border: none;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 1rem;
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
        }

        .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }

        .form-group input:focus, .form-group select:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
        }

        .proxy-checker {
            display: flex;
            gap: 10px;
            align-items: end;
        }

        .proxy-checker input {
            flex: 1;
        }

        .btn {
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .health-status {
            margin-top: 10px;
            padding: 15px;
            border-radius: 10px;
            display: none;
        }

        .health-status.online {
            background: rgba(76, 175, 80, 0.3);
            color: #4CAF50;
            display: block;
        }

        .health-status.offline {
            background: rgba(244, 67, 54, 0.3);
            color: #f44336;
            display: block;
        }

        .result-section {
            margin-top: 40px;
            display: none;
        }

        .vless-card {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 20px;
            backdrop-filter: blur(5px);
        }

        .vless-config {
            background: rgba(0, 0, 0, 0.2);
            padding: 15px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            color: #fff;
            margin-bottom: 15px;
            word-break: break-all;
            position: relative;
        }

        .copy-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            color: white;
            font-size: 0.8rem;
        }

        .copy-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .feature-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
            backdrop-filter: blur(5px);
        }

        .feature-icon {
            font-size: 2rem;
            margin-bottom: 10px;
            color: white;
        }

        .feature-title {
            font-weight: 600;
            margin-bottom: 5px;
            color: white;
        }

        .feature-desc {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .main-card {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .proxy-checker {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-shield-alt"></i> VLESS Worker CDN</h1>
            <p>Premium Proxy Generator with Super CDN & Reverse Domain</p>
        </div>

        <div class="main-card">
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon"><i class="fas fa-rocket"></i></div>
                    <div class="feature-title">Super CDN</div>
                    <div class="feature-desc">Global CDN acceleration with Cloudflare network</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon"><i class="fas fa-globe"></i></div>
                    <div class="feature-title">Reverse Domain</div>
                    <div class="feature-desc">Smart domain routing with reverse DNS</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon"><i class="fas fa-wifi"></i></div>
                    <div class="feature-title">Multi-Protocol</div>
                    <div class="feature-desc">TCP, UDP, WebSocket, DNS support</div>
                </div>
                <div class="feature-card">
                    <div class="feature-icon"><i class="fas fa-heartbeat"></i></div>
                    <div class="feature-title">Health Check</div>
                    <div class="feature-desc">Real-time proxy health monitoring</div>
                </div>
            </div>

            <form id="vlessForm">
                <div class="form-section">
                    <h3 style="color: white; margin-bottom: 20px;">Proxy Configuration</h3>
                    
                    <div class="form-group">
                        <label for="proxyHost">Proxy Host / IP</label>
                        <div class="proxy-checker">
                            <input type="text" id="proxyHost" placeholder="Contoh: 104.16.123.45" required>
                            <input type="number" id="proxyPort" placeholder="Port" min="1" max="65535" value="443" style="width: 100px;" required>
                            <button type="button" class="btn btn-secondary" onclick="checkProxyHealth()">
                                <i class="fas fa-search"></i> Check
                            </button>
                        </div>
                        <div id="healthStatus" class="health-status"></div>
                    </div>

                    <div class="form-group">
                        <label for="uuid">UUID (User ID)</label>
                        <input type="text" id="uuid" placeholder="Masukkan UUID atau biarkan kosong untuk otomatis" value="">
                    </div>

                    <div class="form-group">
                        <label for="serverName">Server Name (SNI)</label>
                        <input type="text" id="serverName" placeholder="Contoh: www.cloudflare.com" value="www.cloudflare.com" required>
                    </div>

                    <div class="form-group">
                        <label for="network">Network Type</label>
                        <select id="network">
                            <option value="ws">WebSocket</option>
                            <option value="tcp">TCP</option>
                            <option value="udp">UDP</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="path">WebSocket Path</label>
                        <input type="text" id="path" placeholder="/vless" value="/vless">
                    </div>

                    <div class="form-group">
                        <label for="security">Security</label>
                        <select id="security">
                            <option value="tls">TLS</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; font-size: 1.2rem;">
                        <i class="fas fa-magic"></i> Create VLESS
                    </button>
                </div>
            </form>

            <div id="resultSection" class="result-section">
                <h3 style="color: white; margin-bottom: 20px;">VLESS Configuration</h3>
                <div id="vlessResults"></div>
            </div>
        </div>
    </div>

    <script>
        async function checkProxyHealth() {
            const proxy = document.getElementById('proxyHost').value;
            const port = document.getElementById('proxyPort').value;
            const healthStatus = document.getElementById('healthStatus');
            
            if (!proxy || !port) {
                alert('Mohon isi proxy host dan port terlebih dahulu!');
                return;
            }

            healthStatus.innerHTML = '<div class="loading"></div> Checking proxy health...';
            healthStatus.className = 'health-status';
            healthStatus.style.display = 'block';

            try {
                const response = await fetch('/api/check-proxy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ proxy, port: parseInt(port) })
                });

                const result = await response.json();
                
                if (result.success) {
                    healthStatus.className = 'health-status online';
                    healthStatus.innerHTML = `
                        <i class="fas fa-check-circle"></i> 
                        <strong>Online</strong> - ${result.isp} (${result.country}) 
                        <br>Ping: ${result.ping}ms | IP: ${result.ip}
                    `;
                } else {
                    healthStatus.className = 'health-status offline';
                    healthStatus.innerHTML = `
                        <i class="fas fa-times-circle"></i> 
                        <strong>Offline</strong> - ${result.error}
                    `;
                }
            } catch (error) {
                healthStatus.className = 'health-status offline';
                healthStatus.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i> 
                    <strong>Error</strong> - ${error.message}
                `;
            }
        }

        function generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        function copyToClipboard(text, button) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                button.style.background = 'rgba(76, 175, 80, 0.5)';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = 'rgba(255, 255, 255, 0.2)';
                }, 2000);
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        }

        document.getElementById('vlessForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const uuid = document.getElementById('uuid').value || generateUUID();
            const proxy = document.getElementById('proxyHost').value;
            const port = document.getElementById('proxyPort').value;
            const serverName = document.getElementById('serverName').value;
            const network = document.getElementById('network').value;
            const path = document.getElementById('path').value;
            const security = document.getElementById('security').value;

            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="loading" style="margin-right: 10px;"></div> Creating...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('/api/create-vless', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uuid,
                        proxy,
                        port: parseInt(port),
                        serverName,
                        network,
                        path,
                        security,
                        reverseDomain: true,
                        cdn: true
                    })
                });

                const result = await response.json();
                
                if (result.error) {
                    throw new Error(result.error);
                }

                displayResults(result);
            } catch (error) {
                alert('Error creating VLESS: ' + error.message);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });

        function displayResults(config) {
            const resultSection = document.getElementById('resultSection');
            const vlessResults = document.getElementById('vlessResults');
            
            const vlessLink = \`vless://\${config.uuid}@\${config.proxy}:\${config.port}?encryption=none&security=\${config.security}&type=\${config.network}&host=\${config.serverName}&path=\${encodeURIComponent(config.path)}&sni=\${config.serverName}#VLESS-CF-\${config.proxy}\`;

            vlessResults.innerHTML = \`
                <div class="vless-card">
                    <h4 style="color: white; margin-bottom: 15px;">VLESS Link</h4>
                    <div class="vless-config">
                        \${vlessLink}
                        <button class="copy-btn" onclick="copyToClipboard('\${vlessLink}', this)">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    
                    <h4 style="color: white; margin-bottom: 15px;">JSON Configuration</h4>
                    <div class="vless-config">
                        \${JSON.stringify(config, null, 2)}
                        <button class="copy-btn" onclick="copyToClipboard(JSON.stringify(config, null, 2), this)">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    
                    <h4 style="color: white; margin-bottom: 15px;">Configuration Details</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; color: white;">
                        <div><strong>UUID:</strong> \${config.uuid}</div>
                        <div><strong>Proxy:</strong> \${config.proxy}:\${config.port}</div>
                        <div><strong>Server Name:</strong> \${config.serverName}</div>
                        <div><strong>Network:</strong> \${config.network.toUpperCase()}</div>
                        <div><strong>Path:</strong> \${config.path}</div>
                        <div><strong>Security:</strong> \${config.security.toUpperCase()}</div>
                        <div><strong>CDN:</strong> \${config.cdn ? 'Enabled' : 'Disabled'}</div>
                        <div><strong>Reverse Domain:</strong> \${config.reverseDomain ? 'Enabled' : 'Disabled'}</div>
                    </div>
                </div>
            \`;
            
            resultSection.style.display = 'block';
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }
    </script>
</body>
</html>
  `;
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  }
};