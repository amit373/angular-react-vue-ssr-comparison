import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getUser, getAlbumsByUserId, getTodosByUserId } from '@ssr-comparison/api';
import { generateCanonicalUrl, generateBreadcrumbs } from '@ssr-comparison/utils';
import { getRequestOrigin } from '@/lib/seo';

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: UserPageProps): Promise<Metadata> {
  const origin = await getRequestOrigin();
  const { id } = await params;
  const user = await getUser(Number(id)).catch(() => null);

  if (!user) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: `${user.name} - SSR Comparison Suite`,
    description: `Profile of ${user.name} (${user.username})`,
    openGraph: {
      title: user.name,
      description: `Profile of ${user.name} (${user.username})`,
      type: 'profile',
    },
    alternates: {
      canonical: generateCanonicalUrl(`/users/${id}`, origin),
    },
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const origin = await getRequestOrigin();
  const { id } = await params;
  const userId = Number(id);

  const [user, albums, todos] = await Promise.all([
    getUser(userId).catch(() => null),
    getAlbumsByUserId(userId),
    getTodosByUserId(userId),
  ]);

  if (!user) {
    notFound();
  }

  const breadcrumbs = generateBreadcrumbs([
    { label: 'Home', href: `${origin}/` },
    { label: 'Users', href: `${origin}/users` },
    { label: user.name, href: `${origin}/users/${id}` },
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: user.name,
    email: user.email,
    jobTitle: user.company.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: user.address.street,
      addressLocality: user.address.city,
      postalCode: user.address.zipcode,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              <Link href="/users" className="hover:text-foreground">
                Users
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{user.name}</li>
          </ol>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">{user.name}</h1>
          <p className="text-lg text-muted-foreground">@{user.username}</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Contact Information</h2>
            <div className="space-y-2 rounded-lg border bg-card p-6">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone}
              </p>
              <p>
                <strong>Website:</strong>{' '}
                <a
                  href={`https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {user.website}
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Address</h2>
            <div className="space-y-2 rounded-lg border bg-card p-6">
              <p>{user.address.street}</p>
              <p>{user.address.suite}</p>
              <p>
                {user.address.city}, {user.address.zipcode}
              </p>
            </div>
          </section>
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">Company</h2>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-xl font-semibold">{user.company.name}</h3>
            <p className="mt-2 text-muted-foreground">
              {user.company.catchPhrase}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.company.bs}
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">
            Albums ({albums.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/albums/${album.id}`}
                className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-lg"
              >
                <h3 className="font-semibold">{album.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">
            Todos ({todos.length})
          </h2>
          <div className="space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 rounded-lg border bg-card p-4"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  readOnly
                  className="h-5 w-5"
                  aria-label={todo.completed ? 'Completed' : 'Not completed'}
                />
                <span
                  className={todo.completed ? 'line-through text-muted-foreground' : ''}
                >
                  {todo.title}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

