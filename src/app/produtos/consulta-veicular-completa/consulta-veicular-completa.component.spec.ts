import { Component, Directive, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ConsultaVeicularCompletaComponent } from "./consulta-veicular-completa.component";
import { VariableGlobal } from "../../service/variable.global.service";

@Component({
  selector: "app-exemplo-consulta-completa",
  standalone: true,
  template: "",
})
class ExemploConsultaCompletaStubComponent {}

@Component({
  selector: "app-comparar-produto",
  standalone: true,
  template: "",
})
class CompararProdutoStubComponent {
  @Input() consultaComparada: any;
}

@Component({
  selector: "app-como-funciona",
  standalone: true,
  template: "",
})
class ComoFuncionaStubComponent {}

@Component({
  selector: "app-duvidas-frequentes",
  standalone: true,
  template: "",
})
class DuvidasFrequentesStubComponent {}

@Component({
  selector: "app-produtos",
  standalone: true,
  template: "",
})
class ProdutosStubComponent {}

@Directive({
  selector: "[appAppearRightOnScroll]",
  standalone: true,
})
class AppearRightOnScrollStubDirective {}

describe("ConsultaVeicularCompletaComponent", () => {
  let fixture: ComponentFixture<ConsultaVeicularCompletaComponent>;
  let component: ConsultaVeicularCompletaComponent;
  let variableGlobal: VariableGlobal;
  const mockProdutos = [
    {
      id: 1,
      nome_da_consulta: "Consulta Base",
      valor_atual: 30.9,
      valor_promocional: 25.9,
    },
    {
      id: 3,
      nome_da_consulta: "Consulta Veicular Completa",
      valor_atual: 69.9,
      valor_promocional: 54.9,
    },
  ];

  beforeEach(async () => {
    TestBed.overrideComponent(ConsultaVeicularCompletaComponent, {
      set: {
        imports: [
          CommonModule,
          ExemploConsultaCompletaStubComponent,
          CompararProdutoStubComponent,
          ComoFuncionaStubComponent,
          DuvidasFrequentesStubComponent,
          ProdutosStubComponent,
          AppearRightOnScrollStubDirective,
        ],
      },
    });

    await TestBed.configureTestingModule({
      imports: [ConsultaVeicularCompletaComponent],
    }).compileComponents();

    variableGlobal = TestBed.inject(VariableGlobal);
    spyOn(variableGlobal, "getProdutos").and.returnValue(mockProdutos);

    fixture = TestBed.createComponent(ConsultaVeicularCompletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve carregar a consulta recomendada com id 3", () => {
    expect(variableGlobal.getProdutos).toHaveBeenCalled();
    expect(component.consulta).toEqual(mockProdutos[1]);
  });

  it("deve exibir as informações principais da consulta na tela", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("h1")?.textContent).toContain(
      "Consulta Veicular Completa",
    );
    expect(compiled.querySelector(".consulta .azul")?.textContent).toContain(
      "Consulta Veicular Completa",
    );
    expect(compiled.querySelector(".consulta .de")?.textContent).toContain(
      "69,90",
    );
    expect(compiled.querySelector(".consulta .preco")?.textContent).toContain(
      "54,90",
    );
    expect(compiled.querySelector(".consulta .label")?.textContent).toContain(
      "RECOMENDADA",
    );
  });
});
