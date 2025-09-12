import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Title, Meta, By } from "@angular/platform-browser";
import { PoliticaDePrivacidadeComponent } from "./politica-de-privacidade.component";

describe("PoliticaDePrivacidadeComponent", () => {
  let component: PoliticaDePrivacidadeComponent;
  let fixture: ComponentFixture<PoliticaDePrivacidadeComponent>;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PoliticaDePrivacidadeComponent],
      providers: [Title, Meta],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticaDePrivacidadeComponent);
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
      "Política de Privacidade | CarCheck"
    );
    expect(titleService.getTitle()).toBe("Política de Privacidade | CarCheck");
  });

  it("should update meta description tag on init", () => {
    const expectedDescription =
      "Saiba como protegemos seus dados. Leia nossa Política de Privacidade e entenda como tratamos suas informações pessoais.";
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: "description",
      content: expectedDescription,
    });

    const descriptionTag = metaService.getTag('name="description"');
    expect(descriptionTag?.getAttribute("content")).toBe(expectedDescription);
  });

  it("should render the privacy policy heading", () => {
    const heading = fixture.debugElement.query(By.css("h2"))
      .nativeElement as HTMLElement;
    expect(heading.textContent.toLowerCase()).toContain(
      "política de privacidade"
    );
  });

  it("should contain a contact email link", () => {
    const emailLink = fixture.debugElement.query(By.css('a[href^="mailto:"]'))
      .nativeElement as HTMLAnchorElement;
    expect(emailLink.textContent).toContain("tatiana@unionsolutions.com.br");
    expect(emailLink.getAttribute("href")).toBe(
      "mailto:tatiana@unionsolutions.com.br"
    );
  });
});
