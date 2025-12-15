import type { Metadata } from 'next';
import Link from 'next/link';
import { getUsers } from '@ssr-comparison/api';
import { generateCanonicalUrl, generateBreadcrumbs } from '@ssr-comparison/utils';
import { getRequestOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return {
    title: 'Users - SSR Comparison Suite',
    description: 'Browse all users from JSONPlaceholder API',
    openGraph: {
      title: 'Users - SSR Comparison Suite',
      description: 'Browse all users from JSONPlaceholder API',
      type: 'website',
    },
    alternates: {
      canonical: generateCanonicalUrl('/users', origin),
    },
  };
}

export default async function UsersPage() {
  const origin = await getRequestOrigin();
  const users = await getUsers();

  const breadcrumbs = generateBreadcrumbs([
    { label: 'Home', href: `${origin}/` },
    { label: 'Users', href: `${origin}/users` },
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
            <li className="text-foreground">Users</li>
          </ol>
        </nav>

        <h1 className="mb-8 text-4xl font-bold">Users</h1>
        <p className="mb-8 text-muted-foreground">
          Total: {users.length} users
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/users/${user.id}`}
              className="group rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">
                {user.name}
              </h2>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                {user.company.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

