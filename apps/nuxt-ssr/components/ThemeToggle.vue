<template>
  <button
    @click="toggleTheme"
    class="rounded-md p-2 hover:bg-accent"
    :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
  >
    <svg
      v-if="isDark"
      class="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    <svg
      v-else
      class="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
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

