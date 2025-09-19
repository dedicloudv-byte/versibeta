import { reverseDomain, generateRandomString, isValidUUID } from './utils.js';

export async function generateVLESSConfig(config, env) {
  // Validate configuration
  if (!config.proxy || !config.port) {
    throw new Error('Proxy host and port are required');
  }

  // Generate UUID if not provided
  let uuid = config.uuid;
  if (!uuid || !isValidUUID(uuid)) {
    uuid = crypto.randomUUID();
  }

  // Create reverse domain for CDN optimization
  const reversedDomain = reverseDomain(config.serverName || 'cloudflare.com');
  
  // Generate CDN endpoints
  const cdnEndpoints = generateCDNEndpoints(config.proxy, config.port);
  
  // Create VLESS configuration
  const vlessConfig = {
    uuid: uuid,
    proxy: config.proxy,
    port: config.port,
    serverName: config.serverName,
    network: config.network || 'ws',
    path: config.path || '/vless',
    security: config.security || 'tls',
    cdn: config.cdn !== false,
    reverseDomain: config.reverseDomain !== false,
    reversedDomain: reversedDomain,
    cdnEndpoints: cdnEndpoints,
    timestamp: new Date().toISOString(),
    id: crypto.randomUUID()
  };

  // Generate configuration for different clients
  vlessConfig.clients = {
    v2ray: generateV2RayConfig(vlessConfig),
    clash: generateClashConfig(vlessConfig),
    shadowrocket: generateShadowrocketConfig(vlessConfig)
  };

  // Store in KV for persistence
  await env.VLESS_CONFIGS.put(vlessConfig.id, JSON.stringify(vlessConfig));

  return vlessConfig;
}

function generateCDNEndpoints(proxy, port) {
  const regions = ['global', 'us', 'eu', 'asia'];
  const endpoints = [];
  
  regions.forEach(region => {
    endpoints.push({
      region: region,
      host: `${region}-${generateRandomString(8)}.cdn.cloudflare.net`,
      port: port,
      path: `/vless-${generateRandomString(6)}`,
      priority: Math.floor(Math.random() * 100)
    });
  });
  
  return endpoints.sort((a, b) => a.priority - b.priority);
}

function generateV2RayConfig(config) {
  return {
    v: "2",
    ps: `VLESS-CF-${config.proxy}`,
    add: config.proxy,
    port: config.port,
    id: config.uuid,
    aid: "0",
    scy: "auto",
    net: config.network,
    type: "none",
    host: config.serverName,
    path: config.path,
    tls: config.security,
    sni: config.serverName,
    alpn: "h2,http/1.1"
  };
}

function generateClashConfig(config) {
  return {
    name: `VLESS-CF-${config.proxy}`,
    type: "vless",
    server: config.proxy,
    port: config.port,
    uuid: config.uuid,
    tls: config.security === 'tls',
    network: config.network,
    "ws-opts": {
      path: config.path,
      headers: {
        Host: config.serverName
      }
    },
    servername: config.serverName
  };
}

function generateShadowrocketConfig(config) {
  return {
    remarks: `VLESS-CF-${config.proxy}`,
    server: config.proxy,
    port: config.port,
    method: "none",
    password: config.uuid,
    protocol: "vless",
    obfs: config.network,
    "obfs-param": config.serverName,
    "protocol-param": config.path,
    tls: config.security === 'tls'
  };
}

export function generateVLESSLink(config) {
  const params = new URLSearchParams({
    encryption: 'none',
    security: config.security,
    type: config.network,
    host: config.serverName,
    path: config.path,
    sni: config.serverName,
    alpn: 'h2,http/1.1'
  });

  return `vless://${config.uuid}@${config.proxy}:${config.port}?${params.toString()}#VLESS-CF-${config.proxy}`;
}

export function decodeVLESSLink(link) {
  try {
    const url = new URL(link);
    if (url.protocol !== 'vless:') {
      throw new Error('Invalid VLESS protocol');
    }

    const [uuid, server] = url.username.split('@');
    const [host, port] = server.split(':');
    
    const params = url.searchParams;
    
    return {
      uuid: uuid,
      host: host,
      port: parseInt(port),
      security: params.get('security') || 'tls',
      network: params.get('type') || 'ws',
      serverName: params.get('sni') || host,
      path: params.get('path') || '/',
      encryption: params.get('encryption') || 'none'
    };
  } catch (error) {
    throw new Error('Invalid VLESS link format');
  }
}