import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Input,
  ViewChild,
  ViewContainerRef,
  ElementRef,
} from "@angular/core";

@Component({
  selector: "app-lazy-wrapper",
  templateUrl: "./lazy-wrapper.component.html",
})
export class LazyWrapperComponent implements AfterViewInit {
  @Input() component: any;

  @ViewChild("container", { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  @ViewChild("anchor", { static: true }) anchor!: ElementRef;

  constructor(private resolver: ComponentFactoryResolver) {}

  ngAfterViewInit() {
    if (!this.component) {
      console.warn("Nenhum componente informado para lazy load.");
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        const factory = this.resolver.resolveComponentFactory(this.component);
        this.container.createComponent(factory);
      }
    });

    observer.observe(this.anchor.nativeElement);
  }
}
