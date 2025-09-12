import { Component } from "@angular/core";
import { VariableGlobal } from "../../service/variable.global.service";
import { CommonModule } from "@angular/common";
import { ExemploConsultaLeilaoComponent } from "./exemplo-consulta-leilao/exemplo-consulta-leilao.component";
import { CompararProdutoComponent } from "../comparar-produto/comparar-produto.component";
import { ComoFuncionaComponent } from "../../home-view/como-funciona/como-funciona.component";
import { DuvidasFrequentesComponent } from "../../duvidas-frequentes/duvidas-frequentes.component";
import { ProdutosComponent } from "../../home-view/produtos/produtos.component";

@Component({
    selector: "app-consulta-veicular-leilao",
    templateUrl: "./consulta-veicular-leilao.component.html",
    styleUrls: ["./consulta-veicular-leilao.component.scss"],
    standalone: true,
    imports: [
      CommonModule,
      ExemploConsultaLeilaoComponent,
      CompararProdutoComponent,
      ComoFuncionaComponent,
      DuvidasFrequentesComponent,
      ProdutosComponent
    ]
})
export class ConsultaVeicularLeilaoComponent {
  consulta;

  constructor(private variableGlobal: VariableGlobal) {
    this.consulta = this.variableGlobal
      .getProdutos()
      .find((consulta) => consulta.id == 2);
  }
}
