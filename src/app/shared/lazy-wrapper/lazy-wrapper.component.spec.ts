import { Component, ViewContainerRef } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { LazyWrapperComponent } from "./lazy-wrapper.component";
import { of } from 'rxjs';

class IntersectionObserverMock {
  callback: IntersectionObserverCallback;
  observe = jasmine.createSpy("observe");
  disconnect = jasmine.createSpy("disconnect");

  constructor(cb: IntersectionObserverCallback) {
    this.callback = cb;
  }

  trigger(isIntersecting: boolean) {
    const entry = { isIntersecting } as IntersectionObserverEntry;
    this.callback([entry], this as unknown as IntersectionObserver);
  }
}

@Component({
    template: "<div>dummy</div>",
    standalone: true
})
class DummyComponent {}

describe("LazyWrapperComponent", () => {
  let originalObserver: any;
  let observer: IntersectionObserverMock;

  beforeEach(() => {
    originalObserver = (window as any).IntersectionObserver;
    (window as any).IntersectionObserver = class MockIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        observer = new IntersectionObserverMock(cb);
        return observer as unknown as IntersectionObserver;
      }
    } as any;
  });

  afterEach(() => {
    (window as any).IntersectionObserver = originalObserver;
  });

  let component: LazyWrapperComponent;
  let fixture: ComponentFixture<LazyWrapperComponent>;
  let mockViewContainerRef: jasmine.SpyObj<ViewContainerRef>;

  beforeEach(waitForAsync(() => {
    mockViewContainerRef = jasmine.createSpyObj('ViewContainerRef', ['createComponent']);

    TestBed.configureTestingModule({
      imports: [LazyWrapperComponent, DummyComponent],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(LazyWrapperComponent);
    component = fixture.componentInstance;
    component['container'] = mockViewContainerRef;
  }));

  it("should warn when component is not provided", () => {
    const warnSpy = spyOn(console, "warn");
    const testFixture = TestBed.createComponent(LazyWrapperComponent);
    testFixture.detectChanges();
    expect(warnSpy).toHaveBeenCalledWith(
      "Nenhum componente informado para lazy load."
    );
    expect((window as any).IntersectionObserver).not.toHaveBeenCalled();
  });

  it("should observe anchor and create component on intersecting", () => {
    const fixture = TestBed.createComponent(LazyWrapperComponent);
    const component = fixture.componentInstance;
    component.component = DummyComponent;
    
    // Reset any existing spies
    jasmine.getEnv().allowRespy(true);
    
    const createSpy = spyOn(component.container, "createComponent").and.callThrough();

    fixture.detectChanges();
    expect(observer.observe).toHaveBeenCalledWith(
      component.anchor.nativeElement
    );

    observer.trigger(false);
    expect(createSpy).not.toHaveBeenCalled();
    expect(observer.disconnect).not.toHaveBeenCalled();

    observer.trigger(true);
    expect(createSpy).toHaveBeenCalled();
    expect(observer.disconnect).toHaveBeenCalled();
  });
});
