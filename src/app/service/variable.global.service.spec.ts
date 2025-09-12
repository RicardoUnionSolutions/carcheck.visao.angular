import { TestBed } from "@angular/core/testing";
import { VariableGlobal } from "./variable.global.service";
import { environment } from "../../environments/environment";

describe("VariableGlobal", () => {
  let service: VariableGlobal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VariableGlobal],
    });
    service = TestBed.inject(VariableGlobal);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("getUrl", () => {
    it("should append slash when url lacks leading slash", () => {
      const result = service.getUrl("path");
      expect(result).toBe(`${environment.wsUrl}/path`);
    });

    it("should not duplicate slash when url has leading slash", () => {
      const result = service.getUrl("/path");
      expect(result).toBe(`${environment.wsUrl}/path`);
    });

    it("should return base with trailing slash when url omitted", () => {
      const result = service.getUrl();
      expect(result).toBe(`${environment.wsUrl}/`);
    });
  });

  describe("status script", () => {
    it("should default to false", () => {
      expect(service.getStatusScript()).toBeFalsy();
    });

    it("should update and retrieve status correctly", () => {
      service.setStatusScript(true);
      expect(service.getStatusScript()).toBeTruthy();
      service.setStatusScript(false);
      expect(service.getStatusScript()).toBeFalsy();
    });
  });

  it("should provide correct site URLs", () => {
    const site = service.getUrlSite();
    expect(site.home).toBe("//carcheckbrasil.com.br");
    expect(site.duvidasFrequentes).toBe(
      "//carcheckbrasil.com.br/duvidas-frequentes/"
    );
  });

  it("should return predefined list of products", () => {
    const products = service.getProdutos();
    expect(products.length).toBe(3);
    expect(products[0].nome_da_consulta).toBe("Consulta Veicular Completa");
    expect(products[0].recomendada).toBeTruthy();
    expect(products[1].recomendada).toBeFalsy();
    expect(products[2].slug).toBe("leilao");
  });
});
