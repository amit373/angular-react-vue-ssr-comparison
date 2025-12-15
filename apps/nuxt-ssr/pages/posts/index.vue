<template>
  <div class="container mx-auto px-4 py-12">
    <nav aria-label="Breadcrumb" class="mb-8">
      <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li class="text-foreground">Posts</li>
      </ol>
    </nav>

    <h1 class="mb-8 text-4xl font-bold">Posts</h1>
    <p class="mb-8 text-muted-foreground">Total: {{ initial.total }} posts</p>

    <InfinitePosts :initial="initial" />
  </div>
</template>

<script setup lang="ts">
import { DEFAULT_INFINITE_LIMIT } from '@ssr-comparison/utils';

const origin = useSiteOrigin();
const canonical = computed(() => `${origin.value}/posts`);
const breadcrumbsJsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin.value}/` },
      { '@type': 'ListItem', position: 2, name: 'Posts', item: `${origin.value}/posts` },
    ],
  })
);

const { data: initial } = await useAsyncData('posts:first', () =>
  $fetch('/api/posts', { query: { limit: DEFAULT_INFINITE_LIMIT } })
);

useHead({
  title: 'Posts - SSR Comparison Suite',
  meta: [
    {
      name: 'description',
      content: 'Browse all posts from JSONPlaceholder API',
    },
    {
      property: 'og:title',
      content: 'Posts - SSR Comparison Suite',
    },
    {
      property: 'og:description',
      content: 'Browse all posts from JSONPlaceholder API',
    },
    {
      property: 'og:type',
      content: 'website',
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

