import { getPosts } from '@ssr-comparison/api';
import {
  DEFAULT_INFINITE_LIMIT,
  encodeCursor,
} from '@ssr-comparison/utils';
import type { Post } from '@ssr-comparison/types';

export type PostsPageResponse = {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextCursor: string | null;
};

export const postsResolver = async (): Promise<PostsPageResponse> => {
  const limit = DEFAULT_INFINITE_LIMIT;
  const page = 1;

  const posts = await getPosts();
  const total = posts.length;
  const totalPages = Math.ceil(total / limit);

  const data = posts.slice(0, limit);
  const hasNext = 2 <= totalPages;

  return {
    data,
    total,
    page,
    limit,
    totalPages,
    nextCursor: hasNext ? encodeCursor(2) : null,
  };
};
