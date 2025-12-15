import { Component, signal, inject, PLATFORM_ID, computed } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import type { Post } from '@ssr-comparison/types';
import { truncateText } from '@ssr-comparison/utils';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll.directive';
import type { PostsPageResponse } from './posts.resolver';
import { cardClass, skeletonClass } from '@ssr-comparison/ui';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, RouterLink, InfiniteScrollDirective],
  template: `
    <div class="container mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><a routerLink="/" class="hover:text-foreground">Home</a></li>
          <li>/</li>
          <li class="text-foreground">Posts</li>
        </ol>
      </nav>

      <h1 class="mb-8 text-4xl font-bold">Posts</h1>
      <p class="mb-8 text-muted-foreground">Total: {{ total() }} posts</p>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        @for (post of posts(); track post.id) {
          <a
            [routerLink]="['/posts', post.id]"
            [class]="cardClass({ variant: 'default' })"
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
          </a>
        }

        @if (isLoading()) {
          @for (_ of skeletonItems; track $index) {
            <div [class]="skeletonClass()" class="p-6">
              <div class="h-5 w-3/4 rounded bg-muted"></div>
              <div class="mt-4 space-y-2">
                <div class="h-3 w-full rounded bg-muted"></div>
                <div class="h-3 w-5/6 rounded bg-muted"></div>
                <div class="h-3 w-2/3 rounded bg-muted"></div>
              </div>
            </div>
          }
        }
      </div>

      @if (error()) {
        <div class="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {{ error() }}
        </div>
      }

      @if (isEnd()) {
        <div class="mt-8 text-center text-sm text-muted-foreground">You’ve reached the end.</div>
      } @else {
        <div
          class="h-1"
          appInfiniteScroll
          [disabled]="isLoading()"
          (intersect)="loadMore()"
        ></div>
      }
    </div>
  `,
})
export class PostsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title, { optional: true });
  private readonly meta = inject(Meta, { optional: true });
  private readonly document = inject(DOCUMENT, { optional: true });
  private readonly platformId = inject(PLATFORM_ID);

  posts = signal<Post[]>([]);
  total = signal(0);
  nextCursor = signal<string | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  isEnd = computed(() => this.nextCursor() === null);

  truncateText = truncateText;
  skeletonItems = Array.from({ length: 8 });
  cardClass = cardClass;
  skeletonClass = skeletonClass;

  constructor() {
    const resolved = this.route.snapshot.data['resolved'] as PostsPageResponse | undefined;
    if (resolved) {
      this.posts.set(resolved.data);
      this.total.set(resolved.total);
      this.nextCursor.set(resolved.nextCursor);
    }

    // Set meta tags
    if (this.title) {
      this.title.setTitle('Posts - SSR Comparison Suite');
    }
    if (this.meta) {
      this.meta.updateTag({
        name: 'description',
        content: 'Browse all posts from JSONPlaceholder API',
      });
      this.meta.updateTag({
        property: 'og:title',
        content: 'Posts - SSR Comparison Suite',
      });
      this.meta.updateTag({
        property: 'og:description',
        content: 'Browse all posts from JSONPlaceholder API',
      });
      this.meta.updateTag({
        property: 'og:type',
        content: 'website',
      });
    }
    
    // Add canonical link and JSON-LD only on browser
    if (isPlatformBrowser(this.platformId) && this.document) {
      const origin = globalThis.location.origin;
      const existingCanonical = this.document.querySelector('link[rel="canonical"]');
      if (existingCanonical) existingCanonical.remove();
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', `${origin}/posts`);
      this.document.head.appendChild(link);

      // Add JSON-LD structured data
      const breadcrumbs = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Posts', item: `${origin}/posts` },
        ],
      };
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(breadcrumbs);
      this.document.head.appendChild(script);
    }
  }

  async loadMore() {
    const cursor = this.nextCursor();
    if (!cursor || this.isLoading()) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const res = await fetch(`/api/posts?cursor=${encodeURIComponent(cursor)}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(res.statusText);
      const json = (await res.json()) as PostsPageResponse;
      this.posts.set([...this.posts(), ...json.data]);
      this.nextCursor.set(json.nextCursor);
      this.total.set(json.total);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Failed to load more');
    } finally {
      this.isLoading.set(false);
    }
  }
}

