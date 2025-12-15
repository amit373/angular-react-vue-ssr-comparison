<template>
  <div v-if="user" class="container mx-auto px-4 py-12">
    <nav aria-label="Breadcrumb" class="mb-8">
      <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li><NuxtLink to="/users" class="hover:text-foreground">Users</NuxtLink></li>
        <li>/</li>
        <li class="text-foreground">{{ user.name }}</li>
      </ol>
    </nav>

    <div class="mb-12">
      <h1 class="mb-4 text-4xl font-bold">{{ user.name }}</h1>
      <p class="text-lg text-muted-foreground">@{{ user.username }}</p>
    </div>

    <div class="grid gap-8 md:grid-cols-2">
      <section>
        <h2 class="mb-4 text-2xl font-semibold">Contact Information</h2>
        <div class="space-y-2 rounded-lg border bg-card p-6">
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Phone:</strong> {{ user.phone }}</p>
          <p>
            <strong>Website:</strong>
            <a
              :href="`https://${user.website}`"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline"
            >
              {{ user.website }}
            </a>
          </p>
        </div>
      </section>

      <section>
        <h2 class="mb-4 text-2xl font-semibold">Address</h2>
        <div class="space-y-2 rounded-lg border bg-card p-6">
          <p>{{ user.address.street }}</p>
          <p>{{ user.address.suite }}</p>
          <p>{{ user.address.city }}, {{ user.address.zipcode }}</p>
        </div>
      </section>
    </div>

    <section class="mt-8">
      <h2 class="mb-4 text-2xl font-semibold">Company</h2>
      <div class="rounded-lg border bg-card p-6">
        <h3 class="text-xl font-semibold">{{ user.company.name }}</h3>
        <p class="mt-2 text-muted-foreground">{{ user.company.catchPhrase }}</p>
        <p class="mt-1 text-sm text-muted-foreground">{{ user.company.bs }}</p>
      </div>
    </section>

    <section class="mt-8">
      <h2 class="mb-4 text-2xl font-semibold">Albums ({{ albums.length }})</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="album in albums"
          :key="album.id"
          :to="`/albums/${album.id}`"
          class="rounded-lg border bg-card p-4 transition-shadow hover:shadow-lg"
        >
          <h3 class="font-semibold">{{ album.title }}</h3>
        </NuxtLink>
      </div>
    </section>

    <section class="mt-8">
      <h2 class="mb-4 text-2xl font-semibold">Todos ({{ todos.length }})</h2>
      <div class="space-y-2">
        <div
          v-for="todo in todos"
          :key="todo.id"
          class="flex items-center gap-3 rounded-lg border bg-card p-4"
        >
          <input
            type="checkbox"
            :checked="todo.completed"
            readonly
            class="h-5 w-5"
            :aria-label="todo.completed ? 'Completed' : 'Not completed'"
          />
          <span
            :class="[
              todo.completed ? 'line-through text-muted-foreground' : '',
            ]"
          >
            {{ todo.title }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getUser, getAlbumsByUserId, getTodosByUserId } from '@ssr-comparison/api';

const origin = useSiteOrigin();

const route = useRoute();
const userId = Number(route.params.id);

const [user, albums, todos] = await Promise.all([
  getUser(userId).catch(() => null),
  getAlbumsByUserId(userId),
  getTodosByUserId(userId),
]);

if (!user) {
  throw createError({
    statusCode: 404,
    statusMessage: 'User not found',
  });
}

useHead({
  title: `${user.name} - SSR Comparison Suite`,
  meta: [
    {
      name: 'description',
      content: `Profile of ${user.name} (${user.username})`,
    },
    {
      property: 'og:title',
      content: user.name,
    },
    {
      property: 'og:description',
      content: `Profile of ${user.name} (${user.username})`,
    },
    {
      property: 'og:type',
      content: 'profile',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: computed(() => `${origin.value}/users/${userId}`),
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
          { '@type': 'ListItem', position: 2, name: 'Users', item: `${origin.value}/users` },
          { '@type': 'ListItem', position: 3, name: user.name, item: `${origin.value}/users/${userId}` },
        ],
      }),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: user.name,
        email: user.email,
        jobTitle: user.company.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: user.address.street,
          addressLocality: user.address.city,
          postalCode: user.address.zipcode,
        },
      }),
    },
  ],
});
</script>

