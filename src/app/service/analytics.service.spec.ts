import { TestBed } from "@angular/core/testing";
import { AnalyticsService } from "./analytics.service";
import { PessoaService } from "./pessoa.service";

class PessoaServiceStub {
  getEmail() {
    return "user@example.com";
  }
  getTelefone() {
    return "123456";
  }
}

describe("AnalyticsService", () => {
  let service: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalyticsService,
        { provide: PessoaService, useClass: PessoaServiceStub },
      ],
    });
    service = TestBed.inject(AnalyticsService);
    (window as any).gtag = jasmine.createSpy("gtag");
  });

  it("should send conversion event with computed items and totals", () => {
    const pag = { tipoPagamento: "credit" };
    const itens = [
      {
        quantidade: 2,
        valorConsulta: 10,
        composta: { id: 1, nome: "Consulta A", tipoProduto: "CONSULTA" },
      },
      {
        quantidade: 1,
        valorConsulta: 20,
        composta: {
          id: 2,
          tipoProduto: "LAUDO",
          label: "Laudo X",
          valorConsulta: 20,
        },
      },
      {
        quantidade: 0,
        valorConsulta: 30,
        composta: { id: 3, nome: "Ignored", tipoProduto: "CONSULTA" },
      },
    ];
    service.pagamentoFinalizado(pag, itens);
    expect((window as any).gtag).toHaveBeenCalledWith("event", "conversaoVenda", {
      email: "user@example.com",
      telefone: "123456",
      tipopagamento: "credit",
      totalpagamento: 40,
      totalItens: 2,
      tipoCompra: "multipla",
      currency: "BRL",
      itens: [
        { id: 1, nome: "Consulta A", valor: 10, quantidade: 2, tipo: "CONSULTA" },
        { id: 2, nome: "Laudo X", valor: 20, quantidade: 1, tipo: "LAUDO" },
      ],
      possuiLaudo: true,
    });
  });

  it("should send conversion event using provided tipoCompra", () => {
    const pag = { tipoPagamento: "credit" };
    const itens = [
      {
        quantidade: 1,
        valorConsulta: 10,
        composta: { id: 1, nome: "Consulta A", tipoProduto: "CONSULTA" },
      },
    ];
    service.pagamentoFinalizado(pag, itens, "manual");
    expect((window as any).gtag).toHaveBeenCalledWith(
      "event",
      "conversaoVenda",
      jasmine.objectContaining({
        tipoCompra: "manual",
        totalpagamento: 10,
        totalItens: 1,
        possuiLaudo: false,
      })
    );
  });

  it("should send approved conversion event with computed values", () => {
    const pag = { tipoPagamento: "credit" };
    const itens = [
      {
        quantidade: 1,
        valorConsulta: 10,
        composta: { id: 1, nome: "Consulta A", tipoProduto: "CONSULTA" },
      },
    ];
    service.pagamentoAprovado(pag, itens);
    expect((window as any).gtag).toHaveBeenCalledWith("event", "conversaoVendaAprovado", {
      email: "user@example.com",
      telefone: "123456",
      tipopagamento: "credit",
      totalpagamento: 10,
      totalItens: 1,
      tipoCompra: "unica",
      currency: "BRL",
      itens: [
        { id: 1, nome: "Consulta A", valor: 10, quantidade: 1, tipo: "CONSULTA" },
      ],
    });
  });

  it("should send homepage view event", () => {
    service.homePageSistema();
    expect((window as any).gtag).toHaveBeenCalledWith("event", "pageView", {
      page_title: "home",
      page_location: "https://carcheckbrasil.com.br/home",
      email: "user@example.com",
    });
  });

  it("should send experiment event", () => {
    service.experimentou();
    expect((window as any).gtag).toHaveBeenCalledWith("event", "consultaTeste", {
      path: "/consulta-teste",
      email: "user@example.com",
    });
  });

  it("should send addToCart event for single consulta", () => {
    service.addToCart("placa");
    expect((window as any).gtag).toHaveBeenCalledWith("event", "addToCart", {
      path: "/comprar-consulta-placa",
      email: "user@example.com",
      telefone: "123456",
      produto: "Consulta placa",
    });
  });

  it("should send addToCart event for credit purchase", () => {
    service.addToCartCredito(["A", "B"]);
    expect((window as any).gtag).toHaveBeenCalledWith("event", "addToCart", {
      path: "/processo-compra-multipla",
      email: "user@example.com",
      telefone: "123456",
      produtos: ["A", "B"],
    });
  });

  it("should send new registration events", () => {
    service.novoCadastro();
    service.novoCadastroFb();
    service.novoCadastroGoogle();
    service.cadastroCompleto();
    expect((window as any).gtag).toHaveBeenCalledTimes(4);
    expect((window as any).gtag.calls.argsFor(0)).toEqual([
      "event",
      "cadastroInicial",
    ]);
    expect((window as any).gtag.calls.argsFor(1)).toEqual([
      "event",
      "cadastroInicialFacebook",
    ]);
    expect((window as any).gtag.calls.argsFor(2)).toEqual([
      "event",
      "cadastroInicialGoogle",
    ]);
    expect((window as any).gtag.calls.argsFor(3)).toEqual([
      "event",
      "cadastroFinalizado",
    ]);
  });

  it("should send selected consultation type", () => {
    service.selecionouTipoConsulta("completa");
    service.selecionouTipoConsulta(null);
    expect((window as any).gtag.calls.argsFor(0)).toEqual([
      "event",
      "selecionouTipoConsulta",
      "completa",
    ]);
    expect((window as any).gtag.calls.argsFor(1)).toEqual([
      "event",
      "selecionouTipoConsulta",
      "nao_informado",
    ]);
  });

  it("should send informed vehicle type", () => {
    service.informouVeiculo("placa");
    service.informouVeiculo(undefined);
    expect((window as any).gtag.calls.argsFor(0)).toEqual([
      "event",
      "informouVeiculo",
      "placa",
    ]);
    expect((window as any).gtag.calls.argsFor(1)).toEqual([
      "event",
      "informouVeiculo",
      "nao_informado",
    ]);
  });

  it("should not call gtag for placeholder methods", () => {
    service.atualizacaoPagina("home");
    service.registroEntrandoPagamento();
    service.registroCadastroCliente();
    expect((window as any).gtag).not.toHaveBeenCalled();
  });
});

