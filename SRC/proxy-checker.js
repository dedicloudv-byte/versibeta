export async function checkProxyHealth(proxy, port) {
  try {
    // Create a simple HTTP request to check if proxy is responding
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const startTime = Date.now();
    
    // Try to fetch from a known endpoint to check connectivity
    const response = await fetch(`http://ip-api.com/json/${proxy}`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      const ping = Date.now() - startTime;
      
      return {
        success: true,
        ip: proxy,
        port: port,
        isp: data.isp || 'Unknown ISP',
        country: data.country || 'Unknown',
        ping: ping,
        status: 'online'
      };
    }
    
    return {
      success: false,
      error: 'Failed to connect to proxy'
    };
    
  } catch (error) {
    console.error('Proxy check error:', error);
    
    // Fallback check using DNS resolution
    try {
      const dnsResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${proxy}&type=A`, {
        headers: { 'Accept': 'application/dns-json' }
      });
      
      if (dnsResponse.ok) {
        const dnsData = await dnsResponse.json();
        if (dnsData.Status === 0 && dnsData.Answer && dnsData.Answer.length > 0) {
          return {
            success: true,
            ip: proxy,
            port: port,
            isp: 'DNS Resolved',
            country: 'Unknown',
            ping: 0,
            status: 'online'
          };
        }
      }
    } catch (dnsError) {
      console.error('DNS check failed:', dnsError);
    }
    
    return {
      success: false,
      error: error.message || 'Proxy unreachable'
    };
  }
}

export async function checkMultipleProxies(proxies) {
  const results = await Promise.all(
    proxies.map(async (proxy) => {
      const [host, port] = proxy.split(':');
      return await checkProxyHealth(host, parseInt(port) || 443);
    })
  );
  
  return results.filter(result => result.success);
}

export function getFastestProxy(proxies) {
  if (!proxies || proxies.length === 0) return null;
  
  return proxies.reduce((fastest, current) => 
    current.ping < fastest.ping ? current : fastest
  );
}