import { Component, OnInit, inject, Optional, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><a routerLink="/" class="hover:text-foreground">Home</a></li>
          <li>/</li>
          <li class="text-foreground">About</li>
        </ol>
      </nav>

      <article class="prose prose-lg dark:prose-invert max-w-none">
        <h1 class="mb-8 text-4xl font-bold">About This Project</h1>

        <section class="mb-12">
          <h2 class="mb-4 text-2xl font-semibold">Project Overview</h2>
          <p class="mb-4">
            This is a comprehensive Server-Side Rendering (SSR) comparison
            suite that demonstrates production-ready implementations of three
            leading frameworks:
          </p>
          <ul class="list-disc pl-6">
            <li>
              <strong>Next.js 16</strong> - React-based framework with App
              Router
            </li>
            <li>
              <strong>Angular 21</strong> - Full-featured framework with SSR
              support
            </li>
            <li>
              <strong>Nuxt 4.2</strong> - Vue.js framework with full SSR mode
            </li>
          </ul>
        </section>

        <section class="mb-12">
          <h2 class="mb-4 text-2xl font-semibold">Key Features</h2>
          <ul class="list-disc pl-6">
            <li>100% Server-Side Rendering (no client-side fetching)</li>
            <li>SEO optimized with meta tags, OpenGraph, and JSON-LD</li>
            <li>Dark mode support</li>
            <li>Fully responsive design</li>
            <li>WCAG 2.2 AA accessibility compliance</li>
            <li>Performance optimized with caching strategies</li>
            <li>Error handling and fallback UI</li>
            <li>Comprehensive testing setup</li>
            <li>Docker support for containerization</li>
          </ul>
        </section>

        <section class="mb-12">
          <h2 class="mb-4 text-2xl font-semibold">Technology Stack</h2>
          <div class="grid gap-6 md:grid-cols-3">
            <div class="rounded-lg border bg-card p-6">
              <h3 class="mb-2 text-xl font-semibold">Frameworks</h3>
              <ul class="text-sm text-muted-foreground">
                <li>Next.js 16</li>
                <li>Angular 21</li>
                <li>Nuxt 4.2</li>
              </ul>
            </div>
            <div class="rounded-lg border bg-card p-6">
              <h3 class="mb-2 text-xl font-semibold">Styling</h3>
              <ul class="text-sm text-muted-foreground">
                <li>Tailwind CSS v4</li>
                <li>CSS Variables</li>
                <li>Responsive Design</li>
              </ul>
            </div>
            <div class="rounded-lg border bg-card p-6">
              <h3 class="mb-2 text-xl font-semibold">Tools</h3>
              <ul class="text-sm text-muted-foreground">
                <li>TypeScript 5+</li>
                <li>Turborepo</li>
                <li>PNPM</li>
                <li>Vitest</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 class="mb-4 text-2xl font-semibold">Data Source</h2>
          <p class="mb-4">
            All data is fetched from
            <a
              href="https://jsonplaceholder.typicode.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline"
            >
              JSONPlaceholder
            </a>
            , a free fake REST API for testing and prototyping.
          </p>
        </section>
      </article>
    </div>
  `,
})
export class AboutComponent implements OnInit {
  private title = inject(Title, { optional: true });
  private meta = inject(Meta, { optional: true });
  private document = inject(DOCUMENT, { optional: true });
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    // Set meta tags
    if (this.title) {
      this.title.setTitle('About - SSR Comparison Suite');
    }
    if (this.meta) {
      this.meta.updateTag({
        name: 'description',
        content: 'Learn about the SSR comparison project and technology stack comparison',
      });
      this.meta.updateTag({
        property: 'og:title',
        content: 'About - SSR Comparison Suite',
      });
      this.meta.updateTag({
        property: 'og:description',
        content: 'Learn about the SSR comparison project and technology stack comparison',
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
      link.setAttribute('href', `${origin}/about`);
      this.document.head.appendChild(link);

      // Add JSON-LD structured data
      const breadcrumbs = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'About', item: `${origin}/about` },
        ],
      };
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(breadcrumbs);
      this.document.head.appendChild(script);
    }
  }
}

