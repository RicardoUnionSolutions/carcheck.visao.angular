import { TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { PagarDebitosService } from "./pagar-debitos.service";
import { VariableGlobal } from "./variable.global.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("PagarDebitosService", () => {
  let service: PagarDebitosService;
  let httpMock: HttpTestingController;
  let variableGlobalSpy: jasmine.SpyObj<VariableGlobal>;
  const baseUrl = "http://api";

  beforeEach(() => {
    variableGlobalSpy = jasmine.createSpyObj("VariableGlobal", ["getUrl"]);
    variableGlobalSpy.getUrl.and.callFake((url: string) => `${baseUrl}/${url}`);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PagarDebitosService,
        { provide: VariableGlobal, useValue: variableGlobalSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PagarDebitosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe("consultarDebitos", () => {
    it("should POST dados to consultarDebitos endpoint", () => {
      const payload = { a: 1 };
      const mockResponse = { ok: true };

      service.consultarDebitos(payload).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/pinpag/consultarDebitos`);
      expect(variableGlobalSpy.getUrl).toHaveBeenCalledWith(
        "pinpag/consultarDebitos"
      );
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });

    it("should propagate error response", () => {
      const payload = { a: 1 };
      service.consultarDebitos(payload).subscribe({
        next: () => fail("should have errored"),
        error: (err) => {
          expect(err.status).toBe(500);
        },
      });
      const req = httpMock.expectOne(`${baseUrl}/pinpag/consultarDebitos`);
      req.flush(null, { status: 500, statusText: "Server Error" });
    });
  });

  describe("buscarPeloConsultaId", () => {
    it("should GET consultar by consultaId", () => {
      const id = "123";
      const mockResponse = { id };

      service.buscarPeloConsultaId(id).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/pinpag/buscarConsulta/${id}`);
      expect(variableGlobalSpy.getUrl).toHaveBeenCalledWith(
        `pinpag/buscarConsulta/${id}`
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockResponse);
    });

    it("should propagate error when GET fails", () => {
      const id = "456";

      service.buscarPeloConsultaId(id).subscribe({
        next: () => fail("should have errored"),
        error: (err) => expect(err.status).toBe(404),
      });

      const req = httpMock.expectOne(`${baseUrl}/pinpag/buscarConsulta/${id}`);
      req.flush("not found", { status: 404, statusText: "Not Found" });
    });
  });

  describe("buscarRetorno", () => {
    it("should GET retorno by consultId", () => {
      const consultId = "789";
      const mockResponse = { status: "completed" };

      service.buscarRetorno(consultId).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/pinpag/buscarRetorno/${consultId}`);
      expect(variableGlobalSpy.getUrl).toHaveBeenCalledWith(
        `pinpag/buscarRetorno/${consultId}`
      );
      expect(req.request.method).toBe("GET");
      req.flush(mockResponse);
    });

    it("should propagate error when buscarRetorno fails", () => {
      const consultId = "999";

      service.buscarRetorno(consultId).subscribe({
        next: () => fail("should have errored"),
        error: (err) => expect(err.status).toBe(500),
      });

      const req = httpMock.expectOne(`${baseUrl}/pinpag/buscarRetorno/${consultId}`);
      req.flush("error", { status: 500, statusText: "Server Error" });
    });
  });

  describe("gerarLinkPagamento", () => {
    it("should POST dados to gerarLinkPagamento endpoint", () => {
      const payload = { b: 2 };
      const mockResponse = { url: "http://link" };

      service.gerarLinkPagamento(payload).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/pinpag/gerarLinkPagamento`);
      expect(variableGlobalSpy.getUrl).toHaveBeenCalledWith(
        "pinpag/gerarLinkPagamento"
      );
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });

    it("should propagate error when gerarLinkPagamento fails", () => {
      const payload = { b: 2 };

      service.gerarLinkPagamento(payload).subscribe({
        next: () => fail("should have errored"),
        error: (err) => expect(err.status).toBe(400),
      });

      const req = httpMock.expectOne(`${baseUrl}/pinpag/gerarLinkPagamento`);
      req.flush("error", { status: 400, statusText: "Bad Request" });
    });
  });
});

