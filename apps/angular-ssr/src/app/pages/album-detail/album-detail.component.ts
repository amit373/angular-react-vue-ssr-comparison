import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { NgOptimizedImage } from '@angular/common';
import { getAlbum, getPhotosByAlbumId } from '@ssr-comparison/api';
import type { Album, Photo } from '@ssr-comparison/types';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
    <div class="container mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><a routerLink="/" class="hover:text-foreground">Home</a></li>
          <li>/</li>
          <li><a routerLink="/albums" class="hover:text-foreground">Albums</a></li>
          <li>/</li>
          <li class="text-foreground">Album #{{ id() }}</li>
        </ol>
      </nav>

      @if (album()) {
        <div class="mb-8">
          <h1 class="mb-4 text-4xl font-bold">{{ album()!.title }}</h1>
          <p class="text-muted-foreground">
            Album #{{ album()!.id }} • User {{ album()!.userId }} • {{ photos().length }} photos
          </p>
        </div>

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
      }
    </div>
  `,
})
export class AlbumDetailComponent implements OnInit {
  private title = inject(Title, { optional: true });
  private meta = inject(Meta, { optional: true });
  private document = inject(DOCUMENT, { optional: true });
  private platformId = inject(PLATFORM_ID);
  
  id = signal<number>(0);
  album = signal<Album | null>(null);
  photos = signal<Photo[]>([]);

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.id.set(id);
    const [albumData, photosData] = await Promise.all([
      getAlbum(id),
      getPhotosByAlbumId(id),
    ]);
    this.album.set(albumData);
    this.photos.set(photosData);

    // Set meta tags
    if (albumData) {
      if (this.title) {
        this.title.setTitle(`${albumData.title} - SSR Comparison Suite`);
      }
      if (this.meta) {
        this.meta.updateTag({
          name: 'description',
          content: `Album: ${albumData.title}`,
        });
        this.meta.updateTag({
          property: 'og:title',
          content: albumData.title,
        });
        this.meta.updateTag({
          property: 'og:description',
          content: `Album: ${albumData.title}`,
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
        link.setAttribute('href', `${origin}/albums/${id}`);
        this.document.head.appendChild(link);

        // Add JSON-LD structured data
        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'ImageGallery',
          name: albumData.title,
          description: `Album: ${albumData.title}`,
          image: photosData.map((p) => p.url),
        };
        const script = this.document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(jsonLd);
        this.document.head.appendChild(script);
      }
    }
  }
}

