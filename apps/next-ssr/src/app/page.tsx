import type { Metadata } from 'next';
import { getPosts, getUsers, getAlbums } from '@ssr-comparison/api';
import { MetricsDashboard } from '@/components/metrics-dashboard';
import { generateCanonicalUrl, getDynamicFrameworkMetrics } from '@ssr-comparison/utils';
import { getRequestOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();

  return {
    title: 'SSR Comparison Suite - Next.js',
    description:
      'Production-ready Server-Side Rendering comparison between Next.js 16, Angular 21, and Nuxt 4.2',
    openGraph: {
      title: 'SSR Comparison Suite',
      description:
        'Production-ready Server-Side Rendering comparison between Next.js 16, Angular 21, and Nuxt 4.2',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SSR Comparison Suite',
      description:
        'Production-ready Server-Side Rendering comparison between Next.js 16, Angular 21, and Nuxt 4.2',
    },
    alternates: {
      canonical: generateCanonicalUrl('/', origin),
    },
  };
}

export default async function HomePage() {
  const origin = await getRequestOrigin();

  const [posts, users, albums] = await Promise.all([
    getPosts(),
    getUsers(),
    getAlbums(),
  ]);

  const metrics = getDynamicFrameworkMetrics('nextjs');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SSR Comparison Suite',
    description:
      'Production-ready Server-Side Rendering comparison between Next.js 16, Angular 21, and Nuxt 4.2',
    url: origin,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">SSR Comparison Suite</h1>
          <p className="text-xl text-muted-foreground">
            Next.js 16 - Production-Ready Server-Side Rendering
          </p>
        </div>

        <MetricsDashboard framework="nextjs" metrics={metrics} />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-2xl font-semibold">{posts.length}</h2>
            <p className="text-muted-foreground">Posts</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-2xl font-semibold">{users.length}</h2>
            <p className="text-muted-foreground">Users</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-2 text-2xl font-semibold">{albums.length}</h2>
            <p className="text-muted-foreground">Albums</p>
          </div>
        </div>
      </div>
    </>
  );
}

