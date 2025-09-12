import { TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";

import { CepService } from "./cep.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("CepService", () => {
  let service: CepService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [CepService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(CepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should sanitize CEP and perform GET request", async () => {
    const mockResponse = { cep: "12345678", logradouro: "Rua A" };
    const promise = service.search("12.345-678");

    const req = httpMock.expectOne("https://viacep.com.br/ws/12345678/json/");
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);

    const result = await promise;
    expect(result).toEqual(mockResponse);
  });

  it("should propagate HTTP errors", async () => {
    const promise = service.search("12345678");

    const req = httpMock.expectOne("https://viacep.com.br/ws/12345678/json/");
    expect(req.request.method).toBe("GET");
    req.flush("Error", { status: 404, statusText: "Not Found" });

    await promise.then(
      () => fail("expected an error"),
      (error) => expect(error.status).toBe(404)
    );
  });
});

