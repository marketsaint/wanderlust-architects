import { NextRequest, NextResponse } from 'next/server';

const REGION_COOKIE = 'site_region';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const BOT_UA_PATTERN =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|facebot|ia_archiver|applebot|linkedinbot|twitterbot/i;

type Region = 'india' | 'dubai';

function isPrefetchRequest(request: NextRequest): boolean {
  const purpose = request.headers.get('purpose');
  const secPurpose = request.headers.get('sec-purpose');
  return request.headers.has('next-router-prefetch') || purpose === 'prefetch' || secPurpose === 'prefetch';
}

function countryToRegion(countryCode: string | null): Region | null {
  if (!countryCode) return null;
  const country = countryCode.toUpperCase();
  if (country === 'AE') return 'dubai';
  if (country === 'IN') return 'india';
  return null;
}

function regionToPath(region: Region): '/india' | '/dubai' {
  return region === 'dubai' ? '/dubai' : '/india';
}

function logDev(message: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.info(`[region-middleware] ${message}`);
  }
}

export function middleware(request: NextRequest) {
  if (request.method !== 'GET') return NextResponse.next();
  if (isPrefetchRequest(request)) return NextResponse.next();

  const userAgent = request.headers.get('user-agent') ?? '';
  if (BOT_UA_PATTERN.test(userAgent)) return NextResponse.next();

  const pathname = request.nextUrl.pathname;
  if (pathname !== '/') return NextResponse.next();

  const cookieRegion = request.cookies.get(REGION_COOKIE)?.value?.toLowerCase();
  if (cookieRegion === 'india' || cookieRegion === 'dubai') {
    const redirectTo = regionToPath(cookieRegion);
    const url = request.nextUrl.clone();
    url.pathname = redirectTo;
    const response = NextResponse.redirect(url);
    response.cookies.set({
      name: REGION_COOKIE,
      value: cookieRegion,
      maxAge: COOKIE_MAX_AGE_SECONDS,
      path: '/',
      sameSite: 'lax',
      secure: request.nextUrl.protocol === 'https:'
    });
    return response;
  }

  const detectedRegion = countryToRegion(request.headers.get('x-vercel-ip-country'));
  if (!detectedRegion) {
    logDev('No redirect. Missing/unsupported x-vercel-ip-country header.');
    return NextResponse.next();
  }

  const redirectTo = regionToPath(detectedRegion);
  const url = request.nextUrl.clone();
  url.pathname = redirectTo;

  logDev(`Detected ${request.headers.get('x-vercel-ip-country')} -> redirecting to ${redirectTo}`);

  const response = NextResponse.redirect(url);
  response.cookies.set({
    name: REGION_COOKIE,
    value: detectedRegion,
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: '/',
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:'
  });
  return response;
}

export const config = {
  matcher: ['/']
};
