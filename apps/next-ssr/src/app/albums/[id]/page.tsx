import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAlbum, getPhotosByAlbumId } from '@ssr-comparison/api';
import { generateCanonicalUrl, generateBreadcrumbs } from '@ssr-comparison/utils';
import { getRequestOrigin } from '@/lib/seo';

interface AlbumPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AlbumPageProps): Promise<Metadata> {
  const origin = await getRequestOrigin();
  const { id } = await params;
  const album = await getAlbum(Number(id)).catch(() => null);

  if (!album) {
    return {
      title: 'Album Not Found',
    };
  }

  return {
    title: `${album.title} - SSR Comparison Suite`,
    description: `Album: ${album.title}`,
    openGraph: {
      title: album.title,
      description: `Album: ${album.title}`,
      type: 'website',
    },
    alternates: {
      canonical: generateCanonicalUrl(`/albums/${id}`, origin),
    },
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const origin = await getRequestOrigin();
  const { id } = await params;
  const albumId = Number(id);

  const [album, photos] = await Promise.all([
    getAlbum(albumId).catch(() => null),
    getPhotosByAlbumId(albumId),
  ]);

  if (!album) {
    notFound();
  }

  const breadcrumbs = generateBreadcrumbs([
    { label: 'Home', href: `${origin}/` },
    { label: 'Albums', href: `${origin}/albums` },
    { label: album.title, href: `${origin}/albums/${id}` },
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
            <li>
              <Link href="/albums" className="hover:text-foreground">
                Albums
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">Album #{id}</li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">{album.title}</h1>
          <p className="text-muted-foreground">
            Album #{album.id} • User {album.userId} • {photos.length} photos
          </p>
        </div>

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
      </div>
    </>
  );
}

