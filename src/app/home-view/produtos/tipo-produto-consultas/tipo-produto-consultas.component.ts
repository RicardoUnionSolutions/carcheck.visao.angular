import { Component, Input, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppearOnScrollDirective } from "../../../directives/appear-on-scroll.directive";

@Component({
  selector: "tipo-produto-consultas",
  templateUrl: "./tipo-produto-consultas.component.html",
  styleUrls: ["./tipo-produto-consultas.component.scss"],
  standalone: true,
  imports: [CommonModule, AppearOnScrollDirective],
})
export class TipoProdutoConsultasComponent implements OnInit, AfterViewInit {
  @Input() placa: any;
  @Input() detalhesExpandido: boolean;
  @Input() consultas;
  detalhesVisiveis: boolean[] = [];

  constructor(private router: Router) {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.detalhesExpandido) {
      for (let index = 0; index < this.consultas.length; index++) {
        this.mostraDetalhes(index);
      }
    }
  }

  moveRecomendadaToCenter() {
    const index = this.consultas.findIndex((consulta) => consulta.recomendada);
    if (index !== 1) {
      const [recomendada] = this.consultas.splice(index, 1);
      this.consultas.splice(1, 0, recomendada);
    }
  }

  mostraDetalhes(index: number) {
    const detalhes = document.getElementById("detalhes" + index);
    const btnDetalhes = document.getElementById("bt_detalhes" + index);
    const btnFecharDetalhes = document.getElementById(
      "btn_fecharDetalhes" + index
    );
    if (detalhes) {
      this.detalhesVisiveis[index] = true;
      detalhes.style.overflow = "visible";
      btnDetalhes.style.display = "none";
      btnFecharDetalhes.style.display = "block";
    }
  }

  fecharDetalhes(index: number) {
    const detalhes = document.getElementById("detalhes" + index);
    const btnDetalhes = document.getElementById("bt_detalhes" + index);
    const btnFecharDetalhes = document.getElementById(
      "btn_fecharDetalhes" + index
    );
    if (detalhes) {
      this.detalhesVisiveis[index] = false;
      detalhes.style.overflow = "hidden";
      btnDetalhes.style.display = "block";
      btnFecharDetalhes.style.display = "none";
    }
  }

  clickComprar(consultaSlug) {
    if (this.placa) {
      this.router.navigate([
        "/comprar-consulta-placa/" + consultaSlug + "/" + this.placa,
      ]);
    } else {
      this.router.navigate(["/comprar-consulta-placa/" + consultaSlug]);
    }
  }

  valorToString(preco) {
    return (
      "R$" +
      preco.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
}
