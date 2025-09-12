import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { ServicosComponent } from "./servicos.component";
import { CardsServicosComponent } from "../../components/cards-servicos/cards-servicos.component";

describe("ServicosComponent", () => {
  let component: ServicosComponent;
  let fixture: ComponentFixture<ServicosComponent>;
  let originalObserver: any;

  beforeEach(() => {
    originalObserver = (window as any).IntersectionObserver;
    (window as any).IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    (window as any).IntersectionObserver = originalObserver;
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ServicosComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render heading text", () => {
    const heading = fixture.debugElement.query(By.css("h2"))
      .nativeElement as HTMLElement;
    expect(heading.textContent).toContain("Tá pensando em comprar um carro?");
  });

  it("should render introductory paragraph", () => {
    const paragraph = fixture.debugElement.query(By.css("p.sub"))
      .nativeElement as HTMLElement;
    expect(paragraph.textContent).toContain("Conheça nossos novos serviços");
  });

  it("should pass showNovidades true to cards servicos component", () => {
    const cardsServicosEl = fixture.debugElement.query(
      By.directive(CardsServicosComponent)
    );
    const cardsComponent =
      cardsServicosEl.componentInstance as CardsServicosComponent;
    expect(cardsComponent.showNovidades).toBeTrue();
  });
});
