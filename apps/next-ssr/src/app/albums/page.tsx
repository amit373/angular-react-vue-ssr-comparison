import type { Metadata } from 'next';
import Link from 'next/link';
import { getAlbums } from '@ssr-comparison/api';
import { generateCanonicalUrl, generateBreadcrumbs } from '@ssr-comparison/utils';
import { getRequestOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return {
    title: 'Albums - SSR Comparison Suite',
    description: 'Browse all albums from JSONPlaceholder API',
    openGraph: {
      title: 'Albums - SSR Comparison Suite',
      description: 'Browse all albums from JSONPlaceholder API',
      type: 'website',
    },
    alternates: {
      canonical: generateCanonicalUrl('/albums', origin),
    },
  };
}

export default async function AlbumsPage() {
  const origin = await getRequestOrigin();
  const albums = await getAlbums();

  const breadcrumbs = generateBreadcrumbs([
    { label: 'Home', href: `${origin}/` },
    { label: 'Albums', href: `${origin}/albums` },
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
            <li className="text-foreground">Albums</li>
          </ol>
        </nav>

        <h1 className="mb-8 text-4xl font-bold">Albums</h1>
        <p className="mb-8 text-muted-foreground">
          Total: {albums.length} albums
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/albums/${album.id}`}
              className="group rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">
                {album.title}
              </h2>
              <div className="mt-4 text-xs text-muted-foreground">
                Album #{album.id} • User {album.userId}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

