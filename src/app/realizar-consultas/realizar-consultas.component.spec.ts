import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";

import { RealizarConsultasComponent } from "./realizar-consultas.component";
import { ModalService } from "../service/modal.service";
import { LoginService } from "../service/login.service";
import { dadosConsultaService } from "../service/dados-consulta.service";
import { FazerConsultaService } from "../service/fazer-consulta.service";
import { NotificationService } from "../service/notification.service";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Meta } from "@angular/platform-browser";

class TitleStub {
  setTitle(_: string) {}
}
class MetaStub {
  updateTag(_: any) {}
}

const modalServiceSpy = jasmine.createSpyObj("ModalService", [
  "openLoading",
  "closeLoading",
  "openModalMsg",
]);
const loginServiceSpy = jasmine.createSpyObj("LoginService", ["getLogIn"]);
loginServiceSpy.getLogIn.and.returnValue(of(null));
const dadosConsultaServiceSpy = jasmine.createSpyObj("dadosConsultaService", [
  "getCreditoConsulta",
]);
const fazerConsultaServiceSpy = jasmine.createSpyObj("FazerConsultaService", [
  "consultar",
  "realizarConsulta",
]);
const notificationServiceSpy = jasmine.createSpyObj("NotificationService", [
  "addNotification",
]);
const routerSpy = jasmine.createSpyObj("Router", ["navigateByUrl", "navigate"]);
routerSpy.routerState = { root: null } as any;

describe("RealizarConsultasComponent", () => {
  let component: RealizarConsultasComponent;
  let fixture: ComponentFixture<RealizarConsultasComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RealizarConsultasComponent],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: dadosConsultaService, useValue: dadosConsultaServiceSpy },
        { provide: FazerConsultaService, useValue: fazerConsultaServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Title, useClass: TitleStub },
        { provide: Meta, useClass: MetaStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    dadosConsultaServiceSpy.getCreditoConsulta.and.returnValue(of([]));
    fixture = TestBed.createComponent(RealizarConsultasComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, "navigateByUrl");
    spyOn(router, "navigate");
    fixture.detectChanges();
    modalServiceSpy.openLoading.calls.reset();
    modalServiceSpy.closeLoading.calls.reset();
    modalServiceSpy.openModalMsg.calls.reset();
    (router.navigateByUrl as jasmine.Spy).calls.reset();
    (router.navigate as jasmine.Spy).calls.reset();
    dadosConsultaServiceSpy.getCreditoConsulta.calls.reset();
    fazerConsultaServiceSpy.consultar.calls.reset();
    fazerConsultaServiceSpy.realizarConsulta.calls.reset();
    notificationServiceSpy.addNotification.calls.reset();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("carregarDadosCreditoConsulta", () => {
    it("should populate options when credit available", () => {
      const data = [
        { id: 1, nome: "A", quantidade: 1 },
        { id: 2, nome: "B", quantidade: 0 },
      ];
      dadosConsultaServiceSpy.getCreditoConsulta.and.returnValue(of(data));

      component.carregarDadosCreditoConsulta();

      expect(modalServiceSpy.openLoading).toHaveBeenCalled();
      expect(component.dadosConsulta).toEqual(data);
      expect(component.consultasOptions.length).toBe(1);
      expect(component.consultas[0].options.length).toBe(1);
      expect(component.consultasDisponiveisVazio).toBeFalsy();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(modalServiceSpy.closeLoading).toHaveBeenCalled();
    });

    it("should navigate when no credit available", () => {
      const data = [{ id: 1, nome: "A", quantidade: 0 }];
      dadosConsultaServiceSpy.getCreditoConsulta.and.returnValue(of(data));

      component.carregarDadosCreditoConsulta();

      expect(component.consultasOptions.length).toBe(0);
      expect(component.consultasDisponiveisVazio).toBeTruthy();
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/comprar-consulta-placa"
      );
    });

    it("should handle invalid observable response", () => {
      dadosConsultaServiceSpy.getCreditoConsulta.and.returnValue(undefined);

      component.carregarDadosCreditoConsulta();

      expect(modalServiceSpy.openLoading).toHaveBeenCalled();
      expect(modalServiceSpy.closeLoading).toHaveBeenCalled();
    });

    it("should close loading on service error", () => {
      dadosConsultaServiceSpy.getCreditoConsulta.and.returnValue(
        throwError(() => new Error("erro"))
      );
      spyOn(console, "log");

      component.carregarDadosCreditoConsulta();

      expect(console.log).toHaveBeenCalled();
      expect(modalServiceSpy.closeLoading).toHaveBeenCalled();
    });
  });

  it("should add consulta with available options", () => {
    component.consultasOptions = [
      {
        label: "A",
        value: { nome: "A", quantidade: 1, quantidadeSelecionada: 0 },
      },
      {
        label: "B",
        value: { nome: "B", quantidade: 1, quantidadeSelecionada: 1 },
      },
    ];

    component.addConsulta();

    expect(component.consultas.length).toBe(2);
    expect(component.consultas[1].options.length).toBe(1);
  });

  it("should remove consulta and update quantities", () => {
    const opt = {
      label: "A",
      value: { nome: "A", quantidade: 1, quantidadeSelecionada: 1 },
    };
    component.consultasOptions = [opt];
    component.consultas = [
      {
        placa: "",
        chassi: "",
        tipoPesquisa: "placa",
        options: [opt],
        consultaSelecionada: opt.value,
      },
      {
        placa: "",
        chassi: "",
        tipoPesquisa: "placa",
        options: [opt],
        consultaSelecionada: null,
      },
    ];
    spyOn(component, "updateConsultasOptions");

    component.removeConsulta(component.consultas[0], 0);

    expect(component.consultas.length).toBe(1);
    expect(opt.value.quantidadeSelecionada).toBe(0);
    expect(component.updateConsultasOptions).toHaveBeenCalled();
  });

  it("should verify availability of consultas", () => {
    component.consultasOptions = [
      { value: { quantidade: 1, quantidadeSelecionada: 1 } },
      { value: { quantidade: 1, quantidadeSelecionada: 0 } },
    ];
    expect(component.verificarDisponibilidadeConsulta()).toBeTruthy();
    component.consultasOptions[1].value.quantidadeSelecionada = 1;
    expect(component.verificarDisponibilidadeConsulta()).toBeFalsy();
  });

  it("should allow calling change methods", () => {
    expect(component.changeChassi()).toBeUndefined();
    expect(component.changePlaca()).toBeUndefined();
  });

  describe("selecionarConsulta", () => {
    it("should ignore selection when option exhausted", () => {
      const opt = { quantidade: 1, quantidadeSelecionada: 1 };
      component.consultas = [{ consultaSelecionada: null }];
      spyOn(component, "updateConsultasOptions");

      component.selecionarConsulta(0, opt);

      expect(component.consultas[0].consultaSelecionada).toBeNull();
      expect(component.updateConsultasOptions).not.toHaveBeenCalled();
    });

    it("should select option and update others", () => {
      const opt1 = { nome: "A", quantidade: 2, quantidadeSelecionada: 0 };
      const opt2 = { nome: "B", quantidade: 1, quantidadeSelecionada: 1 };
      component.consultas = [{ consultaSelecionada: opt2 }];
      spyOn(component, "updateConsultasOptions");

      component.selecionarConsulta(0, opt1);

      expect(opt1.quantidadeSelecionada).toBe(1);
      expect(opt2.quantidadeSelecionada).toBe(0);
      expect(component.consultas[0].consultaSelecionada).toBe(opt1);
      expect(component.updateConsultasOptions).toHaveBeenCalled();
    });
  });

  it("should rebuild options considering quantities", () => {
    component.consultasOptions = [
      {
        label: "A",
        value: { nome: "A", quantidade: 1, quantidadeSelecionada: 1 },
      },
      {
        label: "B",
        value: { nome: "B", quantidade: 1, quantidadeSelecionada: 0 },
      },
    ];
    component.consultas = [
      { consultaSelecionada: null, options: [] },
      { consultaSelecionada: component.consultasOptions[0].value, options: [] },
    ];

    component.updateConsultasOptions();

    expect(component.consultas[0].options.length).toBe(1);
    expect(component.consultas[1].options.length).toBe(2);
  });

  describe("consultar", () => {
    it("should not proceed when there are errors", () => {
      component.consultas = [
        {
          placa: "ABC123",
          chassi: "",
          tipoPesquisa: "placa",
          consultaSelecionada: null,
        },
      ];
      spyOn(component, "carregaDadosVeiculoConsulta");

      component.consultar();

      expect(component.errors).toBeTruthy();
      expect(component.carregaDadosVeiculoConsulta).not.toHaveBeenCalled();
    });

    it("should start loading when data is valid", () => {
      const opt = { nome: "A", quantidade: 1, quantidadeSelecionada: 0 };
      component.consultas = [
        {
          placa: "ABC1234",
          chassi: "",
          tipoPesquisa: "placa",
          consultaSelecionada: opt,
        },
      ];
      spyOn(component, "carregaDadosVeiculoConsulta");

      component.consultar();

      expect(component.errors).toBeFalsy();
      expect(component.carregandoConsulta).toBeTruthy();
      expect(component.carregaDadosVeiculoConsulta).toHaveBeenCalledWith(0);
    });

    it("should flag chassi errors when invalid", () => {
      const opt = { nome: "A", quantidade: 1, quantidadeSelecionada: 0 };
      component.consultas = [
        {
          placa: "",
          chassi: "123",
          tipoPesquisa: "chassi",
          consultaSelecionada: opt,
        },
      ];
      spyOn(component, "carregaDadosVeiculoConsulta");

      component.consultar();

      expect(component.consultas[0].erroChassi).toBeTruthy();
      expect(component.errors).toBeTruthy();
      expect(component.carregaDadosVeiculoConsulta).not.toHaveBeenCalled();
    });
  });

  it("should fetch vehicle data and call modal", () => {
    const opt = { nome: "A" };
    component.consultas = [
      {
        placa: "abc1234",
        chassi: "",
        tipoPesquisa: "placa",
        consultaSelecionada: opt,
      },
    ];
    fazerConsultaServiceSpy.consultar.and.returnValue(
      of({ marca: "Ford", modelo: "Fiesta" })
    );
    spyOn(component, "modal");

    component.carregaDadosVeiculoConsulta(0);

    expect(modalServiceSpy.openLoading).toHaveBeenCalled();
    expect(fazerConsultaServiceSpy.consultar).toHaveBeenCalledWith("ABC1234");
    expect(component.dadosVeiculo).toEqual({ marca: "Ford", modelo: "Fiesta" });
    expect(modalServiceSpy.closeLoading).toHaveBeenCalled();
    expect(component.modal).toHaveBeenCalled();
  });

  it("should handle null vehicle data", () => {
    const opt = { nome: "A" };
    component.consultas = [
      {
        placa: "abc1234",
        chassi: "",
        tipoPesquisa: "placa",
        consultaSelecionada: opt,
      },
    ];
    fazerConsultaServiceSpy.consultar.and.returnValue(of(null));
    spyOn(component, "modal");

    component.carregaDadosVeiculoConsulta(0);

    expect(component.dadosVeiculo).toBeNull();
    expect(modalServiceSpy.closeLoading).toHaveBeenCalled();
    expect(component.modal).toHaveBeenCalled();
  });

  it("should call modal even when consultar errors", () => {
    const opt = { nome: "A" };
    component.consultas = [
      {
        placa: "abc1234",
        chassi: "",
        tipoPesquisa: "placa",
        consultaSelecionada: opt,
      },
    ];
    fazerConsultaServiceSpy.consultar.and.returnValue(
      throwError(() => new Error("fail"))
    );
    spyOn(component, "modal");

    component.carregaDadosVeiculoConsulta(0);

    expect(modalServiceSpy.closeLoading).toHaveBeenCalled();
    expect(component.modal).toHaveBeenCalled();
  });

  it("should process multiple consultas sequentially", () => {
    const opt = { nome: "A" };
    component.consultas = [
      {
        placa: "abc1234",
        chassi: "",
        tipoPesquisa: "placa",
        consultaSelecionada: opt,
      },
      {
        placa: "def5678",
        chassi: "",
        tipoPesquisa: "placa",
        consultaSelecionada: opt,
      },
    ];
    fazerConsultaServiceSpy.consultar.and.returnValues(
      of({ marca: "Fiat", modelo: "Uno" }),
      of(null)
    );
    spyOn(component, "modal");

    component.carregaDadosVeiculoConsulta(0);

    expect(fazerConsultaServiceSpy.consultar).toHaveBeenCalledTimes(2);
    expect(component.modal).toHaveBeenCalled();
  });

  it("should validate placa format", () => {
    expect(component.validaPlaca("ABC-1234")).toBeTruthy();
    expect(component.validaPlaca("AAA123")).toBeFalsy();
  });

  it("should open modal and execute consulta on confirm", fakeAsync(() => {
    const opt = { nome: "A", quantidade: 1, quantidadeSelecionada: 0 };
    fazerConsultaServiceSpy.realizarConsulta.and.returnValue(of(true));
    component.consultas = [
      {
        placa: "ABC1234",
        chassi: "",
        tipoPesquisa: "placa",
        consultaSelecionada: opt,
        options: [{ label: "A", value: opt }],
      },
    ];

    component.modal("texto");

    const arg = modalServiceSpy.openModalMsg.calls.mostRecent().args[0];
    expect(arg.status).toBe(1);
    expect(arg.text).toBe("texto");
    arg.ok.event();
    tick(3000);
    expect(modalServiceSpy.openLoading).toHaveBeenCalled();
    expect(fazerConsultaServiceSpy.realizarConsulta).toHaveBeenCalledWith([
      {
        placa: "ABC1234",
        chassi: "",
        tipoPesquisa: "placa",
        consultaSelecionada: opt,
      },
    ]);
    expect(modalServiceSpy.closeLoading).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/"]);
    expect(notificationServiceSpy.addNotification).toHaveBeenCalled();
  }));

  it("should handle modal cancel event", () => {
    const opt = { nome: "A" };
    component.consultas = [
      {
        placa: "ABC1234",
        chassi: "",
        tipoPesquisa: "placa",
        consultaSelecionada: opt,
        options: [{ label: "A", value: opt }],
      },
    ];
    component.carregandoConsulta = true;

    component.modal("texto");

    const arg = modalServiceSpy.openModalMsg.calls.mostRecent().args[0];
    arg.cancel.event();

    expect(component.carregandoConsulta).toBeFalsy();
  });
});
