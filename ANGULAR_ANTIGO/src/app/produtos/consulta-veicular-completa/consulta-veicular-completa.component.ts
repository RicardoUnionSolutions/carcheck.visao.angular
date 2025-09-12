import { Component, ViewEncapsulation } from "@angular/core";
import { VariableGlobal } from "../../service/variable.global.service";

@Component({
  selector: "app-consulta-veicular-completa",
  templateUrl: "./consulta-veicular-completa.component.html",
  styleUrls: ["./consulta-veicular-completa.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ConsultaVeicularCompletaComponent {
  consulta;

  constructor(private variableGlobal: VariableGlobal) {
    this.consulta = this.variableGlobal
      .getProdutos()
      .find((consulta) => consulta.id == 3);
  }
}
