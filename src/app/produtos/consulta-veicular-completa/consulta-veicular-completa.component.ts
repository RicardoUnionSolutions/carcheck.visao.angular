import { Component, ViewEncapsulation } from "@angular/core";
import { VariableGlobal } from "../../service/variable.global.service";
import { CommonModule } from "@angular/common";
import { ExemploConsultaCompletaComponent } from "./exemplo-consulta-completa/exemplo-consulta-completa.component";
import { CompararProdutoComponent } from "../comparar-produto/comparar-produto.component";
import { ComoFuncionaComponent } from "../../home-view/como-funciona/como-funciona.component";
import { DuvidasFrequentesComponent } from "../../duvidas-frequentes/duvidas-frequentes.component";
import { ProdutosComponent } from "../../home-view/produtos/produtos.component";
import { AppearRightOnScrollDirective } from "../../directives/appearRight-on-scroll.directive";

@Component({
    selector: "app-consulta-veicular-completa",
    templateUrl: "./consulta-veicular-completa.component.html",
    styleUrls: ["./consulta-veicular-completa.component.scss"],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
      CommonModule,
      ExemploConsultaCompletaComponent,
      CompararProdutoComponent,
      ComoFuncionaComponent,
      DuvidasFrequentesComponent,
      ProdutosComponent,
      AppearRightOnScrollDirective,
    ]
})
export class ConsultaVeicularCompletaComponent {
  consulta;

  constructor(private variableGlobal: VariableGlobal) {
    this.consulta = this.variableGlobal
      .getProdutos()
      .find((consulta) => consulta.id == 3);
  }
}
