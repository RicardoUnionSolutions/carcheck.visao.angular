import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ConsultaInicialComponent } from "./consulta-inicial.component";
import { Router, ActivatedRoute } from "@angular/router";
import { ModalService } from "../service/modal.service";
import { AnalyticsService } from "../service/analytics.service";
import { HttpClient } from "@angular/common/http";
import { VariableGlobal } from "../service/variable.global.service";
import { Title, Meta } from "@angular/platform-browser";
import { of, throwError } from "rxjs";

describe("ConsultaInicialComponent", () => {
  let component: ConsultaInicialComponent;
  let fixture: ComponentFixture<ConsultaInicialComponent>;

  let routerMock: any;
  let modalServiceMock: any;
  let analyticsServiceMock: any;
  let activatedRouteMock: any;
  let httpClientMock: any;
  let variableGlobalMock: any;
  let titleServiceMock: any;
  let metaServiceMock: any;

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj("Router", ["navigate"]);
    modalServiceMock = {};

    analyticsServiceMock = jasmine.createSpyObj("AnalyticsService", [
      "experimentou",
    ]);
    activatedRouteMock = {
      params: of({
        placa: "ABC1234",
        email: "test@test.com",
        nome: "Test",
        tokenRecaptcha: "token",
      }),
    };
    httpClientMock = jasmine.createSpyObj("HttpClient", ["post"]);
    variableGlobalMock = { getUrl: (url: string) => url };
    titleServiceMock = jasmine.createSpyObj("Title", ["setTitle"]);
    metaServiceMock = jasmine.createSpyObj("Meta", ["updateTag"]);

    await TestBed.configureTestingModule({
      imports: [ConsultaInicialComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ModalService, useValue: modalServiceMock },
        { provide: AnalyticsService, useValue: analyticsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: HttpClient, useValue: httpClientMock },
        { provide: VariableGlobal, useValue: variableGlobalMock },
        { provide: Title, useValue: titleServiceMock },
        { provide: Meta, useValue: metaServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaInicialComponent);
    component = fixture.componentInstance;
  });

  it("should create and initialize component", fakeAsync(() => {
    spyOn(component, "consultar").and.returnValue(Promise.resolve());

    component.ngOnInit();
    tick();

    expect(component).toBeTruthy();
    expect(titleServiceMock.setTitle).toHaveBeenCalledWith(
      "Consulta Veicular pela Placa"
    );
    expect(metaServiceMock.updateTag).toHaveBeenCalled();
    expect(component.placa).toBe("ABC1234");
    expect(component.email).toBe("test@test.com");
    expect(component.nome).toBe("Test");
    expect(component.consultar).toHaveBeenCalled();
  }));

  it("should handle successful consulta with NAO_ENCONTRADO fipe", fakeAsync(() => {
    const mockResponse = {
      listaFipes: [{ status: "NAO_ENCONTRADO" }],
      veiculo: { marca: "Ford" },
    };
    httpClientMock.post.and.returnValue(of(mockResponse));

    component.placa = "ABC1234";
    component.nome = "Test";
    component.email = "test@test.com";
    (component as any).tokenRecaptcha = "token";

    component.consultar();
    tick();

    expect(analyticsServiceMock.experimentou).toHaveBeenCalled();
    expect(component.dadosVeiculo.img).toBe("ford");
    expect(component.dadosVeiculo.listaFipes).toEqual([]);
    expect(component.loading).toBeFalsy();
  }));

  it("should handle successful consulta with empty listaFipes", fakeAsync(() => {
    const mockResponse = {
      listaFipes: [],
      veiculo: { marca: "BMW" },
    };
    httpClientMock.post.and.returnValue(of(mockResponse));

    component.consultar();
    tick();

    expect(component.dadosVeiculo.listaFipes).toEqual([]);
    expect(component.dadosVeiculo.img).toBe("bmw");
    expect(component.loading).toBeFalsy();
  }));

  it("should set limiteAtingido on error with limiteAtingido", fakeAsync(() => {
    const errorResponse = { error: { limiteAtingido: true } };
    httpClientMock.post.and.returnValue(throwError(errorResponse));

    component.consultar();
    tick();

    expect(component.limiteAtingido).toBeTruthy();
    expect(component.erroAoConsultar).toBeFalsy();
    expect(component.loading).toBeFalsy();
  }));

  it("should set erroAoConsultar on generic error", fakeAsync(() => {
    const errorResponse = { error: { limiteAtingido: false } };
    httpClientMock.post.and.returnValue(throwError(errorResponse));

    component.consultar();
    tick();

    expect(component.erroAoConsultar).toBeTruthy();
    expect(component.loading).toBeFalsy();
  }));

  it("should navigate when clickComprar is called", () => {
    component.placa = "ABC1234";
    component.clickComprar();

    expect(component.flagCompra).toBeTruthy();
    expect(routerMock.navigate).toHaveBeenCalledWith([
      "/comprar-consulta-placa/" + component.placa + "/",
    ]);
  });

  it("should hide banner on closeBanner", () => {
    const banner = document.createElement("div");
    banner.id = "bannerFixed";
    document.body.appendChild(banner);

    component.closeBanner();

    expect(banner.style.display).toBe("none");
  });
});
