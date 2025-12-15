import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPhotos } from '@ssr-comparison/api';
import { generateCanonicalUrl, generateBreadcrumbs, paginate } from '@ssr-comparison/utils';
import { getRequestOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return {
    title: 'Photos - SSR Comparison Suite',
    description: 'Browse photos from JSONPlaceholder API',
    openGraph: {
      title: 'Photos - SSR Comparison Suite',
      description: 'Browse photos from JSONPlaceholder API',
      type: 'website',
    },
    alternates: {
      canonical: generateCanonicalUrl('/photos', origin),
    },
  };
}

interface PhotosPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PhotosPage({ searchParams }: PhotosPageProps) {
  const origin = await getRequestOrigin();
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 20;

  const allPhotos = await getPhotos();
  const { data: photos, totalPages } = paginate(allPhotos, page, limit);

  const breadcrumbs = generateBreadcrumbs([
    { label: 'Home', href: `${origin}/` },
    { label: 'Photos', href: `${origin}/photos` },
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
            <li className="text-foreground">Photos</li>
          </ol>
        </nav>

        <h1 className="mb-8 text-4xl font-bold">Photos</h1>
        <p className="mb-8 text-muted-foreground">
          Page {page} of {totalPages} • Total: {allPhotos.length} photos
        </p>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-lg border bg-card"
            >
              <Image
                src={photo.thumbnailUrl}
                alt={photo.title}
                width={150}
                height={150}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-xs text-white">{photo.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          {page > 1 && (
            <Link
              href={`/photos?page=${page - 1}`}
              className="rounded-md border bg-card px-4 py-2 hover:bg-accent"
            >
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={`/photos?page=${page + 1}`}
              className="rounded-md border bg-card px-4 py-2 hover:bg-accent"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

