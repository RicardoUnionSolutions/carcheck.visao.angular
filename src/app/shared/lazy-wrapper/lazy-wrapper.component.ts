import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  ElementRef,
} from "@angular/core";

@Component({
    selector: "app-lazy-wrapper",
    templateUrl: "./lazy-wrapper.component.html",
    standalone: true
})
export class LazyWrapperComponent implements AfterViewInit {
  @Input() component: any;

  @ViewChild("container", { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  @ViewChild("anchor", { static: true }) anchor!: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    if (!this.component) {
      console.warn("Nenhum componente informado para lazy load.");
      return;
    }

    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for environments without IntersectionObserver (like tests)
      this.loadComponent();
      return;
    }

    try {
      const IO: any = (window as any).IntersectionObserver;
      const observer = new IO((entries: IntersectionObserverEntry[]) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          this.loadComponent();
        }
      });

      observer.observe(this.anchor.nativeElement);
    } catch (error) {
      console.error("Error setting up IntersectionObserver:", error);
      this.loadComponent(); // Fallback to immediate load
    }
  }

  private loadComponent() {
    try {
      // In Ivy, we can directly pass the component type
      this.container.createComponent(this.component);
    } catch (error) {
      console.error("Error loading component:", error);
    }
  }
}
