import { TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";

import { LaudoService } from "./laudo.service";
import { VariableGlobal } from "./variable.global.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

// Stub for VariableGlobal to provide predictable URLs
class VariableGlobalStub {
  base = "http://example.com";
  getUrl(url: string = "") {
    return `${this.base}/${url}`;
  }
}

describe("LaudoService", () => {
  let service: LaudoService;
  let httpMock: HttpTestingController;
  let variable: VariableGlobalStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [{ provide: VariableGlobal, useClass: VariableGlobalStub }, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});

    service = TestBed.inject(LaudoService);
    httpMock = TestBed.inject(HttpTestingController);
    variable = TestBed.inject(VariableGlobal) as any;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should request laudo data from API", async () => {
    const token = "abc";
    const mockResponse = { status: "ok" };

    const promise = service.getLaudo(token);
    const req = httpMock.expectOne(
      `${variable.base}/consultar/dadosLaudoVeiculo/${token}`
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);

    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it("should propagate error when API request fails", async () => {
    const token = "abc";
    const promise = service.getLaudo(token);

    const req = httpMock.expectOne(
      `${variable.base}/consultar/dadosLaudoVeiculo/${token}`
    );
    req.flush("error", { status: 500, statusText: "Server Error" });

    try {
      await promise;
      fail("should have thrown");
    } catch {
      expect(true).toBeTruthy();
    }
  });

  it("should return available UF options", () => {
    const options = service.getUfOptions();
    expect(options.length).toBeGreaterThan(0);
  });

  it("should filter city options by UF", () => {
    const cities = service.getCidadeOptions("ES");
    expect(cities.every((c) => c.uf === "ES")).toBeTruthy();
  });

  it("should return city name when value exists", () => {
    const city = service.getCidadeOptions("ES")[0];
    const name = service.getCidadeNome(city.value);
    expect(name).toBe(city.label);
  });

  it("should return empty string when city value not found", () => {
    expect(service.getCidadeNome("unknown")).toBe("");
  });

  it("should return empty array when UF has no cities", () => {
    expect(service.getCidadeOptions("XX")).toEqual([]);
  });
});
