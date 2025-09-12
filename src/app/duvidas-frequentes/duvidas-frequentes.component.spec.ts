import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Title, Meta } from "@angular/platform-browser";
import { DuvidasFrequentesComponent } from "./duvidas-frequentes.component";
import { faqs } from "../utils/faqs";

describe("DuvidasFrequentesComponent", () => {
  let component: DuvidasFrequentesComponent;
  let fixture: ComponentFixture<DuvidasFrequentesComponent>;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DuvidasFrequentesComponent],
      providers: [Title, Meta],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuvidasFrequentesComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);

    spyOn(titleService, "setTitle").and.callThrough();
    spyOn(metaService, "updateTag").and.callThrough();

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set page title on init", () => {
    expect(titleService.setTitle).toHaveBeenCalledWith(
      "Dúvidas Frequentes | CarCheck"
    );
    expect(titleService.getTitle()).toBe("Dúvidas Frequentes | CarCheck");
  });

  it("should update meta description tag on init", () => {
    const expectedDescription =
      "Encontre respostas para as perguntas mais comuns sobre nossas consultas veiculares, planos e formas de pagamento.";

    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: "description",
      content: expectedDescription,
    });

    const descriptionTag = metaService.getTag('name="description"');
    expect(descriptionTag?.getAttribute("content")).toBe(expectedDescription);
  });

  it("should render all FAQ items", () => {
    const cards = fixture.debugElement.queryAll(By.css(".card"));
    expect(cards.length).toBe(faqs.length);

    const firstQuestion = cards[0].query(By.css(".question-text"))
      .nativeElement as HTMLElement;
    expect(firstQuestion.textContent).toContain(faqs[0].question);
  });

  it("should toggle card state", () => {
    expect(component.activeCard).toBe("");
    component.toggleCard("collapse1");
    expect(component.activeCard).toBe("collapse1");
    component.toggleCard("collapse1");
    expect(component.activeCard).toBe("");
    component.toggleCard("collapse1");
    component.toggleCard("collapse2");
    expect(component.activeCard).toBe("collapse2");
  });

  it("should open and close card on click", () => {
    const headers = fixture.debugElement.queryAll(By.css(".card-header"));
    const bodies = fixture.debugElement.queryAll(
      By.css(".accordion-body-wrapper")
    );
    const icon = headers[0].query(By.css(".icon")).nativeElement as HTMLElement;

    // initially closed
    expect(bodies[0].classes["open"]).toBeFalsy();
    expect(icon.classList.contains("rotar")).toBeFalsy();

    headers[0].triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(bodies[0].classes["open"]).toBeTruthy();
    expect(icon.classList.contains("rotar")).toBeTruthy();

    headers[1].triggerEventHandler("click", null);
    fixture.detectChanges();
    expect(bodies[0].classes["open"]).toBeFalsy();
    expect(bodies[1].classes["open"]).toBeTruthy();
  });
});
