const LOCAL_API_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

export function validateProductionApiBaseUrl(value) {
  const rawValue = value?.trim();
  if (!rawValue) {
    throw new Error('VITE_API_BASE_URL is required for a production customer build');
  }

  let url;
  try {
    url = new URL(rawValue);
  } catch {
    throw new Error('VITE_API_BASE_URL must be a valid absolute URL');
  }

  if (url.protocol !== 'https:') {
    throw new Error('VITE_API_BASE_URL must use HTTPS for a production customer build');
  }
  if (LOCAL_API_HOSTS.has(url.hostname)) {
    throw new Error('VITE_API_BASE_URL must not point to a local server in production');
  }
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error('VITE_API_BASE_URL must be the server origin without /api/v1 or query text');
  }

  return url.origin;
}
