import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BehaviorSubject, of, throwError } from "rxjs";
import { HistoricoConsultaComponent } from "./historico-consulta.component";
import { LoginService } from "../service/login.service";
import { dadosConsultaService } from "../service/dados-consulta.service";
import { WebSocketService } from "../service/webSocket.service";
import { Title, Meta } from "@angular/platform-browser";

class LoginServiceStub {
  private loginSubject = new BehaviorSubject<any>({ nome: "Usuario Teste" });
  getLogIn() {
    return this.loginSubject.asObservable();
  }
}

class DadosConsultaServiceStub {
  historicoResponse: any = [];
  compraAprovada = false;
  getHistoricoConsulta(params: any) {
    return of(this.historicoResponse);
  }
  getPossuiCompraAprovada() {
    return of(this.compraAprovada);
  }
  getRecarregarConsultaListaPendente = jasmine
    .createSpy("getRecarregarConsultaListaPendente")
    .and.returnValue(Promise.resolve({}));
}

class WebSocketServiceStub {
  subject = new BehaviorSubject<any>({});
  openWebSocket = jasmine.createSpy("openWebSocket");
  closeWebSocket = jasmine.createSpy("closeWebSocket");
  sendMessage = jasmine.createSpy("sendMessage");
  getMessages() {
    return this.subject.asObservable();
  }
  emit(msg: any) {
    this.subject.next(msg);
  }
}

describe("HistoricoConsultaComponent", () => {
  let component: HistoricoConsultaComponent;
  let fixture: ComponentFixture<HistoricoConsultaComponent>;
  let service: DadosConsultaServiceStub;
  let titleSpy: jasmine.SpyObj<Title>;
  let metaSpy: jasmine.SpyObj<Meta>;

  beforeEach(async () => {
    titleSpy = jasmine.createSpyObj("Title", ["setTitle"]);
    metaSpy = jasmine.createSpyObj("Meta", ["updateTag"]);

    await TestBed.configureTestingModule({
      declarations: [HistoricoConsultaComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: LoginService, useClass: LoginServiceStub },
        { provide: dadosConsultaService, useClass: DadosConsultaServiceStub },
        { provide: WebSocketService, useClass: WebSocketServiceStub },
        { provide: Title, useValue: titleSpy },
        { provide: Meta, useValue: metaSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricoConsultaComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(dadosConsultaService) as any;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should init component with title, meta and load data", () => {
    const loadSpy = spyOn(component, "carregarDadosHistoricoConsulta");
    const verificaSpy = spyOn(component, "verificaCompraAprovada");
    fixture.detectChanges();
    expect(titleSpy.setTitle).toHaveBeenCalledWith(
      "Histórico de Consultas - CarCheck"
    );
    expect(metaSpy.updateTag).toHaveBeenCalled();
    expect(loadSpy).toHaveBeenCalledWith(0);
    expect(verificaSpy).toHaveBeenCalled();
  });

  it("should reset pagination and call search on pesquisar", () => {
    const loadSpy = spyOn(component, "carregarDadosHistoricoConsulta");
    component.pagina = 3;
    component.consultas = [1 as any];
    component.pesquisar();
    expect(component.pagina).toBe(0);
    expect(component.consultas.length).toBe(0);
    expect(loadSpy).toHaveBeenCalledWith(0);
  });

  it("should build consultations and set flags", () => {
    const mockData = [
      {
        id: 1,
        tipoProduto: "CONSULTA",
        consulta: [
          { codigoControle: "ERRO_FORNECEDOR" },
          { codigoControle: "PENDENTE" },
        ],
        codigoControleConsultaPrimaria: "PENDENTE",
        tokenConsulta: "token1",
        marca: "Ford",
        tipo: "Carro",
        modeloBin: "Fiesta",
        modeloDecodificador: null,
        dataConsulta: "2020-01-01",
        nomeConsulta: "Simples",
        placaEntrada: "AAA1234",
        chassiEntrada: "CHASSI",
        laudo: null,
        linkPesquisa: null,
        consultaCompany: false,
        exibirPdf: false,
        linkPdf: null,
      },
    ];
    service.historicoResponse = mockData;

    component.carregarDadosHistoricoConsulta();

    expect(component.loadingScroll).toBeFalsy();
    expect(component.consultas.length).toBe(1);
    const consulta = component.consultas[0];
    expect(consulta.status).toBe(1);
    expect(component.tokensPendente.tokens.length).toBe(1);
    expect(component.abrirWebsocket).toBeTruthy();
    expect(component.escondeBotaoFiltro).toBeTruthy();
    expect(component.novoUsuario).toBeFalsy();
    expect(component.novoUsuarioComCredito).toBeFalsy();
    expect(service.getRecarregarConsultaListaPendente).toHaveBeenCalledWith(1);
  });

  it("should mark compra aprovada", () => {
    service.compraAprovada = true;
    component.verificaCompraAprovada();
    expect(component.possuiCompraAprovada).toBeTruthy();
  });

  it("should return first name when available", () => {
    component.usuario = { nome: "Joao Silva" };
    expect(component.firstName()).toBe("Joao");
  });

  it("should return empty string when name missing", () => {
    component.usuario = {};
    expect(component.firstName()).toBe("");
  });

  it("should handle scroll down", () => {
    const loadSpy = spyOn(component, "carregarDadosHistoricoConsulta");
    component.loadingScroll = false;
    component.pagina = 0;
    component.onScrollDown(null);
    expect(component.pagina).toBe(1);
    expect(component.direction).toBe("down");
    expect(loadSpy).toHaveBeenCalledWith(1);
  });

  it("should not load on scroll down while loading", () => {
    const loadSpy = spyOn(component, "carregarDadosHistoricoConsulta");
    component.loadingScroll = true;
    component.onScrollDown(null);
    expect(loadSpy).not.toHaveBeenCalled();
  });

  it("should set direction up on onUp", () => {
    component.onUp(null);
    expect(component.direction).toBe("up");
  });

  it("should close websocket on destroy when open", () => {
    const ws = TestBed.inject(WebSocketService) as any;
    component.webSocketAberto = true;
    component.ngOnDestroy();
    expect(ws.closeWebSocket).toHaveBeenCalled();
  });

  it("should close websocket on unload when open", () => {
    const ws = TestBed.inject(WebSocketService) as any;
    component.webSocketAberto = true;
    component.fechaWebsocket();
    expect(ws.closeWebSocket).toHaveBeenCalled();
  });

  it("should not close websocket on unload when already closed", () => {
    const ws = TestBed.inject(WebSocketService) as any;
    component.webSocketAberto = false;
    component.fechaWebsocket();
    expect(ws.closeWebSocket).not.toHaveBeenCalled();
  });

  it("should update placa pesquisada on form change", () => {
    fixture.detectChanges();
    component.form.controls.placa.setValue("abc1234");
    expect(component.placaPesquisada).toBe("ABC1234");
  });

  it("should handle error when loading historico consulta", () => {
    spyOn(service, "getHistoricoConsulta").and.returnValue(
      throwError(() => "erro")
    );
    const logSpy = spyOn(console, "log");
    component.carregarDadosHistoricoConsulta();
    expect(logSpy).toHaveBeenCalled();
  });

  it("should not open websocket when there are no pendentes", () => {
    const ws = TestBed.inject(WebSocketService) as any;
    service.historicoResponse = [
      {
        id: 2,
        tipoProduto: "LAUDO",
        consulta: [],
        codigoControleConsultaPrimaria: "SEMREGISTRO",
        tokenConsulta: "token2",
        marca: null,
        tipo: null,
        modeloBin: null,
        modeloDecodificador: "Modelo",
        dataConsulta: "2020-01-02",
        nomeConsulta: "Completa",
        placaEntrada: "BBB1234",
        chassiEntrada: "CHASSI2",
      },
    ];
    component.placaPesquisada = "XYZ";
    component.carregarDadosHistoricoConsulta();
    expect(ws.openWebSocket).not.toHaveBeenCalled();
    expect(component.tokensPendente.tokens.length).toBe(0);
    expect(component.escondeBotaoFiltro).toBeFalsy();
    expect(component.consultas[0].status).toBe(0);
    expect(service.getRecarregarConsultaListaPendente).not.toHaveBeenCalled();
  });

  it("should build consulta with erro fornecedor resulting status 2", () => {
    const data = [
      {
        id: 5,
        tipoProduto: "CONSULTA",
        consulta: [{ codigoControle: "ERRO_FORNECEDOR" }],
        codigoControleConsultaPrimaria: "ERRO_FORNECEDOR",
        tokenConsulta: "token5",
        marca: "Ford",
        tipo: null,
        modeloBin: null,
        modeloDecodificador: "Ka",
        dataConsulta: "2020-01-05",
        nomeConsulta: "Basica",
        placaEntrada: "EEE1234",
        chassiEntrada: "CHASSI5",
      },
    ];
    service.historicoResponse = data;
    component.carregarDadosHistoricoConsulta();
    expect(component.consultas[0].status).toBe(2);
    expect(service.getRecarregarConsultaListaPendente).not.toHaveBeenCalled();
  });

  it("should resend tokens when websocket message is not pronto", fakeAsync(() => {
    const ws = TestBed.inject(WebSocketService) as any;
    const data = [
      {
        id: 3,
        tipoProduto: "CONSULTA",
        consulta: [{ codigoControle: "PENDENTE" }],
        codigoControleConsultaPrimaria: "PENDENTE",
        tokenConsulta: "token3",
        marca: "Fiat",
        tipo: null,
        modeloBin: "Uno",
        modeloDecodificador: null,
        dataConsulta: "2020-01-03",
        nomeConsulta: "Basica",
        placaEntrada: "CCC1234",
        chassiEntrada: "CHASSI3",
      },
    ];
    service.historicoResponse = data;
    component.carregarDadosHistoricoConsulta();
    ws.sendMessage.calls.reset();
    ws.emit({ msg: "outro" });
    tick();
    expect(ws.closeWebSocket).not.toHaveBeenCalled();
    expect(ws.sendMessage).toHaveBeenCalledWith(component.tokensPendente);
  }));

  it("should reload and close websocket when message pronto", fakeAsync(() => {
    const ws = TestBed.inject(WebSocketService) as any;
    const data = [
      {
        id: 4,
        tipoProduto: "CONSULTA",
        consulta: [{ codigoControle: "PENDENTE" }],
        codigoControleConsultaPrimaria: "PENDENTE",
        tokenConsulta: "token4",
        marca: "VW",
        tipo: null,
        modeloBin: "Gol",
        modeloDecodificador: null,
        dataConsulta: "2020-01-04",
        nomeConsulta: "Basica",
        placaEntrada: "DDD1234",
        chassiEntrada: "CHASSI4",
      },
    ];
    service.historicoResponse = data;
    component.carregarDadosHistoricoConsulta();
    service.historicoResponse = [];
    ws.emit({ msg: "pronto" });
    tick();
    expect(ws.closeWebSocket).toHaveBeenCalled();
  }));

  it("should flag novo usuario when no consultas and no credit", () => {
    component.dadosConsulta = [];
    component.consultas = [];
    component.possuiCompraAprovada = false;
    component.MontaConsultas();
    expect(component.novoUsuario).toBeTruthy();
    expect(component.novoUsuarioComCredito).toBeFalsy();
  });

  it("should flag novo usuario com credito when no consultas but has credit", () => {
    component.dadosConsulta = [];
    component.consultas = [];
    component.possuiCompraAprovada = true;
    component.MontaConsultas();
    expect(component.novoUsuarioComCredito).toBeTruthy();
    expect(component.novoUsuario).toBeFalsy();
  });

  it("should handle error on verificaCompraAprovada", () => {
    spyOn(service, "getPossuiCompraAprovada").and.returnValue(
      throwError(() => "erro")
    );
    const logSpy = spyOn(console, "log");
    component.verificaCompraAprovada();
    expect(logSpy).toHaveBeenCalled();
  });
});
