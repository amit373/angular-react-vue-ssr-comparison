import { getPosts } from '@ssr-comparison/api';
import {
  DEFAULT_INFINITE_LIMIT,
  decodeCursor,
  encodeCursor,
  parseLimitParam,
  parsePageParam,
} from '@ssr-comparison/utils';

export default defineCachedEventHandler(
  async (event) => {
    const q = getQuery(event);

    const limit = parseLimitParam(q.limit, DEFAULT_INFINITE_LIMIT);
    const cursorPage = decodeCursor(typeof q.cursor === 'string' ? q.cursor : null);
    const page = cursorPage ?? parsePageParam(q.page, 1);

    const posts = await getPosts();

    const total = posts.length;
    const totalPages = Math.ceil(total / limit);

    const start = (page - 1) * limit;
    const end = start + limit;

    const data = posts.slice(start, end);

    const nextPage = page + 1;
    const hasNext = nextPage <= totalPages;

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      nextCursor: hasNext ? encodeCursor(nextPage) : null,
    };
  },
  {
    maxAge: 60,
    staleMaxAge: 300,
    name: 'posts',
  }
);
