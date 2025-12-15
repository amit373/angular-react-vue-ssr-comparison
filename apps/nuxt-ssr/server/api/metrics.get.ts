import { getDynamicFrameworkMetrics } from '@ssr-comparison/utils';

export default defineCachedEventHandler(
  (event) => {
    const framework = (getQuery(event).framework ?? 'nuxt') as
      | 'nextjs'
      | 'angular'
      | 'nuxt';

    return getDynamicFrameworkMetrics(framework);
  },
  {
    maxAge: 60,
    staleMaxAge: 300,
    name: 'metrics',
  }
);
