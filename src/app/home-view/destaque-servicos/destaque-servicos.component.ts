import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppearOnScrollDirective } from "../../directives/appear-on-scroll.directive";

@Component({
  selector: "app-destaque-servicos",
  templateUrl: "./destaque-servicos.component.html",
  styleUrls: ["./destaque-servicos.component.scss"],
  standalone: true,
  imports: [RouterModule, AppearOnScrollDirective],
})
export class DestaqueServicosComponent {
  // Componente simplificado - sem lógica complexa desnecessária
}
