import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { observeIntersection } from '@ssr-comparison/utils';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true,
})
export class InfiniteScrollDirective implements OnInit, OnDestroy {
  @Input() rootMargin = '600px 0px';
  @Input() disabled = false;

  @Output() intersect = new EventEmitter<void>();

  private cleanup: (() => void) | null = null;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.cleanup = observeIntersection(
      this.host.nativeElement,
      () => {
        if (this.disabled) return;
        this.intersect.emit();
      },
      { rootMargin: this.rootMargin }
    );
  }

  ngOnDestroy() {
    this.cleanup?.();
    this.cleanup = null;
  }
}
