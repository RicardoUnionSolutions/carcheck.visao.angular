import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Title, Meta, By } from "@angular/platform-browser";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { HomeViewComponent } from "./home-view.component";
import { DepoimentosComponent } from "./depoimentos/depoimentos.component";
import { SobreComponent } from "./sobre/sobre.component";
import { ComoFuncionaComponent } from "./como-funciona/como-funciona.component";
import { DuvidasFrequentesComponent } from "../duvidas-frequentes/duvidas-frequentes.component";
import { BlogComponent } from "./blog/blog.component";

describe("HomeViewComponent", () => {
  let component: HomeViewComponent;
  let fixture: ComponentFixture<HomeViewComponent>;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HomeViewComponent],
      providers: [Title, Meta],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(HomeViewComponent, {
        set: { imports: [] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeViewComponent);
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
    expect(titleService.setTitle).toHaveBeenCalledWith("Home - CarCheck");
    expect(titleService.getTitle()).toBe("Home - CarCheck");
  });

  it("should update meta description tag on init", () => {
    const expectedDescription =
      "Saiba tudo sobre o histórico de veículos com a CarCheck. Consultas completas com dados de leilão, sinistro, fipe, proprietários e mais.";
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: "description",
      content: expectedDescription,
    });
    const descriptionTag = metaService.getTag('name="description"');
    expect(descriptionTag?.getAttribute("content")).toBe(expectedDescription);
  });

  it("should reference correct components", () => {
    expect(component.depoimentosComponent).toBe(DepoimentosComponent);
    expect(component.sobreComponent).toBe(SobreComponent);
    expect(component.comoFuncionaComponent).toBe(ComoFuncionaComponent);
    expect(component.duvidasFrequentesComponent).toBe(
      DuvidasFrequentesComponent
    );
    expect(component.blogComponent).toBe(BlogComponent);
  });

  it("should render section title and subtext", () => {
    const heading = fixture.debugElement.query(By.css(".section-title"))
      .nativeElement as HTMLElement;
    const subtext = fixture.debugElement.query(By.css(".subtext"))
      .nativeElement as HTMLElement;
    expect(heading.textContent).toContain("Consultas e pacotes");
    expect(subtext.textContent).toContain("Explore várias opções de consulta");
  });

  it("should render produtos and lazy wrappers", () => {
    const produtosEl = fixture.debugElement.query(By.css("app-produtos"));
    expect(produtosEl).toBeTruthy();

    const lazyWrappers = fixture.debugElement.queryAll(
      By.css("app-lazy-wrapper")
    );
    expect(lazyWrappers.length).toBe(5);
  });
});
