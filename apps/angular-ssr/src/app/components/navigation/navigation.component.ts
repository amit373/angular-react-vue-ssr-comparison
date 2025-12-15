import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, ThemeToggleComponent],
  template: `
    <nav
      class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div class="container mx-auto px-4">
        <div class="flex h-16 items-center justify-between">
          <a routerLink="/" class="text-xl font-bold text-primary" aria-label="Home">
            SSR Comparison
          </a>
          <div class="flex items-center gap-6">
            <a routerLink="/posts" class="text-sm font-medium transition-colors hover:text-primary">
              Posts
            </a>
            <a routerLink="/users" class="text-sm font-medium transition-colors hover:text-primary">
              Users
            </a>
            <a routerLink="/albums" class="text-sm font-medium transition-colors hover:text-primary">
              Albums
            </a>
            <a routerLink="/photos" class="text-sm font-medium transition-colors hover:text-primary">
              Photos
            </a>
            <a routerLink="/todos" class="text-sm font-medium transition-colors hover:text-primary">
              Todos
            </a>
            <a routerLink="/about" class="text-sm font-medium transition-colors hover:text-primary">
              About
            </a>
            <app-theme-toggle></app-theme-toggle>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavigationComponent {}

