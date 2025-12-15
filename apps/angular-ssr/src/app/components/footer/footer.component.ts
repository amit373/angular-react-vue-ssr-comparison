import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="border-t bg-muted/50" role="contentinfo">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center text-sm text-muted-foreground">
          <p>SSR Comparison Suite - Angular 21 Implementation</p>
          <p class="mt-2">
            Built with Angular SSR, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}

