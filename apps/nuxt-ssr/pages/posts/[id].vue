<template>
  <div class="container mx-auto px-4 py-12">
    <nav aria-label="Breadcrumb" class="mb-8">
      <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
        <li><NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink></li>
        <li>/</li>
        <li><NuxtLink to="/posts" class="hover:text-foreground">Posts</NuxtLink></li>
        <li>/</li>
        <li class="text-foreground">Post #{{ $route.params.id }}</li>
      </ol>
    </nav>

    <article v-if="post">
      <h1 class="mb-4 text-4xl font-bold">{{ post.title }}</h1>
      <div class="mb-8 text-sm text-muted-foreground">
        Post #{{ post.id }} • User {{ post.userId }}
      </div>
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <p class="text-lg leading-relaxed">{{ post.body }}</p>
      </div>
    </article>

    <section v-if="post" class="mt-12">
      <h2 class="mb-6 text-2xl font-semibold">Comments ({{ comments.length }})</h2>
      <div class="space-y-4">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="rounded-lg border bg-card p-6"
        >
          <div class="mb-2 flex items-center justify-between">
            <h3 class="font-semibold">{{ comment.name }}</h3>
            <span class="text-xs text-muted-foreground">{{ comment.email }}</span>
          </div>
          <p class="text-muted-foreground">{{ comment.body }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getPost, getCommentsByPostId } from '@ssr-comparison/api';

const origin = useSiteOrigin();

const route = useRoute();
const postId = Number(route.params.id);

const [post, comments] = await Promise.all([
  getPost(postId).catch(() => null),
  getCommentsByPostId(postId),
]);

if (!post) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Post not found',
  });
}

useHead({
  title: `${post.title} - SSR Comparison Suite`,
  meta: [
    {
      name: 'description',
      content: post.body,
    },
    {
      property: 'og:title',
      content: post.title,
    },
    {
      property: 'og:description',
      content: post.body,
    },
    {
      property: 'og:type',
      content: 'article',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: computed(() => `${origin.value}/posts/${postId}`),
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
          { '@type': 'ListItem', position: 2, name: 'Posts', item: `${origin.value}/posts` },
          { '@type': 'ListItem', position: 3, name: post.title, item: `${origin.value}/posts/${postId}` },
        ],
      }),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.body,
        author: {
          '@type': 'Person',
          name: `User ${post.userId}`,
        },
        datePublished: new Date().toISOString(),
      }),
    },
  ],
});
</script>

