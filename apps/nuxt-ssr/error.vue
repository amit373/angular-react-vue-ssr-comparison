<template>
  <div class="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4">
    <h1 class="mb-4 text-6xl font-bold">{{ error.statusCode || 500 }}</h1>
    <h2 class="mb-4 text-2xl font-semibold">
      {{ error.statusMessage || 'Something went wrong' }}
    </h2>
    <p class="mb-8 text-muted-foreground">
      {{ error.message || 'An error occurred while processing your request.' }}
    </p>
    <NuxtLink
      to="/"
      class="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
    >
      Go Home
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: {
    statusCode?: number;
    statusMessage?: string;
    message?: string;
  };
}

defineProps<Props>();
</script>

