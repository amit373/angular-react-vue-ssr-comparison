<template>
  <div class="container mx-auto px-4 py-12">
    <nav aria-label="Breadcrumb" class="mb-8">
      <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li class="text-foreground">About</li>
      </ol>
    </nav>

    <article class="prose prose-lg dark:prose-invert max-w-none">
      <h1 class="mb-8 text-4xl font-bold">About This Project</h1>

      <section class="mb-12">
        <h2 class="mb-4 text-2xl font-semibold">Project Overview</h2>
        <p class="mb-4">
          This is a comprehensive Server-Side Rendering (SSR) comparison suite
          that demonstrates production-ready implementations of three leading
          frameworks:
        </p>
        <ul class="list-disc pl-6">
          <li>
            <strong>Next.js 16</strong> - React-based framework with App Router
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

      <section class="mb-12">
        <h2 class="mb-4 text-2xl font-semibold">Key Features</h2>
        <ul class="list-disc pl-6">
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

      <section class="mb-12">
        <h2 class="mb-4 text-2xl font-semibold">Technology Stack</h2>
        <div class="grid gap-6 md:grid-cols-3">
          <div class="rounded-lg border bg-card p-6">
            <h3 class="mb-2 text-xl font-semibold">Frameworks</h3>
            <ul class="text-sm text-muted-foreground">
              <li>Next.js 16</li>
              <li>Angular 21</li>
              <li>Nuxt 4.2</li>
            </ul>
          </div>
          <div class="rounded-lg border bg-card p-6">
            <h3 class="mb-2 text-xl font-semibold">Styling</h3>
            <ul class="text-sm text-muted-foreground">
              <li>Tailwind CSS v4</li>
              <li>CSS Variables</li>
              <li>Responsive Design</li>
            </ul>
          </div>
          <div class="rounded-lg border bg-card p-6">
            <h3 class="mb-2 text-xl font-semibold">Tools</h3>
            <ul class="text-sm text-muted-foreground">
              <li>TypeScript 5+</li>
              <li>Turborepo</li>
              <li>PNPM</li>
              <li>Vitest</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 class="mb-4 text-2xl font-semibold">Data Source</h2>
        <p class="mb-4">
          All data is fetched from
          <a
            href="https://jsonplaceholder.typicode.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:underline"
          >
            JSONPlaceholder
          </a>
          , a free fake REST API for testing and prototyping.
        </p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
const origin = useSiteOrigin();
const canonical = computed(() => `${origin.value}/about`);
const breadcrumbsJsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin.value}/` },
      { '@type': 'ListItem', position: 2, name: 'About', item: `${origin.value}/about` },
    ],
  })
);

useHead({
  title: 'About - SSR Comparison Suite',
  meta: [
    {
      name: 'description',
      content:
        'Learn about the SSR comparison project and technology stack comparison',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: canonical,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: breadcrumbsJsonLd,
    },
  ],
});
</script>

