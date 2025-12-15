import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost, getCommentsByPostId } from '@ssr-comparison/api';
import { generateCanonicalUrl, generateBreadcrumbs } from '@ssr-comparison/utils';
import { getRequestOrigin } from '@/lib/seo';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const origin = await getRequestOrigin();
  const { id } = await params;
  const post = await getPost(Number(id)).catch(() => null);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - SSR Comparison Suite`,
    description: post.body,
    openGraph: {
      title: post.title,
      description: post.body,
      type: 'article',
    },
    alternates: {
      canonical: generateCanonicalUrl(`/posts/${id}`, origin),
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const origin = await getRequestOrigin();
  const { id } = await params;
  const postId = Number(id);

  const [post, comments] = await Promise.all([
    getPost(postId).catch(() => null),
    getCommentsByPostId(postId),
  ]);

  if (!post) {
    notFound();
  }

  const breadcrumbs = generateBreadcrumbs([
    { label: 'Home', href: `${origin}/` },
    { label: 'Posts', href: `${origin}/posts` },
    { label: post.title, href: `${origin}/posts/${id}` },
  ]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.body,
    author: {
      '@type': 'Person',
      name: `User ${post.userId}`,
    },
    datePublished: new Date().toISOString(),
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
              <Link href="/posts" className="hover:text-foreground">
                Posts
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">Post #{id}</li>
          </ol>
        </nav>

        <article>
          <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
          <div className="mb-8 text-sm text-muted-foreground">
            Post #{post.id} • User {post.userId}
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed">{post.body}</p>
          </div>
        </article>

        <section className="mt-12">
          <h2 className="mb-6 text-2xl font-semibold">
            Comments ({comments.length})
          </h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border bg-card p-6"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold">{comment.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    {comment.email}
                  </span>
                </div>
                <p className="text-muted-foreground">{comment.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

