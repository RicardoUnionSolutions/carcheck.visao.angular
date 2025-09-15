import { Directive, ElementRef, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
    selector: '[appAppearRightOnScroll]',
    standalone: true
})
export class AppearRightOnScrollDirective implements OnInit, OnDestroy {
  @Input() threshold: number = 0.2;
  @Input() rootMargin: string = '50px';
  @HostBinding('class.appearRight') isVisible = false;

  private observer!: IntersectionObserver;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    // Mostrar imediatamente para debug
    setTimeout(() => {
      this.isVisible = true;
    }, 100);

    // Fallback: se o IntersectionObserver não estiver disponível, mostrar imediatamente
    if (!window.IntersectionObserver) {
      this.isVisible = true;
      return;
    }

    const options = {
      root: null,
      rootMargin: this.rootMargin,
      threshold: this.threshold
    };

    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.isVisible = true;
        this.observer.unobserve(this.element.nativeElement);
      }
    }, options);

    this.observer.observe(this.element.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
