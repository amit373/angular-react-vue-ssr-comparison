import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts } from '@ssr-comparison/api';
import { generateCanonicalUrl, DEFAULT_INFINITE_LIMIT, encodeCursor } from '@ssr-comparison/utils';
import { generateBreadcrumbs } from '@ssr-comparison/utils';
import { InfinitePosts } from '@/components/infinite-posts';
import { getRequestOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return {
    title: 'Posts - SSR Comparison Suite',
    description: 'Browse all posts from JSONPlaceholder API',
    openGraph: {
      title: 'Posts - SSR Comparison Suite',
      description: 'Browse all posts from JSONPlaceholder API',
      type: 'website',
    },
    alternates: {
      canonical: generateCanonicalUrl('/posts', origin),
    },
  };
}

export default async function PostsPage() {
  const origin = await getRequestOrigin();

  const posts = await getPosts();
  const total = posts.length;
  const limit = DEFAULT_INFINITE_LIMIT;
  const totalPages = Math.ceil(total / limit);
  const data = posts.slice(0, limit);
  const nextCursor = 2 <= totalPages ? encodeCursor(2) : null;

  const initial = {
    data,
    total,
    page: 1,
    limit,
    totalPages,
    nextCursor,
  };

  const breadcrumbs = generateBreadcrumbs([
    { label: 'Home', href: `${origin}/` },
    { label: 'Posts', href: `${origin}/posts` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="container mx-auto px-4 py-12">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">Posts</li>
          </ol>
        </nav>

        <h1 className="mb-8 text-4xl font-bold">Posts</h1>
        <p className="mb-8 text-muted-foreground">Total: {initial.total} posts</p>

        <InfinitePosts initial={initial} />
      </div>
    </>
  );
}

