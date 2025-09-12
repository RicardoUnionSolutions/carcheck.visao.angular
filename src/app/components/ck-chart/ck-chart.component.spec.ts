import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CkChartComponent } from "./ck-chart.component";
import { By } from "@angular/platform-browser";

describe("CkChartComponent", () => {
  let component: CkChartComponent;
  let fixture: ComponentFixture<CkChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CkChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should render the main chart container", () => {
    const chart = fixture.debugElement.query(By.css(".chart-bar-data"));
    expect(chart).toBeTruthy();
  });

  it("should render 5 bar containers", () => {
    const containers = fixture.debugElement.queryAll(By.css(".bars-container"));
    expect(containers.length).toBe(5);
  });

  it("each bar container should contain 2 bars", () => {
    const containers = fixture.debugElement.queryAll(By.css(".bars-container"));
    containers.forEach((container) => {
      const bars = container.queryAll(By.css(".bar"));
      expect(bars.length).toBe(2);
    });
  });

  it('each label should display "2015"', () => {
    const labels = fixture.debugElement.queryAll(
      By.css(".bars-container .label")
    );
    expect(labels.length).toBe(5);
    labels.forEach((label) => {
      expect(label.nativeElement.textContent.trim()).toBe("2015");
    });
  });

  it("should render 4 grid lines", () => {
    const lines = fixture.debugElement.queryAll(By.css(".grid .line"));
    expect(lines.length).toBe(4);
  });

  it("should render without throwing even if modified (resilience test)", () => {
    expect(() => {
      (component as any)["anyProp"] = [];
      fixture.detectChanges();
    }).not.toThrow();
  });
});
