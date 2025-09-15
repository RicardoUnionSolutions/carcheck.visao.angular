import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { Title, Meta } from "@angular/platform-browser";
import { Component, Input, NO_ERRORS_SCHEMA, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StatusPagamentoComponent } from "./status-pagamento.component";
import { StatusPagamentoService } from "../service/status-pagamento.service";

@Component({
    selector: "ck-input", template: "",
    standalone: true
})
class CkInputStubComponent {
  @Input() value: any;
  @Input() label: string;
  @Output() valueChange = new EventEmitter<any>();
}

describe("StatusPagamentoComponent", () => {
  let component: StatusPagamentoComponent;
  let fixture: ComponentFixture<StatusPagamentoComponent>;
  let service: jasmine.SpyObj<StatusPagamentoService>;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(waitForAsync(() => {
    service = jasmine.createSpyObj("StatusPagamentoService", ["carregarLista"]);
    TestBed.configureTestingModule({
      imports: [CommonModule, StatusPagamentoComponent, CkInputStubComponent],
      providers: [
        Title,
        Meta,
        { provide: StatusPagamentoService, useValue: service },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusPagamentoComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);

    service.carregarLista.and.returnValue(of([]));

    spyOn(titleService, "setTitle").and.callThrough();
    spyOn(metaService, "updateTag").and.callThrough();
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should set title, meta description and load pagamentos on init", () => {
    const pagamentosMock = [{ transacao: "1" }];
    service.carregarLista.and.returnValue(of(pagamentosMock));

    fixture.detectChanges();

    expect(titleService.setTitle).toHaveBeenCalledWith("Status de Pagamento");
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: "description",
      content:
        "Acompanhe o status de seus pagamentos realizados pela plataforma de forma rápida e segura.",
    });
    expect(service.carregarLista).toHaveBeenCalledWith({ codigoPagamento: null });
    expect(component.pagamentos).toEqual(pagamentosMock);
  });

  it("should filter list using current search value", () => {
    fixture.detectChanges();

    component.valorPesquisa = "98765";
    component.filtrarLista();

    expect(service.carregarLista).toHaveBeenCalledTimes(2);
    expect(service.carregarLista.calls.mostRecent().args[0]).toEqual({ codigoPagamento: "98765" });
  });

  it("should load pagamentos and log message on carregarLista success", () => {
    const pagamentosMock = [{ transacao: "1" }, { transacao: "2" }];
    const consoleSpy = spyOn(console, "log");
    service.carregarLista.and.returnValue(of(pagamentosMock));

    component.carregarLista();

    expect(service.carregarLista).toHaveBeenCalledWith({ codigoPagamento: null });
    expect(component.pagamentos).toEqual(pagamentosMock);
    expect(consoleSpy).toHaveBeenCalledWith("erro----");
  });

  it("should handle error when carregarLista fails", () => {
    const consoleSpy = spyOn(console, "log");
    service.carregarLista.and.returnValue(throwError("failure"));

    component.carregarLista();

    expect(consoleSpy).toHaveBeenCalledWith("erro", "failure");
  });

  it("should render all status labels and icons in the template", () => {
    fixture.detectChanges();

    component.pagamentos = [
      {
        transacao: "TRX-AGUARDANDO",
        dataPagamento: "2024-01-01T10:00:00",
        valorFinal: 150,
        tipoPagamento: "DEBITO",
        situacaoPagamento: "EM_ANALISE",
      },
      {
        transacao: "TRX-CONTESTACAO",
        dataPagamento: "2024-01-02T11:00:00",
        valorFinal: 200,
        tipoPagamento: "BOLETO",
        situacaoPagamento: "EM_CONTESTACAO",
      },
      {
        transacao: "TRX-DISPUTA",
        dataPagamento: "2024-01-03T12:00:00",
        valorFinal: 250,
        tipoPagamento: "CARTAO",
        situacaoPagamento: "EM_DISPUTA",
      },
      {
        transacao: null,
        dataPagamento: "2024-01-04T13:00:00",
        valorFinal: 300,
        tipoPagamento: "PIX",
        situacaoPagamento: "PROCESSANDO_PAGAMENTO",
      },
      {
        transacao: "TRX-APROVADA",
        dataPagamento: "2024-01-05T14:00:00",
        valorFinal: 350,
        tipoPagamento: "PIX",
        situacaoPagamento: "APROVADO",
      },
      {
        transacao: "TRX-CANCELADA",
        dataPagamento: "2024-01-06T15:00:00",
        valorFinal: 400,
        tipoPagamento: "DEBITO",
        situacaoPagamento: "CANCELADO",
      },
    ];

    fixture.detectChanges();

    const nativeElement: HTMLElement = fixture.nativeElement;
    const rows = nativeElement.querySelectorAll("table.ck-table tr");

    expect(rows.length).toBe(7);

    const aguardandoRow = rows[1] as HTMLTableRowElement;
    expect(aguardandoRow.textContent).toContain("TRX-AGUARDANDO");
    expect(aguardandoRow.textContent).toContain("Débito");
    expect(aguardandoRow.textContent).toContain("Aguardando");
    expect(aguardandoRow.querySelector(".mdi-clock.text-blue")).not.toBeNull();

    const contestacaoRow = rows[2] as HTMLTableRowElement;
    expect(contestacaoRow.textContent).toContain("TRX-CONTESTACAO");
    expect(contestacaoRow.textContent).toContain("Boleto");
    expect(contestacaoRow.textContent).toContain("Contestação");
    expect(contestacaoRow.querySelector(".mdi-clock.text-blue")).not.toBeNull();

    const disputaRow = rows[3] as HTMLTableRowElement;
    expect(disputaRow.textContent).toContain("TRX-DISPUTA");
    expect(disputaRow.textContent).toContain("Cartão");
    expect(disputaRow.textContent).toContain("Disputa");
    expect(disputaRow.querySelector(".mdi-clock.text-blue")).not.toBeNull();

    const erroRow = rows[4] as HTMLTableRowElement;
    expect(erroRow.textContent).toContain("Erro de Pagamento");
    expect(erroRow.textContent).toContain("Pix");
    expect(erroRow.querySelector(".mdi-close.text-danger")).not.toBeNull();

    const aprovadaRow = rows[5] as HTMLTableRowElement;
    expect(aprovadaRow.textContent).toContain("TRX-APROVADA");
    expect(aprovadaRow.textContent).toContain("Aprovada");
    expect(aprovadaRow.querySelector(".mdi-check.text-success")).not.toBeNull();

    const canceladaRow = rows[6] as HTMLTableRowElement;
    expect(canceladaRow.textContent).toContain("TRX-CANCELADA");
    expect(canceladaRow.textContent).toContain("Cancelada");
    expect(canceladaRow.querySelector(".mdi-close.text-danger")).not.toBeNull();
  });
});

