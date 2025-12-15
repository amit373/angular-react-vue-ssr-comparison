<template>
  <div class="rounded-md border bg-muted/50 p-4">
    <div class="text-sm text-muted-foreground">{{ label }}</div>
    <div class="mt-1 text-2xl font-bold">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  value: string;
}

defineProps<Props>();
</script>

