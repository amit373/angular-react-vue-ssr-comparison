<template>
  <div v-if="album" class="container mx-auto px-4 py-12">
    <nav aria-label="Breadcrumb" class="mb-8">
      <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li><NuxtLink to="/albums" class="hover:text-foreground">Albums</NuxtLink></li>
        <li>/</li>
        <li class="text-foreground">Album #{{ $route.params.id }}</li>
      </ol>
    </nav>

    <div class="mb-8">
      <h1 class="mb-4 text-4xl font-bold">{{ album.title }}</h1>
      <p class="text-muted-foreground">
        Album #{{ album.id }} • User {{ album.userId }} • {{ photos.length }} photos
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="group relative overflow-hidden rounded-lg border bg-card"
      >
        <img
          :src="photo.thumbnailUrl"
          :alt="photo.title"
          width="150"
          height="150"
          class="h-full w-full object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"></div>
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <p class="text-xs text-white">{{ photo.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAlbum, getPhotosByAlbumId } from '@ssr-comparison/api';

const origin = useSiteOrigin();

const route = useRoute();
const albumId = Number(route.params.id);

const [album, photos] = await Promise.all([
  getAlbum(albumId).catch(() => null),
  getPhotosByAlbumId(albumId),
]);

if (!album) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Album not found',
  });
}

useHead({
  title: `${album.title} - SSR Comparison Suite`,
  meta: [
    {
      name: 'description',
      content: `Album: ${album.title}`,
    },
    {
      property: 'og:title',
      content: album.title,
    },
    {
      property: 'og:description',
      content: `Album: ${album.title}`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: computed(() => `${origin.value}/albums/${albumId}`),
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin.value}/` },
          { '@type': 'ListItem', position: 2, name: 'Albums', item: `${origin.value}/albums` },
          { '@type': 'ListItem', position: 3, name: album.title, item: `${origin.value}/albums/${albumId}` },
        ],
      }),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: album.title,
        description: `Album: ${album.title}`,
        image: photos.map((p) => p.url),
      }),
    },
  ],
});
</script>

