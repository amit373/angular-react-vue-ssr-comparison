import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 class="mb-4 text-6xl font-bold">404</h1>
      <h2 class="mb-4 text-2xl font-semibold">Page Not Found</h2>
      <p class="mb-8 text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <a
        routerLink="/"
        class="rounded-md bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
      >
        Go Home
      </a>
    </div>
  `,
})
export class NotFoundComponent {}

