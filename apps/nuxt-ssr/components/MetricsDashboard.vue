<template>
  <div class="rounded-2xl glass p-6 shadow-premium transition-all duration-400 hover:shadow-premium-hover">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold gradient-text">Performance Metrics</h2>
      <span class="px-3 py-1 rounded-full text-xs font-semibold text-white"
            :class="frameworkColor">
        {{ framework.toUpperCase() }}
      </span>
    </div>
    
    <div v-if="metrics" class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard label="TTFB" :value="`${metrics.ttfb.toFixed(0)}ms`" />
      <MetricCard label="FCP" :value="`${metrics.fcp.toFixed(0)}ms`" />
      <MetricCard label="LCP" :value="`${metrics.lcp.toFixed(0)}ms`" />
      <MetricCard
        label="SEO Score"
        :value="`${metrics.seoScore.toFixed(0)}/100`"
      />
      <MetricCard
        label="Bundle Size"
        :value="`${metrics.bundleSize.toFixed(0)}KB`"
      />
      <MetricCard
        label="Hydration"
        :value="`${metrics.hydrationTime.toFixed(0)}ms`"
      />
      <MetricCard
        label="Server CPU"
        :value="`${metrics.serverCpuUsage.toFixed(1)}%`"
      />
    </div>
    <div v-else :class="skeletonClass()">
      <div class="h-6 w-1/3 bg-muted rounded"></div>
      <div class="h-4 w-full bg-muted rounded"></div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div v-for="i in 7" :key="i" class="rounded-xl neumorphic p-4 h-24"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FrameworkMetrics } from '@ssr-comparison/types';
import { skeletonClass } from '@ssr-comparison/ui';

interface Props {
  framework: 'nextjs' | 'angular' | 'nuxt';
  metrics: FrameworkMetrics | null;
}

const props = defineProps<Props>();

const frameworkColor = computed(() => {
  const colors: Record<string, string> = {
    nextjs: 'bg-gradient-to-r from-black to-gray-800',
    angular: 'bg-gradient-to-r from-red-600 to-red-800',
    nuxt: 'bg-gradient-to-r from-green-600 to-green-800',
  };
  return colors[props.framework] || 'bg-gradient-to-r from-gray-600 to-gray-800';
});
</script>
