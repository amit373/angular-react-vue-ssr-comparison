'use client';

import type { FrameworkMetrics } from '@ssr-comparison/types';
import { motion } from 'framer-motion';
import { metricCardClass, metricLabelClass, metricValueClass } from '@ssr-comparison/ui/recipes';

interface MetricsDashboardProps {
  framework: 'nextjs' | 'angular' | 'nuxt';
  metrics: FrameworkMetrics | null;
}

export function MetricsDashboard({ framework, metrics }: MetricsDashboardProps) {
  if (!metrics) {
    return (
      <div className="rounded-2xl glass p-6 shadow-premium">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={metricCardClass('h-24')} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Determine framework color
  const frameworkColor = {
    nextjs: 'from-black to-gray-800',
    angular: 'from-red-600 to-red-800',
    nuxt: 'from-green-600 to-green-800',
  }[framework];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl glass p-6 shadow-premium hover:shadow-premium-hover transition-all duration-400"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Performance Metrics</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${frameworkColor} text-white`}>
          {framework.toUpperCase()}
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="TTFB" value={`${metrics.ttfb.toFixed(0)}ms`} />
        <MetricCard label="FCP" value={`${metrics.fcp.toFixed(0)}ms`} />
        <MetricCard label="LCP" value={`${metrics.lcp.toFixed(0)}ms`} />
        <MetricCard
          label="SEO Score"
          value={`${metrics.seoScore.toFixed(0)}/100`}
        />
        <MetricCard
          label="Bundle Size"
          value={`${metrics.bundleSize.toFixed(0)}KB`}
        />
        <MetricCard
          label="Hydration"
          value={`${metrics.hydrationTime.toFixed(0)}ms`}
        />
        <MetricCard
          label="Server CPU"
          value={`${metrics.serverCpuUsage.toFixed(1)}%`}
        />
      </div>
    </motion.div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={metricCardClass()}
    >
      <div className={metricLabelClass()}>{label}</div>
      <div className={metricValueClass()}>{value}</div>
    </motion.div>
  );
}

