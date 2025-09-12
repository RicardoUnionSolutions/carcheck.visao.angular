import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, OnDestroy } from '@angular/core';

@Directive({
  selector: '[infinite-scroll]',
  standalone: true
})
export class InfiniteScrollDirective implements OnDestroy {
  @Input() infiniteScrollDistance: number = 1;
  @Input() infiniteScrollUpDistance: number = 2;
  @Input() infiniteScrollThrottle: number = 300;
  @Output() scrolled = new EventEmitter<any>();
  @Output() scrolledUp = new EventEmitter<any>();

  private throttleTimer: any;

  constructor(private element: ElementRef) {}

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if (this.throttleTimer) {
      return;
    }

    this.throttleTimer = setTimeout(() => {
      const element = this.element.nativeElement;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight;
      const height = element.clientHeight;
      const distanceFromBottom = scrollHeight - scrollTop - height;

      // Scroll down
      if (distanceFromBottom <= this.infiniteScrollDistance) {
        this.scrolled.emit(event);
      }

      // Scroll up
      if (scrollTop <= this.infiniteScrollUpDistance) {
        this.scrolledUp.emit(event);
      }

      this.throttleTimer = null;
    }, this.infiniteScrollThrottle);
  }

  ngOnDestroy() {
    if (this.throttleTimer) {
      clearTimeout(this.throttleTimer);
    }
  }
}
