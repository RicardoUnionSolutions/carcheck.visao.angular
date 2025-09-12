import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { dadosConsultaService } from './dados-consulta.service';
import { VariableGlobal } from './variable.global.service';
import { LoginService } from './login.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const BASE_URL = 'http://api/';

class VariableGlobalStub {
  getUrl(url: string) {
    return BASE_URL + url;
  }
}

class LoginServiceStub {
  getTokenLogin() {
    return 'jwt-token';
  }
}

describe('dadosConsultaService', () => {
  let service: dadosConsultaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        dadosConsultaService,
        { provide: VariableGlobal, useClass: VariableGlobalStub },
        { provide: LoginService, useClass: LoginServiceStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(dadosConsultaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch consulta veiculo', () => {
    const mock = { ok: true };
    service.getConsultaVeiculo('123').subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne(BASE_URL + 'consultar/dadosConsultaVeiculo/123');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should fetch consulta veiculo company as promise', (done) => {
    const mock = { ok: true };
    const promise = service.getConsultaVeiculoCompany('123');
    const req = httpMock.expectOne(BASE_URL + 'consultar/dadosConsultaVeiculoCompany/123');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
    promise.then(res => {
      expect(res).toEqual(mock);
      done();
    });
  });

  it('should fetch consulta timeline', () => {
    const mock = { a: 1 };
    service.getConsultaTimeLine('321').subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne(BASE_URL + 'consultar/consultaTimeLine/321');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should post historico consulta', () => {
    const filtros = { page: 1 };
    const mock = { result: [] };
    service.getHistoricoConsulta(filtros).subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne(BASE_URL + 'consultar/historicoConsulta');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filtros);
    req.flush(mock);
  });

  it('should post historico geral consulta', () => {
    const filtros = { page: 2 };
    const mock = { result: [] };
    service.getHistoricoGeralConsulta(filtros).subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne(BASE_URL + 'consultar/historicoGeralConsulta');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(filtros);
    req.flush(mock);
  });

  it('should get recarregar consulta interna', () => {
    const mock = { data: true };
    service.getRecarregarConsultaInterna(5).subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne(BASE_URL + 'consultar/recarregarConsultaInterna/5');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should post recarregar consulta denatran', () => {
    const mock = { ok: 1 };
    service.getRecarregarConsultaDenatran(1, 'AAA', '1', 'doc').subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne(BASE_URL + 'consultar/recarregarConsultaDenatran/1');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ placa: 'AAA', renavan: '1', documento: 'doc' });
    req.flush(mock);
  });

  it('should get recarregar consulta company as promise', (done) => {
    const mock = { ok: true };
    const promise = service.getRecarregarConsulta(2);
    const req = httpMock.expectOne(BASE_URL + 'consultar/recarregarConsultaCompany/2');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
    promise.then(res => {
      expect(res).toEqual(mock);
      done();
    });
  });

  it('should get recarregar consulta lista pendente as promise', (done) => {
    const mock = { ok: true };
    const promise = service.getRecarregarConsultaListaPendente(3);
    const req = httpMock.expectOne(BASE_URL + 'consultar/recarregarConsultaListaPendente/3');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
    promise.then(res => {
      expect(res).toEqual(mock);
      done();
    });
  });

  it('should get credito consulta', () => {
    const mock = { credito: 10 };
    service.getCreditoConsulta().subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne(BASE_URL + 'consultar/creditoConsulta');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should get dados timeline with email', () => {
    const mock = { timeline: [] };
    service.getDadosTimeLine('test@test.com').subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne(BASE_URL + 'consultar/timeLine?email=test@test.com');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should post feedback', () => {
    const mock = { status: 'ok' };
    service.feedback(1, 'msg').subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne(BASE_URL + 'consultar/feedback');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ status: 1, msg: 'msg' });
    req.flush(mock);
  });

  it('should download pdf with arraybuffer', () => {
    const mock = new ArrayBuffer(8);
    service.downloadPdf('tok').subscribe(res => expect(res).toBe(mock));
    const req = httpMock.expectOne(BASE_URL + 'consultar/relatorioConsultaPdf');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token: 'tok' });
    expect(req.request.responseType).toBe('arraybuffer');
    req.flush(mock);
  });

  it('should get possui compra aprovada', () => {
    const mock = { possui: true };
    service.getPossuiCompraAprovada().subscribe(res => expect(res).toEqual(mock));
    const req = httpMock.expectOne(BASE_URL + 'consultar/possuiCompra');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });
});
