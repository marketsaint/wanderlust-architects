import 'server-only';
import fs from 'fs';
import path from 'path';

const CSV_PATH = path.join(process.cwd(), 'wanderlust_images.csv');

let cache = null;

function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function parseCsv(content) {
  const lines = content
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (!lines.length) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i]);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = (values[index] || '').trim();
    });

    rows.push(row);
  }

  return rows;
}

function removeQuery(url) {
  const base = (url || '').split('?')[0].trim();
  return base;
}

function normalizeUrl(url) {
  const cleaned = removeQuery(url);
  if (!cleaned) return '';

  try {
    const parsed = new URL(cleaned);
    parsed.protocol = parsed.protocol.toLowerCase();
    parsed.hostname = parsed.hostname.toLowerCase();
    return parsed.toString();
  } catch {
    return cleaned;
  }
}

function getExtension(url) {
  const match = url.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match ? match[1] : '';
}

function stripSizeSuffix(url) {
  return url.replace(/-\d{2,5}x\d{2,5}(?=\.[a-z0-9]+$)/i, '');
}

function hasSizedPattern(url) {
  return /-\d{2,5}x\d{2,5}(?=\.[a-z0-9]+$)/i.test(url);
}

function hasScaledToken(url) {
  return /-scaled(?=\.[a-z0-9]+$)/i.test(url);
}

function scoreVariant(url, groupHasUnsized, hasScaledInGroup) {
  const ext = getExtension(url);
  const sized = hasSizedPattern(url);
  const scaled = hasScaledToken(url);

  let score = 0;

  if (!sized) score += 100;
  if (scaled) score += 35;

  if (groupHasUnsized && sized) score -= 60;
  if (!groupHasUnsized && hasScaledInGroup && !scaled) score -= 15;

  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') score += 18;
  if (ext === 'webp') score += groupHasUnsized ? -8 : 6;

  score += Math.min(url.length, 300) / 300;

  return score;
}

function buildCanonicalItem(row, url) {
  return {
    url,
    pageUrl: row.pageUrl || '',
    pageType: row.pageType || 'page',
    serviceOrCategory: row.serviceOrCategory || 'general',
    contentHint: row.contentHint || '',
    altOrTitle: row.altOrTitle || '',
    foundIn: row.foundIn || ''
  };
}

function buildDataset() {
  if (cache) return cache;

  if (!fs.existsSync(CSV_PATH)) {
    cache = { allUnique: [], byPage: {}, byType: {}, byServiceHint: {} };
    return cache;
  }

  const raw = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parseCsv(raw).filter((row) => row.imageUrl);

  const groups = new Map();

  for (const row of rows) {
    const normalized = normalizeUrl(row.imageUrl);
    if (!normalized) continue;

    const groupKey = stripSizeSuffix(normalized).toLowerCase();
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey).push({ row, normalized });
  }

  const selected = [];

  for (const entries of groups.values()) {
    const urls = entries.map((entry) => entry.normalized);
    const groupHasUnsized = urls.some((url) => !hasSizedPattern(url));
    const hasScaledInGroup = urls.some((url) => hasScaledToken(url));

    let best = null;
    let bestScore = -Infinity;

    for (const entry of entries) {
      const score = scoreVariant(entry.normalized, groupHasUnsized, hasScaledInGroup);
      if (score > bestScore) {
        best = entry;
        bestScore = score;
      }
    }

    if (best) selected.push(buildCanonicalItem(best.row, best.normalized));
  }

  const dedupedMap = new Map();
  for (const item of selected) {
    if (!dedupedMap.has(item.url)) dedupedMap.set(item.url, item);
  }
  const allUnique = [...dedupedMap.values()];

  const byPage = {};
  const byType = {};
  const byServiceHint = {};

  for (const item of allUnique) {
    if (!byPage[item.pageUrl]) byPage[item.pageUrl] = [];
    byPage[item.pageUrl].push(item);

    const typeKey = (item.pageType || 'page').toLowerCase();
    if (!byType[typeKey]) byType[typeKey] = [];
    byType[typeKey].push(item);

    const hintKeys = [item.serviceOrCategory, item.contentHint]
      .filter(Boolean)
      .map((value) => value.toLowerCase());

    for (const key of hintKeys) {
      if (!byServiceHint[key]) byServiceHint[key] = [];
      byServiceHint[key].push(item);
    }
  }

  cache = { allUnique, byPage, byType, byServiceHint };
  return cache;
}

function rankByHint(item, hints) {
  const hay = `${item.pageUrl} ${item.pageType} ${item.serviceOrCategory} ${item.contentHint} ${item.altOrTitle}`.toLowerCase();
  let score = 0;

  for (const hint of hints) {
    const normalized = hint.toLowerCase();
    if (!normalized) continue;
    if (hay.includes(normalized)) score += 6;
    const tokens = normalized.split(/\s+/).filter(Boolean);
    score += tokens.filter((token) => hay.includes(token)).length;
  }

  return score;
}

function dedupeUrls(urls) {
  return [...new Set(urls.filter(Boolean))];
}

export function getImageDataset() {
  return buildDataset();
}

export function pickBestImageByHint(hints = []) {
  const dataset = buildDataset();
  if (!dataset.allUnique.length) return null;

  const scored = dataset.allUnique
    .map((item) => ({ item, score: rankByHint(item, hints) }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.item?.url || null;
}

export function pickBestImagesByType(pageType, limit = 12) {
  const dataset = buildDataset();
  const key = (pageType || '').toLowerCase();
  const list = dataset.byType[key] || [];
  return dedupeUrls(list.map((item) => item.url)).slice(0, limit);
}

export function pickBestImagesByService(serviceName, limit = 12) {
  const dataset = buildDataset();
  const terms = (serviceName || '').toLowerCase().split(/\s+/).filter(Boolean);

  const scored = dataset.allUnique
    .map((item) => ({ item, score: rankByHint(item, terms) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item.url);

  return dedupeUrls(scored).slice(0, limit);
}

export function getAllUniqueImages() {
  return buildDataset().allUnique.map((item) => item.url);
}

export function pickManyByHint(hints = [], limit = 12) {
  const dataset = buildDataset();
  const scored = dataset.allUnique
    .map((item) => ({ item, score: rankByHint(item, hints) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item.url);

  return dedupeUrls(scored).slice(0, limit);
}


