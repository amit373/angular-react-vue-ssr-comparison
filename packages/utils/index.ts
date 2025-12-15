import type { FrameworkMetrics } from '@ssr-comparison/types';

export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Formatting utilities
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

// URL utilities
export const getPostUrl = (id: number): string => `/posts/${id}`;
export const getUserUrl = (id: number): string => `/users/${id}`;
export const getAlbumUrl = (id: number): string => `/albums/${id}`;

// Pagination utilities
export const paginate = <T>(array: T[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: array.slice(start, end),
    total: array.length,
    page,
    limit,
    totalPages: Math.ceil(array.length / limit),
  };
};

export type PaginationCursor = string;

export const DEFAULT_INFINITE_LIMIT = 8;

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

export const parsePageParam = (value: unknown, fallback = 1): number => {
  const n = typeof value === 'string' ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export const parseLimitParam = (
  value: unknown,
  fallback = DEFAULT_INFINITE_LIMIT,
  max = 50
): number => {
  const n = typeof value === 'string' ? Number.parseInt(value, 10) : Number.NaN;
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return clamp(n, 1, max);
};

 const base64UrlEncode = (input: string): string => {
   const g = globalThis as unknown as {
     Buffer?: { from: (data: string, encoding: 'utf8') => { toString: (enc: 'base64url' | 'base64') => string } };
     btoa?: (data: string) => string;
   };

   if (g.Buffer) return g.Buffer.from(input, 'utf8').toString('base64url');

   const b64 = (g.btoa ? g.btoa(input) : '')
     .replace(/\+/g, '-')
     .replace(/\//g, '_')
     .replace(/=+$/g, '');
   return b64;
 };

 const base64UrlDecode = (input: string): string => {
   const g = globalThis as unknown as {
     Buffer?: { from: (data: string, encoding: 'base64url' | 'base64') => { toString: (enc: 'utf8') => string } };
     atob?: (data: string) => string;
   };

   if (g.Buffer) return g.Buffer.from(input, 'base64url').toString('utf8');

   const padded = input
     .replace(/-/g, '+')
     .replace(/_/g, '/')
     .padEnd(Math.ceil(input.length / 4) * 4, '=');
   return g.atob ? g.atob(padded) : '';
 };

export const encodeCursor = (page: number): PaginationCursor => {
  return base64UrlEncode(JSON.stringify({ page }));
};

export const decodeCursor = (cursor: PaginationCursor | null | undefined): number | null => {
  if (!cursor) return null;
  try {
    const decoded = JSON.parse(base64UrlDecode(cursor)) as {
      page?: unknown;
    };
    const page = typeof decoded.page === 'number' ? decoded.page : Number.NaN;
    return Number.isFinite(page) && page > 0 ? page : null;
  } catch {
    return null;
  }
};

// Error handling
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export type FetchClientOptions = {
  baseUrl?: string;
  retries?: number;
  timeoutMs?: number;
  headers?: Record<string, string>;
};

export type FetchJsonOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: unknown;
};

export const fetchJson = async <T>(
  input: string,
  options: FetchJsonOptions & FetchClientOptions = {}
): Promise<T> => {
  const {
    baseUrl,
    retries = MAX_RETRIES,
    timeoutMs = 10_000,
    headers,
    method = 'GET',
    body,
    signal,
    cache,
    next,
  } = options;

  const url = baseUrl ? new URL(input, baseUrl).toString() : input;

  const attempt = async (remaining: number): Promise<T> => {
    const AbortControllerImpl = (globalThis as unknown as { AbortController?: new () => { abort: () => void; signal: AbortSignal } })
      .AbortController;
    const controller = AbortControllerImpl ? new AbortControllerImpl() : null;
    const timeout = controller
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(headers ?? {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller?.signal ?? signal,
        cache,
        ...(next ? ({ next } as Record<string, unknown>) : {}),
      });

      if (!response.ok) {
        throw new APIError(`API Error: ${response.statusText}`, response.status, response.statusText);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (remaining > 0) {
        await new Promise((r) => setTimeout(r, 250));
        return attempt(remaining - 1);
      }
      throw error;
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  };

  return attempt(retries);
};

export const createFetchClient = (clientOptions: FetchClientOptions = {}) => {
  return {
    json: <T>(path: string, options: FetchJsonOptions = {}) =>
      fetchJson<T>(path, { ...clientOptions, ...options }),
  };
};

export type ObserveIntersectionOptions = {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export const observeIntersection = (
  element: Element | null,
  onIntersect: (entry: IntersectionObserverEntry) => void,
  options: ObserveIntersectionOptions = {}
): (() => void) => {
  if (!element) return () => {};
  if (typeof IntersectionObserver === 'undefined') return () => {};

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) onIntersect(entry);
    }
  }, options);

  observer.observe(element);
  return () => observer.disconnect();
};

const seeded = (seed: number): number => {
  const x = Math.sin(seed) * 10_000;
  return x - Math.floor(x);
};

export const getDynamicFrameworkMetrics = (
  framework: FrameworkMetrics['framework'],
  now = new Date()
): FrameworkMetrics => {
  const minuteBucket = Math.floor(now.getTime() / 60_000);
  let base = 41;
  if (framework === 'nextjs') base = 17;
  if (framework === 'angular') base = 29;

  const r1 = seeded(minuteBucket + base * 1);
  const r2 = seeded(minuteBucket + base * 2);
  const r3 = seeded(minuteBucket + base * 3);
  const r4 = seeded(minuteBucket + base * 4);
  const r5 = seeded(minuteBucket + base * 5);
  const r6 = seeded(minuteBucket + base * 6);
  const r7 = seeded(minuteBucket + base * 7);

  const ttfb = 60 + r1 * 180;
  const fcp = 700 + r2 * 1000;
  const lcp = 1100 + r3 * 1600;
  const seoScore = clamp(92 + r4 * 8, 0, 100);
  const bundleSize = 140 + r5 * 260;
  const hydrationTime = 40 + r6 * 140;
  const serverCpuUsage = 8 + r7 * 35;

  return {
    framework,
    ttfb,
    fcp,
    lcp,
    seoScore,
    bundleSize,
    hydrationTime,
    serverCpuUsage,
  };
};

// Cache utilities
export const getCacheKey = (resource: string, id?: number): string => {
  return id ? `${resource}:${id}` : resource;
};

// Constants
export const PAGE_SIZE = 20;
export const MAX_RETRIES = 3;
export const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// SEO utilities
export const generateCanonicalUrl = (path: string, baseUrl: string): string => {
  return `${baseUrl}${path}`;
};

export const generateBreadcrumbs = (
  items: Array<{ label: string; href: string }>
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href,
    })),
  };
};

