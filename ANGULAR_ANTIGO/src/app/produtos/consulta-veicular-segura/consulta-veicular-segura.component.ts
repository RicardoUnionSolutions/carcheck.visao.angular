import { Component } from "@angular/core";
import { VariableGlobal } from "../../service/variable.global.service";

@Component({
  selector: "app-consulta-veicular-segura",
  templateUrl: "./consulta-veicular-segura.component.html",
  styleUrls: ["./consulta-veicular-segura.component.scss"],
})
export class ConsultaVeicularSeguraComponent {
  consulta;

  constructor(private variableGlobal: VariableGlobal) {
    this.consulta = this.variableGlobal
      .getProdutos()
      .find((consulta) => consulta.id == 5);
  }
}
