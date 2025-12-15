import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';
import { getPhotos } from '@ssr-comparison/api';
import type { Photo } from '@ssr-comparison/types';
import { paginate } from '@ssr-comparison/utils';

@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
    <div class="container mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><a routerLink="/" class="hover:text-foreground">Home</a></li>
          <li>/</li>
          <li class="text-foreground">Photos</li>
        </ol>
      </nav>

      <h1 class="mb-8 text-4xl font-bold">Photos</h1>
      <p class="mb-8 text-muted-foreground">
        Page {{ page() }} of {{ totalPages() }} • Total: {{ allPhotos().length }} photos
      </p>

      <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        @for (photo of photos(); track photo.id) {
          <div class="group relative overflow-hidden rounded-lg border bg-card">
            <img
              [ngSrc]="photo.thumbnailUrl"
              [alt]="photo.title"
              width="150"
              height="150"
              class="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"></div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <p class="text-xs text-white">{{ photo.title }}</p>
            </div>
          </div>
        }
      </div>

      <div class="mt-8 flex justify-center gap-4">
        @if (page() > 1) {
          <a
            [routerLink]="['/photos']"
            [queryParams]="{ page: page() - 1 }"
            class="rounded-md border bg-card px-4 py-2 hover:bg-accent"
          >
            Previous
          </a>
        }
        @if (page() < totalPages()) {
          <a
            [routerLink]="['/photos']"
            [queryParams]="{ page: page() + 1 }"
            class="rounded-md border bg-card px-4 py-2 hover:bg-accent"
          >
            Next
          </a>
        }
      </div>
    </div>
  `,
})
export class PhotosComponent implements OnInit {
  private title = inject(Title, { optional: true });
  private meta = inject(Meta, { optional: true });
  private document = inject(DOCUMENT, { optional: true });
  private platformId = inject(PLATFORM_ID);
  
  allPhotos = signal<Photo[]>([]);
  photos = signal<Photo[]>([]);
  page = signal(1);
  totalPages = signal(1);

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    const allPhotosData = await getPhotos();
    this.allPhotos.set(allPhotosData);

    // Set meta tags
    if (this.title) {
      this.title.setTitle('Photos - SSR Comparison Suite');
    }
    if (this.meta) {
      this.meta.updateTag({
        name: 'description',
        content: 'Browse photos from JSONPlaceholder API',
      });
      this.meta.updateTag({
        property: 'og:title',
        content: 'Photos - SSR Comparison Suite',
      });
      this.meta.updateTag({
        property: 'og:description',
        content: 'Browse photos from JSONPlaceholder API',
      });
      this.meta.updateTag({
        property: 'og:type',
        content: 'website',
      });
    }
    
    // Add canonical link and JSON-LD only if document is available
    if (isPlatformBrowser(this.platformId) && this.document) {
      const origin = window.location.origin;
      const existingCanonical = this.document.querySelector('link[rel="canonical"]');
      if (existingCanonical) existingCanonical.remove();
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', `${origin}/photos`);
      this.document.head.appendChild(link);

      // Add JSON-LD structured data
      const breadcrumbs = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Photos', item: `${origin}/photos` },
        ],
      };
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(breadcrumbs);
      this.document.head.appendChild(script);
    }

    this.route.queryParams.subscribe((params) => {
      const pageNum = Number(params['page']) || 1;
      this.page.set(pageNum);
      const result = paginate(allPhotosData, pageNum, 20);
      this.photos.set(result.data);
      this.totalPages.set(result.totalPages);
    });
  }
}

