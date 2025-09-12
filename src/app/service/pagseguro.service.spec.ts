import { TestBed } from "@angular/core/testing";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { PagSeguroService } from "./pagseguro.service";
import { VariableGlobal } from "./variable.global.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

class VariableGlobalStub {
  private status = false;
  getUrl(path: string) {
    return `http://localhost/${path}`;
  }
  getStatusScript() {
    return this.status;
  }
  setStatusScript(v: boolean) {
    this.status = v;
  }
}

describe("PagSeguroService", () => {
  let service: PagSeguroService;
  let http: HttpTestingController;
  let variable: VariableGlobalStub;
  let pagSeguro: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        PagSeguroService,
        { provide: VariableGlobal, useClass: VariableGlobalStub },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(PagSeguroService);
    http = TestBed.inject(HttpTestingController);
    variable = TestBed.inject(VariableGlobal) as any;

    pagSeguro = {
      getSenderHash: jasmine.createSpy("getSenderHash"),
      createCardToken: jasmine.createSpy("createCardToken"),
      getBrand: jasmine.createSpy("getBrand"),
      getInstallments: jasmine.createSpy("getInstallments"),
      setSessionId: jasmine.createSpy("setSessionId"),
      getPaymentMethods: jasmine.createSpy("getPaymentMethods"),
    };
    (window as any).PagSeguroDirectPayment = pagSeguro;
  });

  afterEach(() => {
    http.verify();
  });

  it("should request session id from backend", async () => {
    const promise = service.getSession();
    const req = http.expectOne(variable.getUrl("pagSeguro/getIdSession"));
    expect(req.request.method).toBe("GET");
    req.flush("abc");
    const result = await promise;
    expect(result).toBe("abc");
  });

  it("should return sender hash", () => {
    pagSeguro.getSenderHash.and.returnValue("hash");
    const result = service.getTokenEnvioPagSeguro();
    expect(result).toBe("hash");
    expect(pagSeguro.getSenderHash).toHaveBeenCalled();
  });

  it("should create card token without spaces", async () => {
    pagSeguro.createCardToken.and.callFake((opts: any) => {
      expect(opts.cardNumber).toBe("123456");
      opts.success({ card: { token: "tok" } });
    });
    const token = await service.getTokenCardPagSeguro("123 456", "1", "2", "3");
    expect(token).toBe("tok");
  });

  it("should reject card token on error", async () => {
    pagSeguro.createCardToken.and.callFake((opts: any) => {
      opts.error({});
    });
    await service.getTokenCardPagSeguro("1", "2", "3", "4").then(
      () => fail("should reject"),
      () => expect(true).toBeTruthy()
    );
  });

  it("should append script and set status when not loaded", async () => {
    // Arrange
    variable.setStatusScript(false);
    const script = document.createElement('script');
    const appendSpy = spyOn(document.head, 'appendChild').and.returnValue(script);
    
    // Act - Start the async operation
    const loadPromise = service.carregaJavascript();
    
    // Trigger the load event to resolve the promise
    script.dispatchEvent(new Event('load'));
    
    // Wait for the promise to resolve
    await loadPromise;
    
    // Assert
    expect(appendSpy).toHaveBeenCalled();
    expect(variable.getStatusScript()).toBeTruthy();
  }, 10000); // Increase timeout to 10 seconds

  it("should resolve immediately if script already loaded", async () => {
    variable.setStatusScript(true);
    const appendSpy = spyOn(document.head, "appendChild");
    await service.carregaJavascript();
    expect(appendSpy).not.toHaveBeenCalled();
  });

  it("should load card brand and installments", async () => {
    pagSeguro.getBrand.and.callFake(({ success }: any) => {
      success({
        brand: {
          name: "visa",
          cvvSize: 3,
          hasCvv: true,
          hasDueDate: true,
          hasPassword: false,
          acceptedLengths: [16],
        },
      });
    });
    spyOn(service, "carregarParcelasPagamento").and.returnValue(
      Promise.resolve([{ quantidadeParcela: 1 }])
    );
    const result = await service.carregarbandeiraCartao("123", 50);
    expect(result.bandeira).toBe("visa");
    expect(result.valor).toEqual([{ quantidadeParcela: 1 }]);
    expect(result.config.cvvSize).toBe(3);
  });

  it("should fallback to default values on brand error", async () => {
    pagSeguro.getBrand.and.callFake(({ error }: any) => error({}));
    spyOn(service, "montarValores").and.returnValue({
      bandeira: "outro",
      valor: [],
    });
    const result = await service.carregarbandeiraCartao("123", 100);
    expect(result).toEqual({ bandeira: "outro", valor: [] });
  });

  it("should build default installment list", () => {
    const result = service.montarValores(100);
    expect(result.bandeira).toBe("outro");
    expect(result.valor.length).toBe(8);
    expect(result.valor[0]).toEqual(
      jasmine.objectContaining({ quantidadeParcela: 1, totalFinal: 100 })
    );
  });

  it("should resolve installments with totals", async () => {
    pagSeguro.getInstallments.and.callFake(({ success }: any) => {
      success({
        installments: {
          visa: [
            { quantity: 1, installmentAmount: 50 },
            { quantity: 2, installmentAmount: 25 },
          ],
        },
      });
    });
    const result = await service.carregarParcelasPagamento("visa", 50);
    expect(result).toEqual([
      { quantidadeParcela: 1, total: 50, totalFinal: 50, valorParcela: 50 },
      { quantidadeParcela: 2, total: 50, totalFinal: 50, valorParcela: 25 },
    ]);
  });

  it("should load payment methods and use helpers", async () => {
    const cartao = { tipo: "CARTAO" } as any;
    const boleto = { tipo: "BOLETO" } as any;
    const debito = { tipo: "DEBITO" } as any;
    spyOn(service, "carregarMeioPagamentoCartao").and.returnValue(cartao);
    spyOn(service, "carregarMeioPagamentoBoleto").and.returnValue(boleto);
    spyOn(service, "carregarMeioPagamentoDebito").and.returnValue(debito);
    pagSeguro.getPaymentMethods.and.callFake(({ success }: any) => {
      success({
        paymentMethods: {
          CREDIT_CARD: { options: {} },
          BOLETO: { options: { BOLETO: {} } },
          ONLINE_DEBIT: { options: {} },
        },
      });
    });
    const result = await service.carregarMeioPagamento("tok");
    expect(pagSeguro.setSessionId).toHaveBeenCalledWith("tok");
    expect(result).toEqual([cartao, boleto, debito]);
  });

  it("should evaluate card payment availability", () => {
    expect(
      service.carregarMeioPagamentoCartao({ A: { status: "AVAILABLE" } })
    ).toEqual({ tipo: "CARTAO", status: true });
    expect(
      service.carregarMeioPagamentoCartao({ A: { status: "UNAVAILABLE" } })
    ).toEqual({ tipo: "CARTAO", status: false });
  });

  it("should evaluate boleto payment availability", () => {
    expect(
      service.carregarMeioPagamentoBoleto({ status: "AVAILABLE" })
    ).toEqual({ tipo: "BOLETO", status: true });
    expect(
      service.carregarMeioPagamentoBoleto({ status: "UNAVAILABLE" })
    ).toEqual({ tipo: "BOLETO", status: false });
  });

  it("should map debit payment banks", () => {
    const res1 = service.carregarMeioPagamentoDebito({
      B1: {
        status: "AVAILABLE",
        displayName: "Bank",
        images: { MEDIUM: { path: "img" } },
        code: "001",
      },
      B2: {
        status: "UNAVAILABLE",
        displayName: "Bank2",
        images: { MEDIUM: { path: "img2" } },
        code: "002",
      },
    });
    expect(res1.status).toBeTruthy();
    expect(res1.lista.length).toBe(1);
    expect(res1.lista[0]).toEqual({ nome: "Bank", img: "img", codigo: "001" });

    const res2 = service.carregarMeioPagamentoDebito({
      B1: {
        status: "UNAVAILABLE",
        displayName: "Bank",
        images: { MEDIUM: { path: "img" } },
        code: "001",
      },
    });
    expect(res2.status).toBeFalsy();
    expect(res2.lista.length).toBe(0);
  });
});
