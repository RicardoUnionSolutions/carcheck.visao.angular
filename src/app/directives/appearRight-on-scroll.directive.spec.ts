import { Component, ElementRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AppearRightOnScrollDirective } from "./appearRight-on-scroll.directive";

class FakeIntersectionObserver {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observe = jasmine.createSpy("observe");
  unobserve = jasmine.createSpy("unobserve");
  disconnect = jasmine.createSpy("disconnect");
  constructor(
    cb: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {
    this.callback = cb;
    this.options = options;
    (FakeIntersectionObserver as any).instance = this;
  }
  trigger(isIntersecting: boolean) {
    const entry = { isIntersecting } as IntersectionObserverEntry;
    this.callback([entry], this as any);
  }
}

@Component({
    template: `<div
    appAppearRightOnScroll
    [threshold]="threshold"
    [rootMargin]="rootMargin"
  ></div>`,
    standalone: true
})
class TestComponent {
  threshold = 0.1;
  rootMargin = "0px";
}

describe("AppearRightOnScrollDirective", () => {
  let fixture: ComponentFixture<TestComponent>;
  let directive: AppearRightOnScrollDirective;
  let element: HTMLElement;

  beforeEach(() => {
    (window as any).IntersectionObserver = FakeIntersectionObserver as any;
    TestBed.configureTestingModule({
      declarations: [TestComponent, AppearRightOnScrollDirective],
    }).compileComponents();
    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.query(By.css("div")).nativeElement;
    directive = fixture.debugElement
      .query(By.directive(AppearRightOnScrollDirective))
      .injector.get(AppearRightOnScrollDirective);
  });

  afterEach(() => {
    delete (window as any).IntersectionObserver;
  });

  it("should create and observe element with provided options", () => {
    fixture.componentInstance.threshold = 0.5;
    fixture.componentInstance.rootMargin = "10px";
    fixture.detectChanges();
    const observer = (FakeIntersectionObserver as any)
      .instance as FakeIntersectionObserver;
    expect(directive).toBeTruthy();
    expect(observer.options).toEqual({
      root: null,
      rootMargin: "10px",
      threshold: 0.5,
    });
    expect(observer.observe).toHaveBeenCalledWith(element);
  });

  it("should add appearRight class and unobserve when intersecting", () => {
    fixture.detectChanges();
    const observer = (FakeIntersectionObserver as any)
      .instance as FakeIntersectionObserver;
    observer.trigger(true);
    fixture.detectChanges();
    expect(directive.isVisible).toBeTruthy();
    expect(observer.unobserve).toHaveBeenCalledWith(element);
    expect(element.classList.contains("appearRight")).toBeTruthy();
  });

  it("should not add class or unobserve when not intersecting", () => {
    fixture.detectChanges();
    const observer = (FakeIntersectionObserver as any)
      .instance as FakeIntersectionObserver;
    observer.trigger(false);
    fixture.detectChanges();
    expect(directive.isVisible).toBeFalsy();
    expect(observer.unobserve).not.toHaveBeenCalled();
    expect(element.classList.contains("appearRight")).toBeFalsy();
  });

  it("should disconnect observer on destroy", () => {
    fixture.detectChanges();
    const observer = (FakeIntersectionObserver as any)
      .instance as FakeIntersectionObserver;
    fixture.destroy();
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it("should not throw if destroyed before init", () => {
    const dir = new AppearRightOnScrollDirective(
      new ElementRef(document.createElement("div"))
    );
    expect(() => dir.ngOnDestroy()).not.toThrow();
  });
});
