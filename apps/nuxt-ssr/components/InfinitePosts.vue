<template>
  <div>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="post in items"
        :key="post.id"
        :to="`/posts/${post.id}`"
        :class="cardClass({ variant: 'default' })"
      >
        <h2 class="mb-2 text-xl font-semibold group-hover:text-primary">
          {{ post.title }}
        </h2>
        <p class="text-sm text-muted-foreground">
          {{ truncateText(post.body, 150) }}
        </p>
        <div class="mt-4 text-xs text-muted-foreground">
          Post #{{ post.id }} • User {{ post.userId }}
        </div>
      </NuxtLink>

      <div
        v-if="isLoading"
        v-for="i in 8"
        :key="`sk-${i}`"
        :class="skeletonClass()"
      >
        <div class="h-5 w-3/4 rounded bg-muted" />
        <div class="mt-4 space-y-2">
          <div class="h-3 w-full rounded bg-muted" />
          <div class="h-3 w-5/6 rounded bg-muted" />
          <div class="h-3 w-2/3 rounded bg-muted" />
        </div>
      </div>
    </div>

    <div
      v-if="error"
      class="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
    >
      {{ error }}
    </div>

    <div v-if="isEnd" class="mt-8 text-center text-sm text-muted-foreground">
      You’ve reached the end.
    </div>

    <div v-else ref="sentinelRef" class="h-1" />
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@ssr-comparison/types';
import { observeIntersection, truncateText } from '@ssr-comparison/utils';
import { cardClass, skeletonClass } from '@ssr-comparison/ui';

type PostsPageResponse = {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  nextCursor: string | null;
};

interface Props {
  initial: PostsPageResponse;
}

const props = defineProps<Props>();

const items = ref<Post[]>(props.initial.data);
const nextCursor = ref<string | null>(props.initial.nextCursor);
const isLoading = ref(false);
const error = ref<string | null>(null);

const isEnd = computed(() => nextCursor.value === null);

const sentinelRef = ref<HTMLElement | null>(null);

const loadMore = async () => {
  if (!nextCursor.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    const json = await $fetch<PostsPageResponse>('/api/posts', {
      query: { cursor: nextCursor.value },
    });
    items.value = [...items.value, ...json.data];
    nextCursor.value = json.nextCursor;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load more';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  observeIntersection(
    sentinelRef.value,
    () => {
      if (isLoading.value || isEnd.value) return;
      void loadMore();
    },
    { rootMargin: '600px 0px' }
  );
});
</script>
