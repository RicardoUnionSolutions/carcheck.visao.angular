import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StatusPagamentoService } from './status-pagamento.service';
import { VariableGlobal } from './variable.global.service';
import { TokenService } from './token.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

class VariableGlobalStub {
  getUrl(url: string = '') {
    return 'http://example.com/' + url;
  }
}

class TokenServiceStub {}

describe('StatusPagamentoService', () => {
  let service: StatusPagamentoService;
  let httpMock: HttpTestingController;
  let variableGlobal: VariableGlobal;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        StatusPagamentoService,
        { provide: VariableGlobal, useClass: VariableGlobalStub },
        { provide: TokenService, useClass: TokenServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});

    service = TestBed.inject(StatusPagamentoService);
    httpMock = TestBed.inject(HttpTestingController);
    variableGlobal = TestBed.inject(VariableGlobal);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post pesquisa data to pagamento/lista endpoint', () => {
    const pesquisa = { foo: 'bar' };
    const resposta = { resultado: [] };
    spyOn(variableGlobal, 'getUrl').and.callThrough();

    service.carregarLista(pesquisa).subscribe((res) => {
      expect(res).toEqual(resposta);
    });

    const req = httpMock.expectOne('http://example.com/pagamento/lista');
    expect(variableGlobal.getUrl).toHaveBeenCalledWith('pagamento/lista');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(pesquisa);
    req.flush(resposta);
  });

  it('should propagate HTTP errors', () => {
    const pesquisa = { foo: 'bar' };

    service.carregarLista(pesquisa).subscribe(
      () => fail('should have emitted an error'),
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne('http://example.com/pagamento/lista');
    req.flush('error', { status: 500, statusText: 'Server Error' });
  });
});

