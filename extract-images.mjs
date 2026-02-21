#!/usr/bin/env node

import { writeFile } from 'node:fs/promises';
import { URL } from 'node:url';
import { XMLParser } from 'fast-xml-parser';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://wanderlustarchitects.com';
const SITEMAP_PATHS = ['/sitemap_index.xml', '/sitemap.xml', '/wp-sitemap.xml'];
const CONCURRENCY = Number(process.env.CRAWL_CONCURRENCY || 6);
const REQUEST_TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 0);
const USER_AGENT =
  'Mozilla/5.0 (compatible; WanderlustImageExtractor/1.0; +https://wanderlustarchitects.com)';

const parser = new XMLParser({
  ignoreAttributes: false,
  allowBooleanAttributes: true,
  parseTagValue: true,
  trimValues: true
});

function normalizeArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function ensureAbsoluteUrl(raw, base = BASE_URL) {
  if (!raw) return null;
  const cleaned = String(raw).trim().replace(/^['"]|['"]$/g, '');
  if (!cleaned || cleaned.startsWith('data:') || cleaned.startsWith('blob:')) return null;
  try {
    return new URL(cleaned, base).href;
  } catch {
    return null;
  }
}

function isLikelyImage(url) {
  return /\.(avif|webp|png|jpe?g|gif|svg|bmp|tiff?)(\?.*)?$/i.test(url);
}

function extractUrlsFromCss(cssText, base) {
  if (!cssText) return [];
  const matches = [...String(cssText).matchAll(/url\(([^)]+)\)/gi)];
  const urls = [];
  for (const match of matches) {
    const candidate = ensureAbsoluteUrl(match[1], base);
    if (candidate) urls.push(candidate);
  }
  return urls;
}

function parseSrcset(srcset, base) {
  if (!srcset) return [];
  const parts = String(srcset)
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  const urls = [];
  for (const part of parts) {
    const first = part.split(/\s+/)[0];
    const absolute = ensureAbsoluteUrl(first, base);
    if (absolute) urls.push(absolute);
  }
  return urls;
}

function classifyPageType(pageUrl) {
  const path = new URL(pageUrl).pathname.toLowerCase();
  if (path === '/' || path === '') return 'home';
  if (/about/.test(path)) return 'about';
  if (/projects?/.test(path)) return 'projects';
  if (/portfolio/.test(path)) return 'portfolio';
  if (/services?/.test(path)) return 'service';
  if (/blog|journal|news/.test(path)) return 'blog';
  if (/contact/.test(path)) return 'contact';
  if (/career|careers|jobs/.test(path)) return 'career';
  return 'page';
}

function extractServiceOrCategory(pageUrl) {
  const path = new URL(pageUrl).pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  if (!path) return 'home';
  const parts = path.split('/').filter(Boolean);

  const keywords = [
    'architecture',
    'interior',
    'landscape',
    'documentation',
    '3d-modelling',
    '3d-modeling',
    'service',
    'services',
    'project',
    'projects',
    'portfolio',
    'blog',
    'career',
    'contact'
  ];

  for (const part of parts) {
    if (keywords.some((k) => part.includes(k))) return part;
  }

  return parts[0] || 'general';
}

function slugToHint(slug) {
  if (!slug) return '';
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function extractContentHint(pageUrl, $, fallback = '') {
  const ogTitle = $('meta[property="og:title"]').attr('content');
  if (ogTitle) return ogTitle.trim();

  const heading = $('main h1, h1').first().text().trim();
  if (heading) return heading;

  const title = $('title').first().text().trim();
  if (title) return title;

  const path = new URL(pageUrl).pathname;
  const slug = path.split('/').filter(Boolean).pop();
  return fallback || slugToHint(slug) || 'Page Media';
}

function buildRow({
  pageUrl,
  pageType,
  serviceOrCategory,
  contentHint,
  imageUrl,
  altOrTitle,
  foundIn
}) {
  return {
    pageUrl,
    pageType,
    serviceOrCategory,
    contentHint,
    imageUrl,
    altOrTitle: altOrTitle || '',
    foundIn
  };
}

async function fetchWithRetry(url, { timeoutMs = REQUEST_TIMEOUT_MS, retries = MAX_RETRIES } = {}) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          'user-agent': USER_AGENT,
          accept: 'text/html,application/xml,text/xml;q=0.9,*/*;q=0.8'
        },
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = Number(response.headers.get('retry-after') || 0);
          const waitMs = Math.max(retryAfter * 1000, 1800 * (attempt + 1));
          if (attempt < retries) {
            await new Promise((resolve) => setTimeout(resolve, waitMs));
            continue;
          }
        }
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timer);
      lastError = error;

      if (attempt < retries) {
        const backoff = 350 * (attempt + 1);
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
  }

  throw lastError;
}

async function fetchText(url) {
  const response = await fetchWithRetry(url);
  return response.text();
}

async function discoverSitemapUrl() {
  for (const path of SITEMAP_PATHS) {
    const candidate = ensureAbsoluteUrl(path, BASE_URL);
    try {
      const response = await fetchWithRetry(candidate, { retries: 1 });
      const body = await response.text();
      if (body.includes('<urlset') || body.includes('<sitemapindex')) {
        console.log(`[sitemap] Using ${candidate}`);
        return candidate;
      }
    } catch (error) {
      console.warn(`[sitemap] Failed ${candidate}: ${error.message}`);
    }
  }
  throw new Error('No sitemap endpoint succeeded.');
}

function extractLocNodes(parsedXml) {
  const urlset = parsedXml?.urlset;
  const sitemapindex = parsedXml?.sitemapindex;

  if (urlset) {
    const urls = normalizeArray(urlset.url).map((entry) => entry?.loc).filter(Boolean);
    return { type: 'urlset', urls, childSitemaps: [] };
  }

  if (sitemapindex) {
    const childSitemaps = normalizeArray(sitemapindex.sitemap)
      .map((entry) => entry?.loc)
      .filter(Boolean);
    return { type: 'sitemapindex', urls: [], childSitemaps };
  }

  return { type: 'unknown', urls: [], childSitemaps: [] };
}

async function collectAllPageUrls(initialSitemapUrl) {
  const visitedSitemaps = new Set();
  const queue = [initialSitemapUrl];
  const pageUrls = new Set();

  while (queue.length) {
    const sitemapUrl = queue.shift();
    if (!sitemapUrl || visitedSitemaps.has(sitemapUrl)) continue;

    visitedSitemaps.add(sitemapUrl);

    try {
      const xmlText = await fetchText(sitemapUrl);
      const parsed = parser.parse(xmlText);
      const { type, urls, childSitemaps } = extractLocNodes(parsed);

      if (type === 'urlset') {
        for (const page of urls) {
          const absolute = ensureAbsoluteUrl(page, BASE_URL);
          if (absolute && absolute.startsWith(BASE_URL)) {
            pageUrls.add(absolute);
          }
        }
      } else if (type === 'sitemapindex') {
        for (const child of childSitemaps) {
          const absolute = ensureAbsoluteUrl(child, BASE_URL);
          if (absolute) queue.push(absolute);
        }
      } else {
        console.warn(`[sitemap] Unrecognized XML structure at ${sitemapUrl}`);
      }
    } catch (error) {
      console.warn(`[sitemap] Error parsing ${sitemapUrl}: ${error.message}`);
    }
  }

  if (!pageUrls.size) {
    pageUrls.add(BASE_URL);
  }

  return [...pageUrls];
}

function uniqueRows(rows) {
  const seen = new Set();
  const deduped = [];

  for (const row of rows) {
    const key = `${row.pageUrl}||${row.imageUrl}||${row.foundIn}||${row.altOrTitle}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(row);
  }

  return deduped;
}

async function extractImagesFromPage(pageUrl) {
  const rows = [];

  try {
    const html = await fetchText(pageUrl);
    const $ = cheerio.load(html);

    const pageType = classifyPageType(pageUrl);
    const serviceOrCategory = extractServiceOrCategory(pageUrl);
    const pageHint = extractContentHint(pageUrl, $);

    $('img').each((_, el) => {
      const src = $(el).attr('src');
      const srcset = $(el).attr('srcset');
      const alt = $(el).attr('alt') || $(el).attr('title') || '';

      const srcAbs = ensureAbsoluteUrl(src, pageUrl);
      if (srcAbs) {
        rows.push(
          buildRow({
            pageUrl,
            pageType,
            serviceOrCategory,
            contentHint: pageHint,
            imageUrl: srcAbs,
            altOrTitle: alt,
            foundIn: 'img:src'
          })
        );
      }

      for (const srcsetUrl of parseSrcset(srcset, pageUrl)) {
        rows.push(
          buildRow({
            pageUrl,
            pageType,
            serviceOrCategory,
            contentHint: pageHint,
            imageUrl: srcsetUrl,
            altOrTitle: alt,
            foundIn: 'img:srcset'
          })
        );
      }
    });

    $('meta[property="og:image"], meta[name="twitter:image"], meta[property="twitter:image"]').each((_, el) => {
      const image = $(el).attr('content');
      const abs = ensureAbsoluteUrl(image, pageUrl);
      if (!abs) return;

      const foundIn = $(el).attr('property') === 'og:image' ? 'meta:og:image' : 'meta:twitter:image';
      rows.push(
        buildRow({
          pageUrl,
          pageType,
          serviceOrCategory,
          contentHint: pageHint,
          imageUrl: abs,
          altOrTitle: $('meta[property="og:title"]').attr('content') || pageHint,
          foundIn
        })
      );
    });

    $('[style]').each((_, el) => {
      const style = $(el).attr('style');
      const hint =
        $(el).attr('aria-label') ||
        $(el).attr('title') ||
        $(el).attr('alt') ||
        $(el).text().trim().slice(0, 80) ||
        pageHint;

      for (const cssUrl of extractUrlsFromCss(style, pageUrl)) {
        rows.push(
          buildRow({
            pageUrl,
            pageType,
            serviceOrCategory,
            contentHint: hint,
            imageUrl: cssUrl,
            altOrTitle: hint,
            foundIn: 'style:attr'
          })
        );
      }
    });

    $('style').each((_, el) => {
      const styleText = $(el).html();
      for (const cssUrl of extractUrlsFromCss(styleText, pageUrl)) {
        rows.push(
          buildRow({
            pageUrl,
            pageType,
            serviceOrCategory,
            contentHint: pageHint,
            imageUrl: cssUrl,
            altOrTitle: pageHint,
            foundIn: 'style:block'
          })
        );
      }
    });

    const filtered = rows.filter((row) => {
      if (!row.imageUrl) return false;
      if (row.imageUrl.includes('gravatar.com/avatar/')) return false;
      return isLikelyImage(row.imageUrl) || row.foundIn.startsWith('meta:');
    });

    return uniqueRows(filtered);
  } catch (error) {
    console.warn(`[page] Failed ${pageUrl}: ${error.message}`);
    return [];
  }
}

async function runWithConcurrency(items, worker, concurrency = CONCURRENCY) {
  const results = [];
  let current = 0;

  async function runWorker() {
    while (true) {
      const index = current;
      current += 1;
      if (index >= items.length) break;

      const item = items[index];
      if (REQUEST_DELAY_MS > 0) {
        await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
      }
      const res = await worker(item, index);
      results.push(...res);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker());
  await Promise.all(workers);
  return results;
}

function toCsv(rows) {
  const headers = [
    'pageUrl',
    'pageType',
    'serviceOrCategory',
    'contentHint',
    'imageUrl',
    'altOrTitle',
    'foundIn'
  ];

  const escape = (value) => {
    const str = String(value ?? '');
    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

async function main() {
  console.log('[start] Discovering sitemap...');
  const sitemapUrl = await discoverSitemapUrl();

  console.log('[start] Collecting URLs from sitemap(s)...');
  const pageUrls = await collectAllPageUrls(sitemapUrl);
  console.log(`[info] Found ${pageUrls.length} page URLs`);

  console.log(`[crawl] Crawling pages with concurrency=${CONCURRENCY}...`);
  const allRows = await runWithConcurrency(
    pageUrls,
    async (pageUrl, idx) => {
      console.log(`[crawl] (${idx + 1}/${pageUrls.length}) ${pageUrl}`);
      return extractImagesFromPage(pageUrl);
    },
    CONCURRENCY
  );

  const deduped = uniqueRows(allRows).sort((a, b) => {
    if (a.pageUrl === b.pageUrl) return a.imageUrl.localeCompare(b.imageUrl);
    return a.pageUrl.localeCompare(b.pageUrl);
  });

  await writeFile('wanderlust_images.json', `${JSON.stringify(deduped, null, 2)}\n`, 'utf8');
  await writeFile('wanderlust_images.csv', `${toCsv(deduped)}\n`, 'utf8');

  console.log(`[done] Extracted ${deduped.length} image rows`);
  console.log('[done] Wrote wanderlust_images.json and wanderlust_images.csv');
}

main().catch((error) => {
  console.error('[fatal]', error.message);
  process.exitCode = 1;
});
