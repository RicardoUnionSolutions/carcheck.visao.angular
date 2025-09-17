import { TestBed, waitForAsync } from "@angular/core/testing";
import { FormaPagamentoComponent } from "./forma-pagamento.component";
import { PagSeguroService } from "../../service/pagseguro.service";
import { AnalyticsService } from "../../service/analytics.service";
import { ModalService } from "../../service/modal.service";
import { PagamentoService } from "../../service/pagamento.service";

class PagSeguroServiceStub {
  carregaJavascript = jasmine
    .createSpy("carregaJavascript")
    .and.returnValue(Promise.resolve());
  getSession = jasmine
    .createSpy("getSession")
    .and.returnValue(Promise.resolve("sess"));
  carregarMeioPagamento = jasmine
    .createSpy("carregarMeioPagamento")
    .and.returnValue(Promise.resolve([{ tipo: "DEBITO", lista: ["b"] }]));
  getTokenEnvioPagSeguro = jasmine
    .createSpy("getTokenEnvioPagSeguro")
    .and.returnValue("token");
}

class AnalyticsServiceStub {
  registroEntrandoPagamento = jasmine.createSpy("registroEntrandoPagamento");
}

class ModalServiceStub {
  open = jasmine.createSpy("open");
  close = jasmine.createSpy("close");
}

class PagamentoServiceStub {
  validaCupom = jasmine
    .createSpy("validaCupom")
    .and.returnValue(Promise.resolve(true));
  dadosCupom = jasmine
    .createSpy("dadosCupom")
    .and.returnValue(Promise.resolve([{ valorDesconto: 10 }]));
}

describe("FormaPagamentoComponent", () => {
  let component: FormaPagamentoComponent;
  let pagSeguro: PagSeguroServiceStub;
  let analytics: AnalyticsServiceStub;
  let pagamentoService: PagamentoServiceStub;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormaPagamentoComponent],
      providers: [
        { provide: PagSeguroService, useClass: PagSeguroServiceStub },
        { provide: AnalyticsService, useClass: AnalyticsServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: PagamentoService, useClass: PagamentoServiceStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    const fixture = TestBed.createComponent(FormaPagamentoComponent);
    component = fixture.componentInstance;
    component.valorTotal = 100;
    pagSeguro = TestBed.inject(PagSeguroService) as any;
    analytics = TestBed.inject(AnalyticsService) as any;
    pagamentoService = TestBed.inject(PagamentoService) as any;
  });

  it("should call analytics on init", () => {
    component.ngOnInit();
    expect(analytics.registroEntrandoPagamento).toHaveBeenCalled();
  });

  it("should recalculate on changes", () => {
    spyOn(component, "calcularTotalComDesconto");
    component.ngOnChanges();
    expect(component.calcularTotalComDesconto).toHaveBeenCalled();
  });

  it("should calculate discount values", () => {
    component.cupom = "DESC";
    component.valorDesconto = 10;
    spyOn(component.valorTotalDescontoChange, "emit");
    component.calcularTotalComDesconto();
    expect(component.pagamento.cupomDesconto).toBe("DESC");
    expect(component.valorTotalDesconto).toBe(90);
    expect(component.valorTotalDescontoChange.emit).toHaveBeenCalledWith(90);
  });

  it("should load pagseguro data", async () => {
    await component.carregaJavascriptPagseguro();
    expect(pagSeguro.carregaJavascript).toHaveBeenCalled();
    expect(pagSeguro.getSession).toHaveBeenCalled();
    expect(pagSeguro.carregarMeioPagamento).toHaveBeenCalled();
    expect(component.listaPagamento.length).toBe(1);
    expect(component.bandeirasDebito).toEqual(["b"]);
    expect(component.pagamento.tokenEnvioPagSeguro).toBe("token");
  });

  it("should handle error loading pagseguro", async () => {
    pagSeguro.carregaJavascript.and.returnValue(Promise.reject("e"));
    await component.carregaJavascriptPagseguro();
    expect(pagSeguro.carregaJavascript).toHaveBeenCalled();
  });

  it("should open termos de uso modal", () => {
    component.openModalTermosUso();
    expect(component.mostrarModalTermos).toBeTrue();
  });

  it("should close termos de uso modal confirming", () => {
    component.pagamento.termosUso = false;
    component.termosUsoAlert = true;
    component.mostrarModalTermos = true;
    component.closeModalTermosUso(true);
    expect(component.pagamento.termosUso).toBeTrue();
    expect(component.termosUsoAlert).toBeFalse();
    expect(component.mostrarModalTermos).toBeFalse();
  });

  it("should close termos de uso modal without confirming", () => {
    component.pagamento.termosUso = false;
    component.mostrarModalTermos = true;
    component.closeModalTermosUso(false);
    expect(component.pagamento.termosUso).toBeFalse();
    expect(component.mostrarModalTermos).toBeFalse();
  });

  it("should return early when cupom is empty", async () => {
    component.cupom = "  ";
    spyOn(component, "calcularTotalComDesconto");
    await component.validaCupom();
    expect(component.cupomError).toBeTruthy();
    expect(component.cupomMsg).toBe("Cupom não informado.");
    expect(component.valorDesconto).toBe(0);
    expect(component.calcularTotalComDesconto).toHaveBeenCalled();
  });

  it("should validate cupom successfully", async () => {
    component.cupom = "DESC";
    pagamentoService.validaCupom.and.returnValue(Promise.resolve(true));
    pagamentoService.dadosCupom.and.returnValue(
      Promise.resolve([{ valorDesconto: 20 }])
    );
    await component.validaCupom();
    expect(component.cupomError).toBeFalsy();
    expect(component.valorDesconto).toBe(20);
    expect(component.cupomMsg).toContain("aplicado com sucesso");
  });

  it("should handle invalid cupom", async () => {
    component.cupom = "DESC";
    pagamentoService.validaCupom.and.returnValue(Promise.resolve(false));
    await component.validaCupom();
    expect(component.cupomError).toBeTruthy();
    expect(component.cupomMsg).toBe("O cupom não é válido.");
    expect(component.valorDesconto).toBe(0);
  });

  it("should handle error validating cupom", async () => {
    component.cupom = "DESC";
    pagamentoService.validaCupom.and.returnValue(Promise.reject("e"));
    await component.validaCupom();
    expect(component.cupomError).toBeTruthy();
    expect(component.cupomMsg).toBe("Erro ao tentar válidar o cupom.");
    expect(component.valorDesconto).toBe(0);
  });

  it("should remove cupom", () => {
    component.valorDesconto = 10;
    component.cupom = "ABC";
    component.cupomError = true;
    component.cupomMsg = "msg";
    spyOn(component, "calcularTotalComDesconto");
    component["removerCupom"]();
    expect(component.valorDesconto).toBe(0);
    expect(component.cupom).toBe("");
    expect(component.cupomError).toBeFalsy();
    expect(component.cupomMsg).toBe("");
    expect(component.calcularTotalComDesconto).toHaveBeenCalled();
  });

  it("should return default payment object", () => {
    const padrao = component["getPagamentoPadrao"]();
    expect(padrao.parcela.quantidadeParcela).toBe(1);
    expect(padrao.parcela.total).toBe(100);
  });

  it("should throw when termos de uso not accepted", () => {
    component.pagamento.termosUso = false;
    expect(() => component.getPagamento()).toThrow("ERRO_TERMO_USO");
    expect(component.termosUsoAlert).toBeTruthy();
  });

  it("should throw when credito form not found", () => {
    component.pagamento.termosUso = true;
    component.credito = {} as any;
    expect(() => component.getPagamento()).toThrow(
      "ERRO_CREDITO_FORM_NAO_ENCONTRADO"
    );
  });

  it("should throw when credito form invalid", () => {
    component.pagamento.termosUso = true;
    const controls = {
      a: { markAsTouched: jasmine.createSpy("markAsTouched") },
    };
    component.credito = { form: { invalid: true, controls } } as any;

    expect(() => component.getPagamento()).toThrow(
      "ERRO_CREDITO_FORM_INVALIDO"
    );
    expect(controls.a.markAsTouched).toHaveBeenCalled();
  });

  it("should return credito payment without cupom", () => {
    component.pagamento.termosUso = true;
    component.credito = {
      form: { invalid: false, controls: {}, value: { teste: 1 } },
    } as any;
    component.cupom = "";
    const result = component.getPagamento();
    expect(result.tipo).toBe("CARTAO");
    expect(result.CARTAO.teste).toBe(1);
  });

  it("should return credito payment with cupom", () => {
    component.pagamento.termosUso = true;
    component.credito = {
      form: { invalid: false, controls: {}, value: {} },
    } as any;
    component.cupom = "OK";
    component.cupomError = false;
    const result = component.getPagamento();
    expect(result.CARTAO.parcela.quantidadeParcela).toBe(1);
  });

  it("should return boleto payment", () => {
    component.pagamento.termosUso = true;
    component.formaPagamento = component.tabIndex.boleto;
    const result = component.getPagamento();
    expect(result.tipo).toBe("BOLETO");
    expect(result.BOLETO.parcela.quantidadeParcela).toBe(1);
  });

  it("should return pix payment", () => {
    component.pagamento.termosUso = true;
    component.formaPagamento = component.tabIndex.pix;
    const result = component.getPagamento();
    expect(result.tipo).toBe("PIX");
    expect(result.PIX.parcela.quantidadeParcela).toBe(1);
  });

  it("should throw for invalid payment type", () => {
    component.pagamento.termosUso = true;
    component.formaPagamento = 999;
    expect(() => component.getPagamento()).toThrow(
      "ERRO_TIPO_PAGAMENTO_INVALIDO"
    );
  });
});
