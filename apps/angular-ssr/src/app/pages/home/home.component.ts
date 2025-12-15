import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MetricsDashboardComponent } from '../../components/metrics-dashboard/metrics-dashboard.component';
import type { HomeResolvedData } from './home.resolver';
import { cardClass } from '@ssr-comparison/ui';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MetricsDashboardComponent],
  template: `
    <div class="container mx-auto px-4 py-12">
      <div class="mb-12 text-center">
        <h1 class="mb-4 text-4xl font-bold">SSR Comparison Suite</h1>
        <p class="text-xl text-muted-foreground">
          Angular 21 - Production-Ready Server-Side Rendering
        </p>
      </div>

      <app-metrics-dashboard framework="angular" [metrics]="metrics()"></app-metrics-dashboard>

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        <div [class]="cardClass({ variant: 'default' })">
          <h2 class="mb-2 text-2xl font-semibold">{{ postsCount() }}</h2>
          <p class="text-muted-foreground">Posts</p>
        </div>
        <div [class]="cardClass({ variant: 'default' })">
          <h2 class="mb-2 text-2xl font-semibold">{{ usersCount() }}</h2>
          <p class="text-muted-foreground">Users</p>
        </div>
        <div [class]="cardClass({ variant: 'default' })">
          <h2 class="mb-2 text-2xl font-semibold">{{ albumsCount() }}</h2>
          <p class="text-muted-foreground">Albums</p>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {
  private readonly route = inject(ActivatedRoute);

  postsCount = signal(0);
  usersCount = signal(0);
  albumsCount = signal(0);
  metrics = signal<HomeResolvedData['metrics'] | null>(null);
  cardClass = cardClass;

  constructor() {
    const resolved = this.route.snapshot.data['resolved'] as HomeResolvedData | undefined;
    if (resolved) {
      this.postsCount.set(resolved.postsCount);
      this.usersCount.set(resolved.usersCount);
      this.albumsCount.set(resolved.albumsCount);
      this.metrics.set(resolved.metrics);
    }
  }
}

