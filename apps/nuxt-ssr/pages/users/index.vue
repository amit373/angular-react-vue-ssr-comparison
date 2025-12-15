<template>
  <div class="container mx-auto px-4 py-12">
    <nav aria-label="Breadcrumb" class="mb-8">
      <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li class="text-foreground">Users</li>
      </ol>
    </nav>

    <h1 class="mb-8 text-4xl font-bold">Users</h1>
    <p class="mb-8 text-muted-foreground">Total: {{ users.length }} users</p>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="user in users"
        :key="user.id"
        :to="`/users/${user.id}`"
        :class="cardClass({ variant: 'default' })"
      >
        <h2 class="mb-2 text-xl font-semibold group-hover:text-primary">
          {{ user.name }}
        </h2>
        <p class="text-sm text-muted-foreground">@{{ user.username }}</p>
        <p class="mt-2 text-sm text-muted-foreground">{{ user.email }}</p>
        <p class="mt-4 text-xs text-muted-foreground">{{ user.company.name }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUsers } from '@ssr-comparison/api';
import { cardClass } from '@ssr-comparison/ui';

const origin = useSiteOrigin();
const canonical = computed(() => `${origin.value}/users`);
const breadcrumbsJsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin.value}/` },
      { '@type': 'ListItem', position: 2, name: 'Users', item: `${origin.value}/users` },
    ],
  })
);

const users = await getUsers();

useHead({
  title: 'Users - SSR Comparison Suite',
  meta: [
    {
      name: 'description',
      content: 'Browse all users from JSONPlaceholder API',
    },
    {
      property: 'og:title',
      content: 'Users - SSR Comparison Suite',
    },
    {
      property: 'og:description',
      content: 'Browse all users from JSONPlaceholder API',
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

