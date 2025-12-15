import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { getPost, getCommentsByPostId } from '@ssr-comparison/api';
import type { Post, Comment } from '@ssr-comparison/types';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><a routerLink="/" class="hover:text-foreground">Home</a></li>
          <li>/</li>
          <li><a routerLink="/posts" class="hover:text-foreground">Posts</a></li>
          <li>/</li>
          <li class="text-foreground">Post #{{ id() }}</li>
        </ol>
      </nav>

      @if (post()) {
        <article>
          <h1 class="mb-4 text-4xl font-bold">{{ post()!.title }}</h1>
          <div class="mb-8 text-sm text-muted-foreground">
            Post #{{ post()!.id }} • User {{ post()!.userId }}
          </div>
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <p class="text-lg leading-relaxed">{{ post()!.body }}</p>
          </div>
        </article>

        <section class="mt-12">
          <h2 class="mb-6 text-2xl font-semibold">Comments ({{ comments().length }})</h2>
          <div class="space-y-4">
            @for (comment of comments(); track comment.id) {
              <div class="rounded-lg border bg-card p-6">
                <div class="mb-2 flex items-center justify-between">
                  <h3 class="font-semibold">{{ comment.name }}</h3>
                  <span class="text-xs text-muted-foreground">{{ comment.email }}</span>
                </div>
                <p class="text-muted-foreground">{{ comment.body }}</p>
              </div>
            }
          </div>
        </section>
      }
    </div>
  `,
})
export class PostDetailComponent implements OnInit {
  private title = inject(Title, { optional: true });
  private meta = inject(Meta, { optional: true });
  private document = inject(DOCUMENT, { optional: true });
  private platformId = inject(PLATFORM_ID);
  
  id = signal<number>(0);
  post = signal<Post | null>(null);
  comments = signal<Comment[]>([]);

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.id.set(id);
    const [postData, commentsData] = await Promise.all([
      getPost(id),
      getCommentsByPostId(id),
    ]);
    this.post.set(postData);
    this.comments.set(commentsData);

    // Set meta tags
    if (postData) {
      if (this.title) {
        this.title.setTitle(`${postData.title} - SSR Comparison Suite`);
      }
      if (this.meta) {
        this.meta.updateTag({
          name: 'description',
          content: postData.body,
        });
        this.meta.updateTag({
          property: 'og:title',
          content: postData.title,
        });
        this.meta.updateTag({
          property: 'og:description',
          content: postData.body,
        });
        this.meta.updateTag({
          property: 'og:type',
          content: 'article',
        });
      }
      
      // Add canonical link and JSON-LD only if document is available
      if (isPlatformBrowser(this.platformId) && this.document) {
        const origin = window.location.origin;
        const existingCanonical = this.document.querySelector('link[rel="canonical"]');
        if (existingCanonical) existingCanonical.remove();
        const link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', `${origin}/posts/${id}`);
        this.document.head.appendChild(link);

        // Add JSON-LD structured data
        const breadcrumbs = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Posts', item: `${origin}/posts` },
            { '@type': 'ListItem', position: 3, name: postData.title, item: `${origin}/posts/${id}` },
          ],
        };
        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: postData.title,
          description: postData.body,
          author: {
            '@type': 'Person',
            name: `User ${postData.userId}`,
          },
          datePublished: new Date().toISOString(),
        };
        const script1 = this.document.createElement('script');
        script1.type = 'application/ld+json';
        script1.text = JSON.stringify(breadcrumbs);
        this.document.head.appendChild(script1);
        const script2 = this.document.createElement('script');
        script2.type = 'application/ld+json';
        script2.text = JSON.stringify(jsonLd);
        this.document.head.appendChild(script2);
      }
    }
  }
}

