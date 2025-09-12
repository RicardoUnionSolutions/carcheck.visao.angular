import { Component, OnInit } from "@angular/core";
import { VariableGlobal } from "../../service/variable.global.service";

@Component({
  selector: "app-consulta-veicular-leilao",
  templateUrl: "./consulta-veicular-leilao.component.html",
  styleUrls: ["./consulta-veicular-leilao.component.scss"],
})
export class ConsultaVeicularLeilaoComponent {
  consulta;

  constructor(private variableGlobal: VariableGlobal) {
    this.consulta = this.variableGlobal
      .getProdutos()
      .find((consulta) => consulta.id == 2);
  }
}
