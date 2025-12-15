<template>
  <div>
    <a href="#main-content" class="skip-to-content">Skip to main content</a>
    <Navigation />
    <main id="main-content">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  title: 'SSR Comparison Suite - Nuxt',
  meta: [
    {
      name: 'description',
      content: 'Production-ready SSR comparison between Next.js, Angular, and Nuxt',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0',
    },
    {
      name: 'theme-color',
      content: '#ffffff',
    },
    {
      name: 'color-scheme',
      content: 'light dark',
    },
  ],
});
</script>

