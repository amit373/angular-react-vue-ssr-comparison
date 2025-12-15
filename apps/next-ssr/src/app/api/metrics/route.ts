import type { NextRequest } from 'next/server';
import { getDynamicFrameworkMetrics } from '@ssr-comparison/utils';

export const revalidate = 60;

export function GET(request: NextRequest) {
  const framework = (request.nextUrl.searchParams.get('framework') ?? 'nextjs') as
    | 'nextjs'
    | 'angular'
    | 'nuxt';

  const metrics = getDynamicFrameworkMetrics(framework);

  return Response.json(metrics, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
