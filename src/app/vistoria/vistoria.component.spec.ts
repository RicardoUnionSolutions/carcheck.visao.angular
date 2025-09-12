import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";

import { VistoriaComponent } from "./vistoria.component";
import { LaudoService } from "../service/laudo.service";
import { Title } from "@angular/platform-browser";
import { Meta } from "@angular/platform-browser";
import { StepByStepSmComponent } from "../components/step-by-step-sm/step-by-step-sm.component";

describe("VistoriaComponent", () => {
  let component: VistoriaComponent;
  let fixture: ComponentFixture<VistoriaComponent>;

  const laudoServiceSpy = jasmine.createSpyObj("LaudoService", [
    "getLaudo",
    "getCidadeNome",
  ]);
  const titleSpy = jasmine.createSpyObj("Title", ["setTitle"]);
  const metaSpy = jasmine.createSpyObj("Meta", ["updateTag"]);

  beforeEach(waitForAsync(() => {
    laudoServiceSpy.getLaudo.and.returnValue(
      Promise.resolve({ status: "SOLICITADO", cidade: "c1", marca: "Fiat Uno" })
    );
    laudoServiceSpy.getCidadeNome.and.returnValue("Cidade Teste");

    TestBed.configureTestingModule({
      imports: [CommonModule, StepByStepSmComponent, VistoriaComponent],
      providers: [
        { provide: LaudoService, useValue: laudoServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => "tokenABC" } } },
        },
        { provide: Title, useValue: titleSpy },
        { provide: Meta, useValue: metaSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VistoriaComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize and load data on ngOnInit", fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(titleSpy.setTitle).toHaveBeenCalledWith(
      "Acompanhamento da Vistoria"
    );
    expect(metaSpy.updateTag).toHaveBeenCalledWith({
      name: "description",
      content:
        "Visualize o status da vistoria veicular, incluindo etapas como agendamento, realização e entrega do laudo.",
    });
    expect(laudoServiceSpy.getLaudo).toHaveBeenCalledWith("tokenABC");
    expect(laudoServiceSpy.getCidadeNome).toHaveBeenCalledWith("c1");
    expect(component.dados.cidade).toBe("Cidade Teste");
    expect(component.stepIndex).toBe(0);
    expect(component.fotoMarca).toBe(
      "./assets/images/marcas/fiatuno.png"
    );
    expect(component.laudoDesc).toBe("Solicitado");
  }));

  it("should set step index according to status", () => {
    component.setStepIndex("SOLICITADO");
    expect(component.stepIndex).toBe(0);
    expect(component.statusText).toContain("Recebemos sua solicitação");
    expect(component.laudoDesc).toBe("Solicitado");

    component.setStepIndex("AGENDADO");
    expect(component.stepIndex).toBe(1);
    expect(component.statusText).toContain("vistoria já está agendada");
    expect(component.laudoDesc).toBe("Agendado");

    component.setStepIndex("VISTORIADO");
    expect(component.stepIndex).toBe(2);
    expect(component.statusText).toContain("Já realizamos sua vistoria");
    expect(component.laudoDesc).toBe("Vistoriado");

    component.setStepIndex("LAUDO_FINALIZADO");
    expect(component.stepIndex).toBe(3);
    expect(component.statusText).toBe("");
    expect(component.laudoDesc).toBe("Finalizado");

    component.setStepIndex("DESCONHECIDO");
    expect(component.laudoDesc).toBe("DESCONHECIDO");
  });

  it("should set fotoMarca path correctly", () => {
    component.setFotoMarca("Fiat Uno");
    expect(component.fotoMarca).toBe(
      "./assets/images/marcas/fiatuno.png"
    );

    component.setFotoMarca(null);
    expect(component.fotoMarca).toBe(
      "./assets/images/marcas/semmarca.png"
    );
  });
});
