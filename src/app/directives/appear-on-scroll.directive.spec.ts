import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AppearOnScrollDirective } from "./appear-on-scroll.directive";

class IntersectionObserverMock {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observe = jasmine.createSpy("observe");
  unobserve = jasmine.createSpy("unobserve");
  disconnect = jasmine.createSpy("disconnect");

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.callback = callback;
    this.options = options;
  }

  trigger(isIntersecting: boolean) {
    const entry = { isIntersecting } as IntersectionObserverEntry;
    this.callback([entry], this as unknown as IntersectionObserver);
  }
}

describe("AppearOnScrollDirective", () => {
  let originalObserver: any;
  let observer: IntersectionObserverMock;

  beforeEach(() => {
    // Store the original implementation
    originalObserver = (window as any).IntersectionObserver;
    
    // Create a mock implementation
    const mockIntersectionObserver = function(
      cb: IntersectionObserverCallback,
      options?: IntersectionObserverInit
    ) {
      observer = new IntersectionObserverMock(cb, options);
      return observer as unknown as IntersectionObserver;
    };
    
    // Add the mock to the window object
    (window as any).IntersectionObserver = jasmine
      .createSpy('IntersectionObserver', mockIntersectionObserver)
      .and.callThrough();
  });

  afterEach(() => {
    (window as any).IntersectionObserver = originalObserver;
  });

  describe("with custom inputs", () => {
    @Component({
    template: `<div
        appAppearOnScroll
        [threshold]="t"
        [rootMargin]="m"
      ></div>`,
    standalone: true
})
    class TestComponent {
      t = 0.3;
      m = "10px";
    }

    let fixture: ComponentFixture<TestComponent>;
    let element: DebugElement;
    let directive: AppearOnScrollDirective;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, AppearOnScrollDirective],
      });
      fixture = TestBed.createComponent(TestComponent);
      element = fixture.debugElement.query(
        By.directive(AppearOnScrollDirective)
      );
      directive = element.injector.get(AppearOnScrollDirective);
      fixture.detectChanges();
    });

    it("should create an instance", () => {
      expect(directive).toBeTruthy();
    });

    it("should create observer with provided options", () => {
      expect(observer.options).toEqual({
        root: null,
        rootMargin: "10px",
        threshold: 0.3,
      });
    });

    it("should set isVisible and add class when intersecting", () => {
      observer.trigger(true);
      fixture.detectChanges();
      expect(directive.isVisible).toBeTruthy();
      expect(element.nativeElement.classList).toContain("appear");
      expect(observer.unobserve).toHaveBeenCalledWith(element.nativeElement);
    });

    it("should not set isVisible when not intersecting", () => {
      observer.trigger(false);
      fixture.detectChanges();
      expect(directive.isVisible).toBeFalsy();
      expect(element.nativeElement.classList).not.toContain("appear");
      expect(observer.unobserve).not.toHaveBeenCalled();
    });

    it("should disconnect observer on destroy", () => {
      fixture.destroy();
      expect(observer.disconnect).toHaveBeenCalled();
    });
  });

  describe("with default inputs", () => {
    @Component({
    template: `<div appAppearOnScroll></div>`,
    standalone: true
})
    class DefaultComponent {}

    let fixture: ComponentFixture<DefaultComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DefaultComponent, AppearOnScrollDirective],
      });
      fixture = TestBed.createComponent(DefaultComponent);
      fixture.detectChanges();
    });

    it("should use default options", () => {
      expect(observer.options).toEqual({
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      });
    });
  });
});
