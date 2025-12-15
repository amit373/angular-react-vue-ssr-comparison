<template>
  <div class="container mx-auto px-4 py-12">
    <nav aria-label="Breadcrumb" class="mb-8">
      <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li class="text-foreground">Photos</li>
      </ol>
    </nav>

    <h1 class="mb-8 text-4xl font-bold">Photos</h1>
    <p class="mb-8 text-muted-foreground">
      Page {{ page }} of {{ totalPages }} • Total: {{ allPhotos.length }} photos
    </p>

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

    <div class="mt-8 flex justify-center gap-4">
      <NuxtLink
        v-if="page > 1"
        :to="`/photos?page=${page - 1}`"
        class="rounded-md border bg-card px-4 py-2 hover:bg-accent"
      >
        Previous
      </NuxtLink>
      <NuxtLink
        v-if="page < totalPages"
        :to="`/photos?page=${page + 1}`"
        class="rounded-md border bg-card px-4 py-2 hover:bg-accent"
      >
        Next
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getPhotos } from '@ssr-comparison/api';
import { paginate } from '@ssr-comparison/utils';

const origin = useSiteOrigin();
const canonical = computed(() => `${origin.value}/photos`);
const breadcrumbsJsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin.value}/` },
      { '@type': 'ListItem', position: 2, name: 'Photos', item: `${origin.value}/photos` },
    ],
  })
);

const route = useRoute();
const page = Number(route.query.page) || 1;
const limit = 20;

const allPhotos = await getPhotos();
const { data: photos, totalPages } = paginate(allPhotos, page, limit);

useHead({
  title: 'Photos - SSR Comparison Suite',
  meta: [
    {
      name: 'description',
      content: 'Browse photos from JSONPlaceholder API',
    },
    {
      property: 'og:title',
      content: 'Photos - SSR Comparison Suite',
    },
    {
      property: 'og:description',
      content: 'Browse photos from JSONPlaceholder API',
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

