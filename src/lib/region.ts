export type SiteRegion = 'IN' | 'AE' | 'OTHER';

function readCookieValue(cookieHeader: string, name: string): string | null {
  const parts = cookieHeader.split(';');
  for (const rawPart of parts) {
    const [key, ...rest] = rawPart.trim().split('=');
    if (key === name) {
      return decodeURIComponent(rest.join('=')).trim();
    }
  }
  return null;
}

export function getRegionFromHeaders(requestHeaders: Headers): SiteRegion {
  const cookieHeader = requestHeaders.get('cookie') ?? '';
  const cookieRegion = readCookieValue(cookieHeader, 'site_region')?.toLowerCase();

  if (cookieRegion === 'india') return 'IN';
  if (cookieRegion === 'dubai') return 'AE';

  const geoCountry = requestHeaders.get('x-vercel-ip-country')?.toUpperCase();
  if (geoCountry === 'IN') return 'IN';
  if (geoCountry === 'AE') return 'AE';

  return 'OTHER';
}

