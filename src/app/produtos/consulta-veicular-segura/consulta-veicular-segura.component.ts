import { Component } from "@angular/core";
import { VariableGlobal } from "../../service/variable.global.service";
import { CommonModule } from "@angular/common";
import { ExemploConsultaSeguraComponent } from "./exemplo-consulta-segura/exemplo-consulta-segura.component";
import { CompararProdutoComponent } from "../../produtos/comparar-produto/comparar-produto.component";
import { ComoFuncionaComponent } from "../../home-view/como-funciona/como-funciona.component";
import { DuvidasFrequentesComponent } from "../../duvidas-frequentes/duvidas-frequentes.component";
import { ProdutosComponent } from "../../home-view/produtos/produtos.component";
import { AppearRightOnScrollDirective } from "../../directives/appearRight-on-scroll.directive";

@Component({
    selector: "app-consulta-veicular-segura",
    templateUrl: "./consulta-veicular-segura.component.html",
    styleUrls: ["./consulta-veicular-segura.component.scss"],
    standalone: true,
    imports: [
      CommonModule,
      ExemploConsultaSeguraComponent,
      CompararProdutoComponent,
      ComoFuncionaComponent,
      DuvidasFrequentesComponent,
      ProdutosComponent,
      AppearRightOnScrollDirective
    ]
})
export class ConsultaVeicularSeguraComponent {
  consulta;

  constructor(private variableGlobal: VariableGlobal) {
    this.consulta = this.variableGlobal
      .getProdutos()
      .find((consulta) => consulta.id == 5);
  }
}
