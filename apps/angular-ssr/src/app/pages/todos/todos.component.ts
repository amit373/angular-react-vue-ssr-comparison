import { Component, OnInit, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { getTodos, getUsers } from '@ssr-comparison/api';
import type { Todo, User } from '@ssr-comparison/types';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" class="mb-8">
        <ol class="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><a routerLink="/" class="hover:text-foreground">Home</a></li>
          <li>/</li>
          <li class="text-foreground">Todos</li>
        </ol>
      </nav>

      <h1 class="mb-8 text-4xl font-bold">Todos</h1>
      <p class="mb-8 text-muted-foreground">Total: {{ todos().length }} todos</p>

      <div class="space-y-8">
        @for (entry of todosByUser(); track entry.userId) {
          <div class="rounded-lg border bg-card p-6">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-xl font-semibold">
                @if (entry.user) {
                  <a [routerLink]="['/users', entry.userId]" class="hover:text-primary">
                    {{ entry.user.name }}
                  </a>
                } @else {
                  User {{ entry.userId }}
                }
              </h2>
              <span class="text-sm text-muted-foreground">
                {{ entry.completed }}/{{ entry.total }} completed
              </span>
            </div>
            <div class="space-y-2">
              @for (todo of entry.todos; track todo.id) {
                <div class="flex items-center gap-3 rounded-md border bg-muted/50 p-3">
                  <input type="checkbox" [checked]="todo.completed" readonly class="h-5 w-5" [attr.aria-label]="todo.completed ? 'Completed' : 'Not completed'" />
                  <span [class.line-through]="todo.completed" [class.text-muted-foreground]="todo.completed">
                    {{ todo.title }}
                  </span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class TodosComponent implements OnInit {
  private title = inject(Title, { optional: true });
  private meta = inject(Meta, { optional: true });
  private document = inject(DOCUMENT, { optional: true });
  private platformId = inject(PLATFORM_ID);
  
  todos = signal<Todo[]>([]);
  users = signal<User[]>([]);
  todosByUser = signal<Array<{ userId: number; user?: User; todos: Todo[]; completed: number; total: number }>>([]);

  async ngOnInit() {
    const [todosData, usersData] = await Promise.all([getTodos(), getUsers()]);
    this.todos.set(todosData);
    this.users.set(usersData);

    const userMap = new Map(usersData.map((u) => [u.id, u]));
    const grouped = todosData.reduce(
      (acc, todo) => {
        if (!acc[todo.userId]) {
          acc[todo.userId] = [];
        }
        acc[todo.userId].push(todo);
        return acc;
      },
      {} as Record<number, Todo[]>
    );

    const result = Object.entries(grouped).map(([userId, todos]) => {
      const completed = todos.filter((t) => t.completed).length;
      return {
        userId: Number(userId),
        user: userMap.get(Number(userId)),
        todos,
        completed,
        total: todos.length,
      };
    });

    this.todosByUser.set(result);

    // Set meta tags
    if (this.title) {
      this.title.setTitle('Todos - SSR Comparison Suite');
    }
    if (this.meta) {
      this.meta.updateTag({
        name: 'description',
        content: 'Browse todos from JSONPlaceholder API',
      });
      this.meta.updateTag({
        property: 'og:title',
        content: 'Todos - SSR Comparison Suite',
      });
      this.meta.updateTag({
        property: 'og:description',
        content: 'Browse todos from JSONPlaceholder API',
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
      link.setAttribute('href', `${origin}/todos`);
      this.document.head.appendChild(link);

      // Add JSON-LD structured data
      const breadcrumbs = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
          { '@type': 'ListItem', position: 2, name: 'Todos', item: `${origin}/todos` },
        ],
      };
      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(breadcrumbs);
      this.document.head.appendChild(script);
    }
  }
}

