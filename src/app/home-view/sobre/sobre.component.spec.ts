import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { ViewportScroller } from "@angular/common";
import { By } from "@angular/platform-browser";

import { SobreComponent } from "./sobre.component";

class RouterStub {
  navigate() {}
}

class ViewportScrollerStub {
  scrollToAnchor() {}
}

describe("SobreComponent", () => {
  let component: SobreComponent;
  let fixture: ComponentFixture<SobreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SobreComponent],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: ViewportScroller, useClass: ViewportScrollerStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SobreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    const el = document.getElementById("como_funciona");
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should scroll to element when it exists", () => {
    const element = document.createElement("div");
    element.id = "como_funciona";
    element.scrollIntoView = jasmine.createSpy("scrollIntoView");
    document.body.appendChild(element);

    component.scrollToElement();

    expect(element.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "center"
    });
  });

  it("should not scroll when element does not exist", () => {
    const scrollSpy = spyOn(Element.prototype, "scrollIntoView");
    component.scrollToElement();
    expect(scrollSpy).not.toHaveBeenCalled();
  });

  it("should call scrollToElement on button click", () => {
    const element = document.createElement("div");
    element.id = "como_funciona";
    element.scrollIntoView = jasmine.createSpy("scrollIntoView");
    document.body.appendChild(element);

    spyOn(component, "scrollToElement").and.callThrough();

    const button = fixture.debugElement.query(
      By.css("#botoes_sobre button.bg_azul")
    ).nativeElement as HTMLButtonElement;
    button.click();

    expect(component.scrollToElement).toHaveBeenCalled();
    expect(element.scrollIntoView).toHaveBeenCalled();
  });
});

