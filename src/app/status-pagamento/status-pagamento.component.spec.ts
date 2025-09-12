import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { Title, Meta } from "@angular/platform-browser";
import { Component, Input, NO_ERRORS_SCHEMA,Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
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

    spyOn(titleService, "setTitle").and.callThrough();
    spyOn(metaService, "updateTag").and.callThrough();
  });

  it("should create", () => {
    service.carregarLista.and.returnValue(of([]));
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
    service.carregarLista.and.returnValue(of([]));
    fixture.detectChanges();

    const carregarListaSpy = spyOn(component, "carregarLista").and.callThrough();
    component.filtrarLista();
    expect(carregarListaSpy).toHaveBeenCalled();
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
});

