<template>
  <nav
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="container mx-auto px-4">
      <div class="flex h-16 items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md" aria-label="Home">
          SSR Comparison
        </NuxtLink>
        <div class="flex items-center gap-6" role="menubar">
          <NuxtLink
            to="/posts"
            class="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
            role="menuitem"
          >
            Posts
          </NuxtLink>
          <NuxtLink
            to="/users"
            class="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
            role="menuitem"
          >
            Users
          </NuxtLink>
          <NuxtLink
            to="/albums"
            class="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
            role="menuitem"
          >
            Albums
          </NuxtLink>
          <NuxtLink
            to="/photos"
            class="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
            role="menuitem"
          >
            Photos
          </NuxtLink>
          <NuxtLink
            to="/todos"
            class="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
            role="menuitem"
          >
            Todos
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-2 py-1"
            role="menuitem"
          >
            About
          </NuxtLink>
          <ThemeToggle />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const isDark = useState('theme', () => false);

onMounted(() => {
  if (import.meta.client) {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark.value = stored === 'dark' || (!stored && prefersDark);
    updateTheme(isDark.value);
  }
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateTheme(isDark.value);
  if (import.meta.client) {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  }
};

const updateTheme = (dark: boolean) => {
  if (import.meta.client) {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(dark ? 'dark' : 'light');
  }
};
</script>

