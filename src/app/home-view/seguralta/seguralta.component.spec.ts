import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { SeguraltaComponent } from "./seguralta.component";

describe("SeguraltaComponent", () => {
  let component: SeguraltaComponent;
  let fixture: ComponentFixture<SeguraltaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SeguraltaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguraltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render main heading", () => {
    const heading = fixture.debugElement.query(By.css(".titulo"))
      .nativeElement as HTMLElement;
    expect(heading.textContent).toContain("Carcheck Brasil");
    expect(heading.textContent).toContain("Seguralta");
  });

  it("should display logo with correct alt text", () => {
    const logo = fixture.debugElement.query(By.css("img.logo"))
      .nativeElement as HTMLImageElement;
    expect(logo.getAttribute("src")).toBe("./assets/images/seguralta.png");
    expect(logo.getAttribute("alt")).toBe("Seguralta");
  });

  it("should have two service sections with proper links", () => {
    const servicos = fixture.debugElement.queryAll(By.css(".servico"));
    expect(servicos.length).toBe(2);

    const seguro = servicos[0];
    const seguroHeading = seguro.query(By.css("h3")).nativeElement as HTMLElement;
    expect(seguroHeading.textContent).toContain("Seguro de Veículos");
    const seguroLink = seguro.query(By.css("a"))
      .nativeElement as HTMLAnchorElement;
    expect(seguroLink.getAttribute("href")).toBe(
      "https://jessicasouza.seguralta.com.br"
    );
    expect(seguroLink.getAttribute("target")).toBe("_blank");

    const financiamento = servicos[1];
    const financiamentoHeading = financiamento.query(By.css("h3")).nativeElement as HTMLElement;
    expect(financiamentoHeading.textContent).toContain("Financiamento");
    const financiamentoLink = financiamento.query(By.css("a"))
      .nativeElement as HTMLAnchorElement;
    expect(financiamentoLink.getAttribute("href")).toContain(
      "https://wa.me/5511916668244"
    );
    expect(financiamentoLink.getAttribute("target")).toBe("_blank");
  });

  it("should render social links with correct URLs", () => {
    const whatsapp = fixture.debugElement.query(
      By.css("a.social-icon.whatsapp")
    ).nativeElement as HTMLAnchorElement;
    expect(whatsapp.getAttribute("href")).toBe(
      "https://wa.me/5511916668244"
    );
    expect(whatsapp.getAttribute("target")).toBe("_blank");

    const instagram = fixture.debugElement.query(
      By.css("a.social-icon.instagram")
    ).nativeElement as HTMLAnchorElement;
    expect(instagram.getAttribute("href")).toBe(
      "https://instagram.com/jessicaseguralta"
    );
    expect(instagram.getAttribute("target")).toBe("_blank");
  });

  it("should display site link at the bottom", () => {
    const siteLink = fixture.debugElement.query(By.css(".site-link a"))
      .nativeElement as HTMLAnchorElement;
    expect(siteLink.textContent).toContain("jessicasouza.seguralta.com.br");
    expect(siteLink.getAttribute("href")).toBe(
      "https://jessicasouza.seguralta.com.br"
    );
    expect(siteLink.getAttribute("target")).toBe("_blank");
  });
});

