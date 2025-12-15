import type { Metadata } from 'next';
import Link from 'next/link';
import { generateCanonicalUrl, generateBreadcrumbs } from '@ssr-comparison/utils';
import { getRequestOrigin } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getRequestOrigin();
  return {
    title: 'About - SSR Comparison Suite',
    description:
      'Learn about the SSR comparison project and technology stack comparison',
    openGraph: {
      title: 'About - SSR Comparison Suite',
      description:
        'Learn about the SSR comparison project and technology stack comparison',
      type: 'website',
    },
    alternates: {
      canonical: generateCanonicalUrl('/about', origin),
    },
  };
}

export default async function AboutPage() {
  const origin = await getRequestOrigin();
  const breadcrumbs = generateBreadcrumbs([
    { label: 'Home', href: `${origin}/` },
    { label: 'About', href: `${origin}/about` },
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
            <li className="text-foreground">About</li>
          </ol>
        </nav>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="mb-8 text-4xl font-bold">About This Project</h1>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Project Overview</h2>
            <p className="mb-4">
              This is a comprehensive Server-Side Rendering (SSR) comparison
              suite that demonstrates production-ready implementations of three
              leading frameworks:
            </p>
            <ul className="list-disc pl-6">
              <li>
                <strong>Next.js 16</strong> - React-based framework with App
                Router
              </li>
              <li>
                <strong>Angular 21</strong> - Full-featured framework with SSR
                support
              </li>
              <li>
                <strong>Nuxt 4.2</strong> - Vue.js framework with full SSR mode
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Key Features</h2>
            <ul className="list-disc pl-6">
              <li>100% Server-Side Rendering (no client-side fetching)</li>
              <li>SEO optimized with meta tags, OpenGraph, and JSON-LD</li>
              <li>Dark mode support</li>
              <li>Fully responsive design</li>
              <li>WCAG 2.2 AA accessibility compliance</li>
              <li>Performance optimized with caching strategies</li>
              <li>Error handling and fallback UI</li>
              <li>Comprehensive testing setup</li>
              <li>Docker support for containerization</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold">Technology Stack</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 text-xl font-semibold">Frameworks</h3>
                <ul className="text-sm text-muted-foreground">
                  <li>Next.js 16</li>
                  <li>Angular 21</li>
                  <li>Nuxt 4.2</li>
                </ul>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 text-xl font-semibold">Styling</h3>
                <ul className="text-sm text-muted-foreground">
                  <li>Tailwind CSS v4</li>
                  <li>CSS Variables</li>
                  <li>Responsive Design</li>
                </ul>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-2 text-xl font-semibold">Tools</h3>
                <ul className="text-sm text-muted-foreground">
                  <li>TypeScript 5+</li>
                  <li>Turborepo</li>
                  <li>PNPM</li>
                  <li>Vitest</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Data Source</h2>
            <p className="mb-4">
              All data is fetched from{' '}
              <a
                href="https://jsonplaceholder.typicode.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                JSONPlaceholder
              </a>
              , a free fake REST API for testing and prototyping.
            </p>
          </section>
        </article>
      </div>
    </>
  );
}

