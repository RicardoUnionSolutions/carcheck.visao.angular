import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { StepByStepSmComponent } from "./step-by-step-sm.component";

describe("StepByStepSmComponent", () => {
  let component: StepByStepSmComponent;
  let fixture: ComponentFixture<StepByStepSmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StepByStepSmComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepByStepSmComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should render the provided steps correctly", () => {
    component.steps = ["Primeiro", "Segundo", "Terceiro"];
    fixture.detectChanges();

    const stepTexts = fixture.debugElement.queryAll(By.css(".step-text"));
    const renderedTexts = stepTexts.map((el) =>
      el.nativeElement.textContent.trim()
    );

    expect(renderedTexts).toEqual(["Primeiro", "Segundo", "Terceiro"]);
  });

  it('should apply "done" and "active" classes properly', () => {
    component.steps = ["Primeiro", "Segundo", "Terceiro"];
    component.active = 1;
    fixture.detectChanges();

    const steps = fixture.debugElement.queryAll(By.css(".step"));

    expect(steps[0].classes["done"]).toBeTruthy();
    expect(steps[0].classes["active"]).toBeFalsy();

    expect(steps[1].classes["active"]).toBeTruthy();
    expect(steps[1].classes["done"]).toBeFalsy();

    expect(steps[2].classes["active"]).toBeFalsy();
    expect(steps[2].classes["done"]).toBeFalsy();
  });

  it("should update progress bar width correctly", () => {
    component.steps = ["A", "B", "C"];
    const progressPercent = 100 / (component.steps.length - 1);

    // Test active = 0 (0%)
    component.active = 0;
    fixture.detectChanges();
    let progressEl: HTMLElement =
      fixture.nativeElement.querySelector(".step-progress");
    expect(progressEl.style.width).toBe(`${progressPercent * 0}%`);

    // Test active = 1 (50%)
    component.active = 1;
    fixture.detectChanges();
    progressEl = fixture.nativeElement.querySelector(".step-progress");
    expect(progressEl.style.width).toBe(`${progressPercent * 1}%`);

    // Test active = 2 (100%)
    component.active = 2;
    fixture.detectChanges();
    progressEl = fixture.nativeElement.querySelector(".step-progress");
    expect(progressEl.style.width).toBe(`${progressPercent * 2}%`);
  });

  it("should keep progress width at 0 when only one step is provided", () => {
    component.steps = ["Único"];
    component.active = 0;
    fixture.detectChanges();

    const progressEl: HTMLElement = fixture.nativeElement.querySelector(".step-progress");
    expect(progressEl.style.width).toBe("0%");

    const step = fixture.debugElement.query(By.css(".step"));
    expect(step.classes["active"]).toBeTruthy();
    expect(step.classes["done"]).toBeFalsy();
  });

  it("should render zero steps when input is empty", () => {
    component.steps = [];
    fixture.detectChanges();

    const stepEls = fixture.debugElement.queryAll(By.css(".step"));
    expect(stepEls.length).toBe(0);
  });
});
