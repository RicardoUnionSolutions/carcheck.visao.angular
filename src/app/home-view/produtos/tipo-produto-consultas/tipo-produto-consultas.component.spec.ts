import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TipoProdutoConsultasComponent } from "./tipo-produto-consultas.component";

describe("TipoProdutoConsultasComponent", () => {
  let component: TipoProdutoConsultasComponent;
  let fixture: ComponentFixture<TipoProdutoConsultasComponent>;
  let routerMock: any;

  beforeEach(waitForAsync(() => {
    routerMock = jasmine.createSpyObj("Router", ["navigate"]);
    TestBed.configureTestingModule({
      declarations: [TipoProdutoConsultasComponent],
      imports: [CommonModule],
      providers: [{ provide: Router, useValue: routerMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoProdutoConsultasComponent);
    component = fixture.componentInstance;
    component.consultas = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should call mostraDetalhes for each consulta when detalhesExpandido is true", () => {
    component.consultas = [{}, {}];
    component.detalhesExpandido = true;
    spyOn(component, "mostraDetalhes");

    component.ngAfterViewInit();

    expect(component.mostraDetalhes).toHaveBeenCalledTimes(2);
  });

  it("should not call mostraDetalhes when detalhesExpandido is false", () => {
    component.consultas = [{}, {}];
    component.detalhesExpandido = false;
    spyOn(component, "mostraDetalhes");

    component.ngAfterViewInit();

    expect(component.mostraDetalhes).not.toHaveBeenCalled();
  });

  it("should move recomendada consulta to index 1", () => {
    component.consultas = [{ id: 2, recomendada: true }, { id: 1 }, { id: 3 }];
    component.moveRecomendadaToCenter();
    expect(component.consultas[1].recomendada).toBeTruthy();
    expect(component.consultas[0].id).toBe(1);
    expect(component.consultas[2].id).toBe(3);
  });

  it("should keep order if recomendada already at index 1", () => {
    const consultas = [{ id: 1 }, { id: 2, recomendada: true }, { id: 3 }];
    component.consultas = consultas.map((c) => ({ ...c }));
    component.moveRecomendadaToCenter();
    expect(component.consultas).toEqual(consultas);
  });

  it("should show detalhes section when mostraDetalhes is called", () => {
    const detalhes = document.createElement("div");
    detalhes.id = "detalhes0";
    detalhes.style.overflow = "hidden";
    const btDetalhes = document.createElement("a");
    btDetalhes.id = "bt_detalhes0";
    btDetalhes.style.display = "block";
    const btnFechar = document.createElement("a");
    btnFechar.id = "btn_fecharDetalhes0";
    btnFechar.style.display = "none";
    document.body.appendChild(detalhes);
    document.body.appendChild(btDetalhes);
    document.body.appendChild(btnFechar);

    component.mostraDetalhes(0);

    expect(component.detalhesVisiveis[0]).toBeTruthy();
    expect(detalhes.style.overflow).toBe("visible");
    expect(btDetalhes.style.display).toBe("none");
    expect(btnFechar.style.display).toBe("block");

    document.body.removeChild(detalhes);
    document.body.removeChild(btDetalhes);
    document.body.removeChild(btnFechar);
  });

  it("should hide detalhes section when fecharDetalhes is called", () => {
    const detalhes = document.createElement("div");
    detalhes.id = "detalhes0";
    detalhes.style.overflow = "visible";
    const btDetalhes = document.createElement("a");
    btDetalhes.id = "bt_detalhes0";
    btDetalhes.style.display = "none";
    const btnFechar = document.createElement("a");
    btnFechar.id = "btn_fecharDetalhes0";
    btnFechar.style.display = "block";
    document.body.appendChild(detalhes);
    document.body.appendChild(btDetalhes);
    document.body.appendChild(btnFechar);

    component.fecharDetalhes(0);

    expect(component.detalhesVisiveis[0]).toBeFalsy();
    expect(detalhes.style.overflow).toBe("hidden");
    expect(btDetalhes.style.display).toBe("block");
    expect(btnFechar.style.display).toBe("none");

    document.body.removeChild(detalhes);
    document.body.removeChild(btDetalhes);
    document.body.removeChild(btnFechar);
  });

  it("should not change state when mostraDetalhes is called without element", () => {
    component.mostraDetalhes(0);
    expect(component.detalhesVisiveis[0]).toBeUndefined();
  });

  it("should not change state when fecharDetalhes is called without element", () => {
    component.fecharDetalhes(0);
    expect(component.detalhesVisiveis[0]).toBeUndefined();
  });

  it("should navigate with placa when provided", () => {
    component.placa = "ABC1234";
    component.clickComprar("slug");
    expect(routerMock.navigate).toHaveBeenCalledWith([
      "/comprar-consulta-placa/" + "slug" + "/" + "ABC1234",
    ]);
  });

  it("should navigate without placa when not provided", () => {
    component.placa = null;
    component.clickComprar("slug");
    expect(routerMock.navigate).toHaveBeenCalledWith([
      "/comprar-consulta-placa/" + "slug",
    ]);
  });

  it("should format price to brazilian currency", () => {
    const formatted = component.valorToString(10);
    expect(formatted).toBe("R$10,00");
  });
});
