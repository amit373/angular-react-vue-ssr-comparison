import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-md border bg-muted/50 p-4">
      <div class="text-sm text-muted-foreground">{{ label }}</div>
      <div class="mt-1 text-2xl font-bold">{{ value }}</div>
    </div>
  `,
})
export class MetricCardComponent {
  @Input() label!: string;
  @Input() value!: string;
}

