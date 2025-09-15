import { Component } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { CardsServicosComponent } from "../../components/cards-servicos/cards-servicos.component";
import { AppearOnScrollDirective } from "../../directives/appear-on-scroll.directive";
import { AppearRightOnScrollDirective } from "../../directives/appearRight-on-scroll.directive";

@Component({
  selector: "app-servicos",
  templateUrl: "./servicos.component.html",
  styleUrls: ["./servicos.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    CardsServicosComponent,
    AppearOnScrollDirective,
    AppearRightOnScrollDirective,
  ],
})
export class ServicosComponent {
  // Componente simplificado - sem lógica complexa desnecessária
}
