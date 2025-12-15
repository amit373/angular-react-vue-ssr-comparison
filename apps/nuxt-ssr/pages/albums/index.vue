<template>
  <div class="container mx-auto px-4 py-12">
    <nav aria-label="Breadcrumb" class="mb-8">
      <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li class="text-foreground">Albums</li>
      </ol>
    </nav>

    <h1 class="mb-8 text-4xl font-bold">Albums</h1>
    <p class="mb-8 text-muted-foreground">Total: {{ albums.length }} albums</p>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="album in albums"
        :key="album.id"
        :to="`/albums/${album.id}`"
        :class="cardClass({ variant: 'default' })"
      >
        <h2 class="mb-2 text-xl font-semibold group-hover:text-primary">
          {{ album.title }}
        </h2>
        <div class="mt-4 text-xs text-muted-foreground">
          Album #{{ album.id }} • User {{ album.userId }}
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAlbums } from '@ssr-comparison/api';
import { cardClass } from '@ssr-comparison/ui';

const origin = useSiteOrigin();
const canonical = computed(() => `${origin.value}/albums`);
const breadcrumbsJsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin.value}/` },
      { '@type': 'ListItem', position: 2, name: 'Albums', item: `${origin.value}/albums` },
    ],
  })
);

const albums = await getAlbums();

useHead({
  title: 'Albums - SSR Comparison Suite',
  meta: [
    {
      name: 'description',
      content: 'Browse all albums from JSONPlaceholder API',
    },
    {
      property: 'og:title',
      content: 'Albums - SSR Comparison Suite',
    },
    {
      property: 'og:description',
      content: 'Browse all albums from JSONPlaceholder API',
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

