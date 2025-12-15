<template>
  <div class="container mx-auto px-4 py-12">
    <nav aria-label="Breadcrumb" class="mb-8">
      <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li class="text-foreground">Todos</li>
      </ol>
    </nav>

    <h1 class="mb-8 text-4xl font-bold">Todos</h1>
    <p class="mb-8 text-muted-foreground">Total: {{ todos.length }} todos</p>

    <div class="space-y-8">
      <div
        v-for="entry in todosByUser"
        :key="entry.userId"
        class="rounded-lg border bg-card p-6"
      >
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-semibold">
            <NuxtLink
              v-if="entry.user"
              :to="`/users/${entry.userId}`"
              class="hover:text-primary"
            >
              {{ entry.user.name }}
            </NuxtLink>
            <span v-else>User {{ entry.userId }}</span>
          </h2>
          <span class="text-sm text-muted-foreground">
            {{ entry.completed }}/{{ entry.total }} completed
          </span>
        </div>
        <div class="space-y-2">
          <div
            v-for="todo in entry.todos"
            :key="todo.id"
            class="flex items-center gap-3 rounded-md border bg-muted/50 p-3"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTodos, getUsers } from '@ssr-comparison/api';

const origin = useSiteOrigin();
const canonical = computed(() => `${origin.value}/todos`);
const breadcrumbsJsonLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin.value}/` },
      { '@type': 'ListItem', position: 2, name: 'Todos', item: `${origin.value}/todos` },
    ],
  })
);

const [todos, users] = await Promise.all([getTodos(), getUsers()]);
const userMap = new Map(users.map((u) => [u.id, u]));

const todosByUser = todos.reduce(
  (acc, todo) => {
    if (!acc[todo.userId]) {
      acc[todo.userId] = [];
    }
    acc[todo.userId].push(todo);
    return acc;
  },
  {} as Record<number, typeof todos>
);

const todosByUserArray = Object.entries(todosByUser).map(([userId, todos]) => {
  const completed = todos.filter((t) => t.completed).length;
  return {
    userId: Number(userId),
    user: userMap.get(Number(userId)),
    todos,
    completed,
    total: todos.length,
  };
});

useHead({
  title: 'Todos - SSR Comparison Suite',
  meta: [
    {
      name: 'description',
      content: 'Browse todos from JSONPlaceholder API',
    },
    {
      property: 'og:title',
      content: 'Todos - SSR Comparison Suite',
    },
    {
      property: 'og:description',
      content: 'Browse todos from JSONPlaceholder API',
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

