import { Component, OnInit, signal, inject, Optional, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { getAlbums } from '@ssr-comparison/api';
import type { Album } from '@ssr-comparison/types';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><a routerLink="/" class="hover:text-foreground">Home</a></li>
          <li>/</li>
          <li class="text-foreground">Albums</li>
        </ol>
      </nav>

      <h1 class="mb-8 text-4xl font-bold">Albums</h1>
      <p class="mb-8 text-muted-foreground">Total: {{ albums().length }} albums</p>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        @for (album of albums(); track album.id) {
          <a
            [routerLink]="['/albums', album.id]"
            class="group rounded-lg border bg-card p-6 transition-shadow hover:shadow-lg"
          >
            <h2 class="mb-2 text-xl font-semibold group-hover:text-primary">
              {{ album.title }}
            </h2>
            <div class="mt-4 text-xs text-muted-foreground">
              Album #{{ album.id }} • User {{ album.userId }}
            </div>
          </a>
        }
      </div>
    </div>
  `,
})
export class AlbumsComponent implements OnInit {
  private title = inject(Title, { optional: true });
  private meta = inject(Meta, { optional: true });
  private document = inject(DOCUMENT, { optional: true });
  private platformId = inject(PLATFORM_ID);
  
  albums = signal<Album[]>([]);

  async ngOnInit() {
    const albumsData = await getAlbums();
    this.albums.set(albumsData);

    // Set meta tags
    if (this.title) {
      this.title.setTitle('Albums - SSR Comparison Suite');
    }
    if (this.meta) {
      this.meta.updateTag({
        name: 'description',
        content: 'Browse all albums from JSONPlaceholder API',
      });
      this.meta.updateTag({
        property: 'og:title',
        content: 'Albums - SSR Comparison Suite',
      });
      this.meta.updateTag({
        property: 'og:description',
        content: 'Browse all albums from JSONPlaceholder API',
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
      link.setAttribute('href', `${origin}/albums`);
      this.document.head.appendChild(link);

      // Add JSON-LD structured data
      const breadcrumbs = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Albums', item: `${origin}/albums` },
        ],
      };
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(breadcrumbs);
      this.document.head.appendChild(script);
    }
  }
}

