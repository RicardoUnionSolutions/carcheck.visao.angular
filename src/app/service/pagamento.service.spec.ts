import { TestBed } from "@angular/core/testing";
import { PagamentoService } from "./pagamento.service";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { VariableGlobal } from "./variable.global.service";
import { TokenService } from "./token.service";
import { PagSeguroService } from "./pagseguro.service";

class HttpClientStub {
  post = jasmine.createSpy("post").and.returnValue(of("postResponse"));
  get = jasmine.createSpy("get").and.returnValue(of("getResponse"));
}

class VariableGlobalStub {
  getUrl(url: string = "") {
    const base = "http://api/";
    return url && url[0] === "/" ? base + url.substring(1) : base + url;
  }
}

class TokenServiceStub {}

class PagSeguroServiceStub {
  getTokenCardPagSeguro = jasmine.createSpy("getTokenCardPagSeguro");
}

describe("PagamentoService", () => {
  let service: PagamentoService;
  let http: HttpClientStub;
  let pagSeguro: PagSeguroServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PagamentoService,
        { provide: HttpClient, useClass: HttpClientStub },
        { provide: VariableGlobal, useClass: VariableGlobalStub },
        { provide: TokenService, useClass: TokenServiceStub },
        { provide: PagSeguroService, useClass: PagSeguroServiceStub },
      ],
    });
    service = TestBed.inject(PagamentoService);
    http = TestBed.inject(HttpClient) as any;
    pagSeguro = TestBed.inject(PagSeguroService) as any;
  });

  it("should process card payment and attach token", async () => {
    const pagamento: any = {
      pagamento: {
        tipo: "CARTAO",
        CARTAO: { numero: "123", cvv: "1", vencimento: "12/30" },
      },
    };
    pagSeguro.getTokenCardPagSeguro.and.returnValue(Promise.resolve("tok"));
    const result = await service.pagar(pagamento);
    expect(pagSeguro.getTokenCardPagSeguro).toHaveBeenCalledWith(
      "123",
      "1",
      "12",
      "2030"
    );
    expect(pagamento.pagamento.tokenCartao).toBe("tok");
    expect(http.post).toHaveBeenCalledWith(
      "http://api/pagamento/pagar",
      pagamento
    );
    expect(result).toBe("postResponse");
  });

  it("should fall back to IUGU when card tokenization fails", async () => {
    const pagamento: any = {
      pagamento: {
        tipo: "CARTAO",
        CARTAO: { numero: "123", cvv: "1", vencimento: "12/30" },
      },
    };
    pagSeguro.getTokenCardPagSeguro.and.returnValue(Promise.reject("err"));
    const result = await service.pagar(pagamento);
    expect(pagSeguro.getTokenCardPagSeguro).toHaveBeenCalled();
    expect(pagamento.pagamento.tokenCartao).toBeUndefined();
    expect(pagamento.pagamento.origemPagamento).toBe("IUGU");
    expect(http.post).toHaveBeenCalledWith(
      "http://api/pagamento/pagar",
      pagamento
    );
    expect(result).toBe("postResponse");
  });

  it("should send payment without card", async () => {
    const pagamento: any = { pagamento: { tipo: "BOLETO" } };
    const result = await service.pagar(pagamento);
    expect(pagSeguro.getTokenCardPagSeguro).not.toHaveBeenCalled();
    expect(http.post).toHaveBeenCalledWith(
      "http://api/pagamento/pagar",
      pagamento
    );
    expect(result).toBe("postResponse");
  });

  it("should expose and update ultimaCompra observable", () => {
    const compra = { id: 1 };
    const itens = [{ id: 1 }];
    const received: any[] = [];
    service.getUltimaCompra().subscribe((v) => received.push(v));
    expect(received[0]).toBeNull();
    service.setUltimaCompra(compra, itens, "tipo");
    expect(received[1]).toEqual({
      pagamento: compra,
      itens,
      tipoCompra: "tipo",
    });
  });

  it("should validate cupom with correct url", async () => {
    http.get.and.returnValue(of(true));
    const result = await service.validaCupom("ABC");
    expect(http.get).toHaveBeenCalledWith(
      "http://api/painel/validaCupomPagamento?nomeCupom=ABC"
    );
    expect(result).toBeTruthy();
  });

  it("should retrieve cupom data", async () => {
    http.get.and.returnValue(of([{ id: 1 } as any]));
    const result = await service.dadosCupom("XYZ");
    expect(http.get).toHaveBeenCalledWith(
      "http://api/painel/getDadosCupom?nomeCupom=XYZ"
    );
    expect(result).toEqual([{ id: 1 } as any]);
  });

  it("should retrieve available cupom quantity", async () => {
    http.get.and.returnValue(of(5));
    const result = await service.qtdCupomDisp();
    expect(http.get).toHaveBeenCalledWith(
      "http://api/painel/getQuantidadeCupomAtivos"
    );
    expect(result).toBe(5);
  });

  it("should verify purchase status", async () => {
    http.get.and.returnValue(of({ status: "ok" }));
    const result = await service.verificaStatusCompra(10);
    expect(http.get).toHaveBeenCalledWith(
      "http://api/pagamento/verificarPagamento?idCompra=10"
    );
    expect(result).toEqual({ status: "ok" });
  });
});
