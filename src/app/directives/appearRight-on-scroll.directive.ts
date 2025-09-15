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
    console.log('AppearRightOnScrollDirective: Inicializando...', this.element.nativeElement);
    
    // Mostrar imediatamente para debug
    this.isVisible = true;
    console.log('AppearRightOnScrollDirective: Elemento visível imediatamente');
    
    // Fallback: se o IntersectionObserver não estiver disponível, mostrar imediatamente
    if (!window.IntersectionObserver) {
      console.log('AppearRightOnScrollDirective: IntersectionObserver não disponível, mostrando imediatamente');
      return;
    }

    const options = {
      root: null,
      rootMargin: this.rootMargin,
      threshold: this.threshold
    };

    this.observer = new IntersectionObserver(([entry]) => {
      console.log('AppearRightOnScrollDirective: IntersectionObserver callback', {
        isIntersecting: entry.isIntersecting,
        intersectionRatio: entry.intersectionRatio,
        boundingClientRect: entry.boundingClientRect
      });
      
      if (entry.isIntersecting) {
        console.log('AppearRightOnScrollDirective: Elemento visível, ativando animação');
        this.isVisible = true;
        this.observer.unobserve(this.element.nativeElement);
      }
    }, options);

    this.observer.observe(this.element.nativeElement);
    console.log('AppearRightOnScrollDirective: Observando elemento', this.element.nativeElement);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
