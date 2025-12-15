<template>
  <div class="container mx-auto px-4 py-12">
    <div class="mb-12 text-center">
      <h1 class="mb-4 text-4xl font-bold">SSR Comparison Suite</h1>
      <p class="text-xl text-muted-foreground">
        Nuxt 4.2 - Production-Ready Server-Side Rendering
      </p>
    </div>

    <MetricsDashboard framework="nuxt" :metrics="metrics" />

    <div class="mt-12 grid gap-6 md:grid-cols-3">
      <div :class="cardClass({ variant: 'default' })">
        <h2 class="mb-2 text-2xl font-semibold">{{ posts.length }}</h2>
        <p class="text-muted-foreground">Posts</p>
      </div>
      <div :class="cardClass({ variant: 'default' })">
        <h2 class="mb-2 text-2xl font-semibold">{{ users.length }}</h2>
        <p class="text-muted-foreground">Users</p>
      </div>
      <div :class="cardClass({ variant: 'default' })">
        <h2 class="mb-2 text-2xl font-semibold">{{ albums.length }}</h2>
        <p class="text-muted-foreground">Albums</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPosts, getUsers, getAlbums } from '@ssr-comparison/api';
import { cardClass } from '@ssr-comparison/ui';

const origin = useSiteOrigin();
const canonical = computed(() => `${origin.value}/`);

const { data: metrics } = await useAsyncData('metrics:nuxt', () =>
  $fetch('/api/metrics', { query: { framework: 'nuxt' } })
);

const posts = await getPosts();
const users = await getUsers();
const albums = await getAlbums();

useHead({
  title: 'SSR Comparison Suite - Nuxt',
  meta: [
    {
      name: 'description',
      content:
        'Production-ready Server-Side Rendering comparison between Next.js 16, Angular 21, and Nuxt 4.2',
    },
    {
      name: 'keywords',
      content: 'SSR, Server-Side Rendering, Next.js, Angular, Nuxt, React, Vue, Performance, SEO',
    },
    {
      name: 'author',
      content: 'SSR Comparison Team',
    },
    {
      name: 'theme-color',
      content: '#ffffff',
      media: '(prefers-color-scheme: light)',
    },
    {
      name: 'theme-color',
      content: '#0a0a0a',
      media: '(prefers-color-scheme: dark)',
    },
    {
      property: 'og:title',
      content: 'SSR Comparison Suite',
    },
    {
      property: 'og:description',
      content:
        'Production-ready Server-Side Rendering comparison between Next.js 16, Angular 21, and Nuxt 4.2',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: origin.value,
    },
    {
      property: 'og:site_name',
      content: 'SSR Comparison Suite',
    },
    {
      property: 'og:image',
      content: `${origin.value}/og-image.svg`,
    },
    {
      property: 'og:image:width',
      content: '1200',
    },
    {
      property: 'og:image:height',
      content: '630',
    },
    {
      property: 'og:image:alt',
      content: 'SSR Comparison Suite - Next.js, Angular, Nuxt',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: 'SSR Comparison Suite',
    },
    {
      name: 'twitter:description',
      content:
        'Production-ready Server-Side Rendering comparison between Next.js 16, Angular 21, and Nuxt 4.2',
    },
    {
      name: 'twitter:image',
      content: `${origin.value}/og-image.svg`,
    },
    {
      name: 'twitter:creator',
      content: '@ssrcomparison',
    },
    {
      name: 'robots',
      content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
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
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'SSR Comparison Suite',
        description:
          'Production-ready Server-Side Rendering comparison between Next.js 16, Angular 21, and Nuxt 4.2',
        url: origin.value,
      }),
    },
  ],
});
</script>

