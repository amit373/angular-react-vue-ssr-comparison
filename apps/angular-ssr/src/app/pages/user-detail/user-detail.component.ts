import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { getUser, getAlbumsByUserId, getTodosByUserId } from '@ssr-comparison/api';
import type { User, Album, Todo } from '@ssr-comparison/types';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><a routerLink="/" class="hover:text-foreground">Home</a></li>
          <li>/</li>
          <li><a routerLink="/users" class="hover:text-foreground">Users</a></li>
          <li>/</li>
          <li class="text-foreground">{{ user()?.name }}</li>
        </ol>
      </nav>

      @if (user()) {
        <div class="mb-12">
          <h1 class="mb-4 text-4xl font-bold">{{ user()!.name }}</h1>
          <p class="text-lg text-muted-foreground">@{{ user()!.username }}</p>
        </div>

        <div class="grid gap-8 md:grid-cols-2">
          <section>
            <h2 class="mb-4 text-2xl font-semibold">Contact Information</h2>
            <div class="space-y-2 rounded-lg border bg-card p-6">
              <p><strong>Email:</strong> {{ user()!.email }}</p>
              <p><strong>Phone:</strong> {{ user()!.phone }}</p>
              <p><strong>Website:</strong> <a [href]="'https://' + user()!.website" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">{{ user()!.website }}</a></p>
            </div>
          </section>

          <section>
            <h2 class="mb-4 text-2xl font-semibold">Address</h2>
            <div class="space-y-2 rounded-lg border bg-card p-6">
              <p>{{ user()!.address.street }}</p>
              <p>{{ user()!.address.suite }}</p>
              <p>{{ user()!.address.city }}, {{ user()!.address.zipcode }}</p>
            </div>
          </section>
        </div>

        <section class="mt-8">
          <h2 class="mb-4 text-2xl font-semibold">Company</h2>
          <div class="rounded-lg border bg-card p-6">
            <h3 class="text-xl font-semibold">{{ user()!.company.name }}</h3>
            <p class="mt-2 text-muted-foreground">{{ user()!.company.catchPhrase }}</p>
            <p class="mt-1 text-sm text-muted-foreground">{{ user()!.company.bs }}</p>
          </div>
        </section>

        <section class="mt-8">
          <h2 class="mb-4 text-2xl font-semibold">Albums ({{ albums().length }})</h2>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            @for (album of albums(); track album.id) {
              <a
                [routerLink]="['/albums', album.id]"
                class="rounded-lg border bg-card p-4 transition-shadow hover:shadow-lg"
              >
                <h3 class="font-semibold">{{ album.title }}</h3>
              </a>
            }
          </div>
        </section>

        <section class="mt-8">
          <h2 class="mb-4 text-2xl font-semibold">Todos ({{ todos().length }})</h2>
          <div class="space-y-2">
            @for (todo of todos(); track todo.id) {
              <div class="flex items-center gap-3 rounded-lg border bg-card p-4">
                <input type="checkbox" [checked]="todo.completed" readonly class="h-5 w-5" [attr.aria-label]="todo.completed ? 'Completed' : 'Not completed'" />
                <span [class.line-through]="todo.completed" [class.text-muted-foreground]="todo.completed">
                  {{ todo.title }}
                </span>
              </div>
            }
          </div>
        </section>
      }
    </div>
  `,
})
export class UserDetailComponent implements OnInit {
  private title = inject(Title, { optional: true });
  private meta = inject(Meta, { optional: true });
  private document = inject(DOCUMENT, { optional: true });
  private platformId = inject(PLATFORM_ID);
  
  user = signal<User | null>(null);
  albums = signal<Album[]>([]);
  todos = signal<Todo[]>([]);

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const [userData, albumsData, todosData] = await Promise.all([
      getUser(id),
      getAlbumsByUserId(id),
      getTodosByUserId(id),
    ]);
    this.user.set(userData);
    this.albums.set(albumsData);
    this.todos.set(todosData);

    // Set meta tags
    if (userData) {
      if (this.title) {
        this.title.setTitle(`${userData.name} - SSR Comparison Suite`);
      }
      if (this.meta) {
        this.meta.updateTag({
          name: 'description',
          content: `Profile of ${userData.name} (${userData.username})`,
        });
        this.meta.updateTag({
          property: 'og:title',
          content: userData.name,
        });
        this.meta.updateTag({
          property: 'og:description',
          content: `Profile of ${userData.name} (${userData.username})`,
        });
        this.meta.updateTag({
          property: 'og:type',
          content: 'profile',
        });
      }
      
      // Add canonical link and JSON-LD only if document is available
      if (isPlatformBrowser(this.platformId) && this.document) {
        const origin = window.location.origin;
        const existingCanonical = this.document.querySelector('link[rel="canonical"]');
        if (existingCanonical) existingCanonical.remove();
        const link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', `${origin}/users/${id}`);
        this.document.head.appendChild(link);

        // Add JSON-LD structured data
        const breadcrumbs = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
            { '@type': 'ListItem', position: 2, name: 'Users', item: `${origin}/users` },
            { '@type': 'ListItem', position: 3, name: userData.name, item: `${origin}/users/${id}` },
          ],
        };
        const jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: userData.name,
          email: userData.email,
          jobTitle: userData.company.name,
          address: {
            '@type': 'PostalAddress',
            streetAddress: userData.address.street,
            addressLocality: userData.address.city,
            postalCode: userData.address.zipcode,
          },
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

