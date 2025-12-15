import { getAlbums, getPosts, getUsers } from '@ssr-comparison/api';
import { getDynamicFrameworkMetrics } from '@ssr-comparison/utils';

export type HomeResolvedData = {
  postsCount: number;
  usersCount: number;
  albumsCount: number;
  metrics: ReturnType<typeof getDynamicFrameworkMetrics>;
};

export const homeResolver = async (): Promise<HomeResolvedData> => {
  const [posts, users, albums] = await Promise.all([getPosts(), getUsers(), getAlbums()]);

  return {
    postsCount: posts.length,
    usersCount: users.length,
    albumsCount: albums.length,
    metrics: getDynamicFrameworkMetrics('angular'),
  };
};
