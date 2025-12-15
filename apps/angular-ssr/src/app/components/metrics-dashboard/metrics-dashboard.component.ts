import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { FrameworkMetrics } from '@ssr-comparison/types';
import { MetricCardComponent } from '../metric-card/metric-card.component';
import { skeletonClass } from '@ssr-comparison/ui';

@Component({
  selector: 'app-metrics-dashboard',
  standalone: true,
  imports: [CommonModule, MetricCardComponent],
  template: `
    <div class="rounded-2xl glass p-6 shadow-premium transition-all duration-400"
         [ngClass]="{'hover:shadow-premium-hover': metrics}"
         [@fadeInUp]="metrics ? 'in' : 'out'">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold gradient-text">Performance Metrics</h2>
        <span class="px-3 py-1 rounded-full text-xs font-semibold text-white"
              [ngClass]="frameworkColor">
          {{ framework.toUpperCase() }}
        </span>
      </div>
      
      @if (metrics) {
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <app-metric-card label="TTFB" [value]="metrics!.ttfb.toFixed(0) + 'ms'"></app-metric-card>
          <app-metric-card label="FCP" [value]="metrics!.fcp.toFixed(0) + 'ms'"></app-metric-card>
          <app-metric-card label="LCP" [value]="metrics!.lcp.toFixed(0) + 'ms'"></app-metric-card>
          <app-metric-card label="SEO Score" [value]="metrics!.seoScore.toFixed(0) + '/100'"></app-metric-card>
          <app-metric-card label="Bundle Size" [value]="metrics!.bundleSize.toFixed(0) + 'KB'"></app-metric-card>
          <app-metric-card label="Hydration" [value]="metrics!.hydrationTime.toFixed(0) + 'ms'"></app-metric-card>
          <app-metric-card label="Server CPU" [value]="metrics!.serverCpuUsage.toFixed(1) + '%'"></app-metric-card>
        </div>
      } @else {
        <div [class]="skeletonClass()" class="space-y-4">
          <div class="h-6 w-1/3 bg-muted rounded"></div>
          <div class="h-4 w-full bg-muted rounded"></div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            @for (_ of skeletonItems; track $index) {
              <div class="rounded-xl neumorphic p-4 h-24"></div>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class MetricsDashboardComponent {
  @Input() framework!: 'nextjs' | 'angular' | 'nuxt';
  @Input() metrics: FrameworkMetrics | null = null;

  skeletonItems = Array.from({ length: 7 });
  skeletonClass = skeletonClass;

  get frameworkColor() {
    const colors: Record<string, string> = {
      nextjs: 'bg-gradient-to-r from-black to-gray-800',
      angular: 'bg-gradient-to-r from-red-600 to-red-800',
      nuxt: 'bg-gradient-to-r from-green-600 to-green-800',
    };
    return colors[this.framework] || 'bg-gradient-to-r from-gray-600 to-gray-800';
  }
}

