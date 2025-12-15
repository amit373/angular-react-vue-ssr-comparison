import type { NextRequest } from 'next/server';
import { getPosts } from '@ssr-comparison/api';
import {
  DEFAULT_INFINITE_LIMIT,
  decodeCursor,
  encodeCursor,
  parseLimitParam,
  parsePageParam,
} from '@ssr-comparison/utils';

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const limit = parseLimitParam(
    request.nextUrl.searchParams.get('limit'),
    DEFAULT_INFINITE_LIMIT
  );

  const cursor = request.nextUrl.searchParams.get('cursor');
  const cursorPage = decodeCursor(cursor);
  const page = cursorPage ?? parsePageParam(request.nextUrl.searchParams.get('page'), 1);

  const posts = await getPosts();

  const total = posts.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;

  const data = posts.slice(start, end);

  const nextPage = page + 1;
  const hasNext = nextPage <= totalPages;

  return Response.json(
    {
      data,
      total,
      page,
      limit,
      totalPages,
      nextCursor: hasNext ? encodeCursor(nextPage) : null,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}
