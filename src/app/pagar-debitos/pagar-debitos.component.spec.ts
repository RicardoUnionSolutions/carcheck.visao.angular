import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { UntypedFormBuilder } from "@angular/forms";
import { of, throwError } from "rxjs";

import { ModalService } from "../service/modal.service";
import { PagarDebitosService } from "../service/pagar-debitos.service";
import { PagarDebitosComponent } from "./pagar-debitos.component";

describe("PagarDebitosComponent", () => {
  let component: PagarDebitosComponent;
  let fixture: ComponentFixture<PagarDebitosComponent>;
  let pagarDebitosServiceSpy: jasmine.SpyObj<PagarDebitosService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;
  let routeStub: { snapshot: { paramMap: { get: jasmine.Spy } } };

  beforeEach(waitForAsync(() => {
    pagarDebitosServiceSpy = jasmine.createSpyObj("PagarDebitosService", [
      "consultarDebitos",
      "gerarLinkPagamento",
    ]);
    pagarDebitosServiceSpy.consultarDebitos.and.returnValue(
      of({ consult_id: "1", vehicle: {}, debits: [] })
    );
    pagarDebitosServiceSpy.gerarLinkPagamento.and.returnValue(
      of({ url: "http://link.com" })
    );

    modalServiceSpy = jasmine.createSpyObj("ModalService", [
      "openLoading",
      "closeLoading",
      "openModalMsg",
    ]);

    routeStub = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy("get").and.returnValue(null),
        },
      },
    };

    TestBed.configureTestingModule({
      imports: [PagarDebitosComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: PagarDebitosService, useValue: pagarDebitosServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: ActivatedRoute, useValue: routeStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(PagarDebitosComponent);
    component = fixture.componentInstance;
    (window as any).scrollTo = jasmine.createSpy("scrollTo");
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize forms with default values", () => {
    expect(component.form).toBeDefined();
    expect(component.form.get("uf").value).toBe("SP");
    expect(component.formPagamento).toBeDefined();
  });

  it("should not consult when form is invalid", () => {
    const markSpy = spyOn(component.form, "markAllAsTouched");
    const consultaSpy = spyOn(component, "fazerConsulta");
    component.consultar();
    expect(markSpy).toHaveBeenCalled();
    expect(consultaSpy).not.toHaveBeenCalled();
  });

  it("should consult with sanitized placa when form is valid", () => {
    const consultaSpy = spyOn(component, "fazerConsulta");
    const scrollSpy = spyOn(component, "scrollToTop").and.callThrough();
    component.form.setValue({
      uf: "SP",
      email: "a@b.com",
      placa: "ABC-1234",
      renavam: "123",
    });
    component.consultar();
    expect(consultaSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ placa: "ABC1234" })
    );
    expect(scrollSpy).toHaveBeenCalled();
  });

  it("should check if a debit is selected", () => {
    component.debitosSelecionados = [{ debit_id: 1 }];
    expect(component.isSelecionado({ debit_id: 1 })).toBeTruthy();
    expect(component.isSelecionado({ debit_id: 2 })).toBeFalsy();
  });

  it("should toggle debit selection", () => {
    const debito = { debit_id: 1 };
    component.toggleSelecionado(debito);
    expect(component.debitosSelecionados.length).toBe(1);
    component.toggleSelecionado(debito);
    expect(component.debitosSelecionados.length).toBe(0);
  });

  it("should calculate total", () => {
    component.debitosSelecionados = [{ value: 10 }, { value: undefined } as any];
    expect(component.calcularTotal()).toBe(10);
  });

  it("should perform consulta and save data", () => {
    const response = {
      consult_id: "1",
      vehicle: { uf: "SP", license_plate: "ABC1234", renavam: "123" },
    } as any;
    pagarDebitosServiceSpy.consultarDebitos.and.returnValue(of(response));
    const lsSpy = spyOn(window.localStorage, "setItem").and.callThrough();
    component.fazerConsulta({ uf: "SP", placa: "ABC1234", renavam: "123" });

    expect(modalServiceSpy.openLoading).toHaveBeenCalled();
    expect(pagarDebitosServiceSpy.consultarDebitos).toHaveBeenCalled();
    expect(component.dadosDoVeiculo).toEqual(response);
    expect(lsSpy).toHaveBeenCalled();
    expect(modalServiceSpy.closeLoading).toHaveBeenCalled();
  });

  it("should mask placa correctly", () => {
    const input = document.createElement("input");
    input.value = "abc1234";
    const event = { target: input } as any;
    component.mascaraPlaca(event);
    expect(input.value).toBe("ABC-1234");
    expect(component.form.get("placa").value).toBe("ABC-1234");
  });

  it("should ignore mask when event target is missing or empty", () => {
    const input = document.createElement("input");
    input.value = "";
    component.mascaraPlaca({ target: input } as any);
    expect(component.form.get("placa").value).toBe("");

    component.mascaraPlaca({ target: null } as any);
    expect(component.form.get("placa").value).toBe("");
  });

  it("should not generate payment link when payment form is invalid", () => {
    // Garantir que não há chamadas residuais de outros testes
    pagarDebitosServiceSpy.gerarLinkPagamento.calls.reset();
    const markSpy = spyOn(component.formPagamento, "markAllAsTouched");
    component.pagarDebitos();
    expect(markSpy).toHaveBeenCalled();
    expect(pagarDebitosServiceSpy.gerarLinkPagamento).not.toHaveBeenCalled();
  });

  it("should generate payment link when payment form is valid", () => {
    component.dadosDoVeiculo = { consult_id: "123" } as any;
    component.debitosSelecionados = [{ debit_id: 1, value: 100 }];
    component.formPagamento.setValue({ nome: "John Doe", documento: "123" });

    pagarDebitosServiceSpy.gerarLinkPagamento.and.returnValue(
      of({ url: "http://test" })
    );

    component.pagarDebitos();

    expect(pagarDebitosServiceSpy.gerarLinkPagamento).toHaveBeenCalledWith(
      jasmine.objectContaining({
        consult_id: "123",
        name: "John Doe",
        document: "123",
        debits: [1],
        total_amount: jasmine.any(Number),
        service_amount: jasmine.any(Number),
        intermediary_document: jasmine.any(String),
        callback_url: jasmine.any(String),
        redirect_url: "",
      })
    );
    expect(component.linkPagamento).toBe("http://test");
    expect(component.gerandoLink).toBeFalsy();
  });

  it("should update isRelatorioFixo based on viewport position", () => {
    const viewport = window.innerHeight;
    component.fimDaPagina = {
      nativeElement: { getBoundingClientRect: () => ({ top: viewport + 100 }) },
    } as any;
    component.verificarPosicao();
    expect(component.isRelatorioFixo).toBeTruthy();

    component.fimDaPagina.nativeElement.getBoundingClientRect = () => ({
      top: viewport - 100,
    });
    component.verificarPosicao();
    expect(component.isRelatorioFixo).toBeFalsy();
  });

  it("should return early when fimDaPagina is undefined", () => {
    component.isRelatorioFixo = false;
    (component as any).fimDaPagina = undefined;
    component.verificarPosicao();
    expect(component.isRelatorioFixo).toBeFalsy();
  });

  it("should call verificarPosicao on scroll", () => {
    const spy = spyOn(component, "verificarPosicao");
    component.onScroll();
    expect(spy).toHaveBeenCalled();
  });

  it("should handle placa without hyphen when length <= 3", () => {
    const input = document.createElement("input");
    input.value = "ab1";
    const event = { target: input } as any;
    component.mascaraPlaca(event);
    expect(input.value).toBe("AB1");
    expect(component.form.get("placa").value).toBe("AB1");
  });

  it("should scroll to top with smooth behavior", () => {
    component.scrollToTop();
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("should call fazerConsulta with data from consultaAnterior", () => {
    component.consultaAnterior = {
      uf: "SP",
      placa: "ABC1234",
      renavam: "123",
    } as any;
    const spy = spyOn(component, "fazerConsulta");
    component.buscarPelaConsultaAnterior();
    expect(spy).toHaveBeenCalledWith({
      uf: "SP",
      placa: "ABC1234",
      renavam: "123",
    });
  });

  it("should handle error when consultar debitos", () => {
    pagarDebitosServiceSpy.consultarDebitos.and.returnValue(
      throwError(() => new Error("fail"))
    );
    component.fazerConsulta({ uf: "SP", placa: "ABC1234", renavam: "123" });
    expect(modalServiceSpy.closeLoading).toHaveBeenCalled();
    expect(modalServiceSpy.openModalMsg).toHaveBeenCalled();
    pagarDebitosServiceSpy.consultarDebitos.and.returnValue(
      of({ consult_id: "1", vehicle: {}, debits: [] })
    );
  });

  it("should handle error when generating payment link", () => {
    component.dadosDoVeiculo = { consult_id: "123" } as any;
    component.debitosSelecionados = [{ debit_id: 1, value: 100 }];
    component.formPagamento.setValue({ nome: "John Doe", documento: "123" });
    pagarDebitosServiceSpy.gerarLinkPagamento.and.returnValue(
      throwError(() => new Error("fail"))
    );
    component.pagarDebitos();
    expect(modalServiceSpy.openModalMsg).toHaveBeenCalled();
    expect(component.gerandoLink).toBeFalsy();
    pagarDebitosServiceSpy.gerarLinkPagamento.and.returnValue(
      of({ url: "http://link.com" })
    );
  });

  it("should load consulta anterior when route has consultId", () => {
    const fb = TestBed.inject(UntypedFormBuilder);
    const route = {
      snapshot: { paramMap: { get: () => "1" } },
    } as any;
    localStorage.setItem(
      "consulta_anterior",
      JSON.stringify({
        consult_id: "1",
        uf: "SP",
        placa: "ABC1234",
        renavam: "123",
      })
    );
    const comp = new PagarDebitosComponent(
      fb,
      pagarDebitosServiceSpy,
      modalServiceSpy,
      route
    );
    const spy = spyOn(comp, "buscarPelaConsultaAnterior").and.callThrough();
    comp.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
});
