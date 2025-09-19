export function reverseDomain(domain) {
  // Implement reverse domain logic for CDN optimization
  const parts = domain.split('.');
  if (parts.length >= 2) {
    return parts.reverse().join('.');
  }
  return domain;
}

export function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function getCDNEndpoint(region) {
  const endpoints = {
    'global': 'https://cdn.cloudflare.net',
    'us': 'https://us.cdn.cloudflare.net',
    'eu': 'https://eu.cdn.cloudflare.net',
    'asia': 'https://asia.cdn.cloudflare.net'
  };
  return endpoints[region] || endpoints.global;
}

export function encodeBase64(str) {
  return btoa(str);
}

export function decodeBase64(str) {
  return atob(str);
}