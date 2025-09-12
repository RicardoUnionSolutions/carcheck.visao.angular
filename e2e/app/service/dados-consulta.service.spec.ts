import { TestBed } from "@angular/core/testing";

import { DadosConsultaService } from "./dados-consulta.service";

describe("DadosConsultaService", () => {
  let service: DadosConsultaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DadosConsultaService],
    });
    service = TestBed.inject(DadosConsultaService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should return empty object before setting dados", () => {
    expect(service.getDados()).toEqual({});
  });

  it("should store and retrieve consultation data", () => {
    const dados = { placa: "ABC1234", modelo: "Teste" };
    service.setDados(dados);
    expect(service.getDados()).toEqual(dados);
  });

  it("should clear stored consultation data", () => {
    service.setDados({ placa: "XYZ9876" });
    service.clearDados();
    expect(service.getDados()).toEqual({});
  });

  it("should override previous consultation data when set again", () => {
    service.setDados({ placa: "AAA1111" });
    service.setDados({ placa: "BBB2222" });
    expect(service.getDados()).toEqual({ placa: "BBB2222" });
  });

  it("should provide the same instance across injections", () => {
    const anotherInstance = TestBed.inject(DadosConsultaService);
    expect(service).toBe(anotherInstance);
  });
});
