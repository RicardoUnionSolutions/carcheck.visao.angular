import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FazerConsultaService } from './fazer-consulta.service';
import { VariableGlobal } from './variable.global.service';
import { TokenService } from './token.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class VariableGlobalStub {
  getUrl(url: string) {
    return 'test/' + url;
  }
}

class TokenServiceStub {}

describe('FazerConsultaService', () => {
  let service: FazerConsultaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        FazerConsultaService,
        { provide: VariableGlobal, useClass: VariableGlobalStub },
        { provide: TokenService, useClass: TokenServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(FazerConsultaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should POST to consultar endpoint', () => {
    const dados = { placa: 'ABC1234' };
    const mockResponse = { ok: true };

    service.consultar(dados).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('test/consultar/pegarDadosVeiculo');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ parametro: dados });
    req.flush(mockResponse);
  });

  it('should handle error on consultar', () => {
    const dados = { placa: 'ABC1234' };

    service.consultar(dados).subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('test/consultar/pegarDadosVeiculo');
    expect(req.request.method).toBe('POST');
    req.flush('error', { status: 500, statusText: 'Server Error' });
  });

  it('should POST to realizarConsulta endpoint', () => {
    const dados = { foo: 'bar' };
    const mockResponse = { success: true };

    service.realizarConsulta(dados).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('test/consultar/realizarConsultaCompany');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dados);
    req.flush(mockResponse);
  });

  it('should POST to credConsulta endpoint', () => {
    const dados = { cred: 'value' };
    const mockResponse = { result: 'ok' };

    service.credConsulta(dados).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('test/consultar/credConsulta');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ parametro: dados });
    req.flush(mockResponse);
  });

  it('should handle error on credConsulta', () => {
    const dados = { cred: 'value' };

    service.credConsulta(dados).subscribe({
      next: () => fail('should error'),
      error: (err) => {
        expect(err.status).toBe(400);
      },
    });

    const req = httpMock.expectOne('test/consultar/credConsulta');
    expect(req.request.method).toBe('POST');
    req.flush('error', { status: 400, statusText: 'Bad Request' });
  });

  it('should GET consulta cliente', () => {
    const email = 'test@example.com';
    const mockResponse = { data: [] };

    service.getConsultaCliente(email).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('test/consultar/pegarConsultaCliente?email=' + email);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should GET pacotes', () => {
    const mockResponse = { items: [] };

    service.getPacotes().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('test/consultar/getPacotes');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error on getPacotes', () => {
    service.getPacotes().subscribe({
      next: () => fail('should error'),
      error: (err) => expect(err.status).toBe(404),
    });

    const req = httpMock.expectOne('test/consultar/getPacotes');
    expect(req.request.method).toBe('GET');
    req.flush('not found', { status: 404, statusText: 'Not Found' });
  });
});

