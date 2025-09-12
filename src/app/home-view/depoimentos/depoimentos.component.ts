import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppearRightOnScrollDirective } from "../../directives/appearRight-on-scroll.directive";

@Component({
  selector: "app-depoimentos",
  templateUrl: "./depoimentos.component.html",
  styleUrls: ["./depoimentos.component.scss"],
  standalone: true,
  imports: [CommonModule, AppearRightOnScrollDirective],
})
export class DepoimentosComponent implements OnInit {
  reviews = [
    {
      photo: "https://randomuser.me/api/portraits/women/22.jpg",
      name: "Cassiane Mayra",
      stars: [1, 1, 1, 1, 1],
      comment:
        "Me ajudou a ter certeza de que o carro que comprei tinha boa procedência.",
    },
    {
      photo: "https://randomuser.me/api/portraits/women/91.jpg",
      name: "Sandra Rodrigues",
      stars: [1, 1, 1, 1, 1],
      comment: " Seguro,confiável,rápido e com preço muito amigável. ",
    },
    {
      photo: "https://randomuser.me/api/portraits/men/19.jpg",
      name: "Gabriel Freire",
      stars: [1, 1, 1, 1, 1],
      comment:
        "Informações precisas! O atendimento responde rápido em horários comercial. Muito bom!",
    },
    {
      photo: "https://randomuser.me/api/portraits/men/41.jpg",
      name: "Willian Vargas",
      stars: [1, 1, 1, 1, 1],
      comment:
        "Sou Car Hunter e sempre repasso as consultas da Carcheck Brasil para meus clientes",
    },
    {
      photo: "https://randomuser.me/api/portraits/men/87.jpg",
      name: "Igor Meirelles",
      stars: [1, 1, 1, 1, 1],
      comment:
        "Indispensável na hora de comprar um carro, cumpre com oque promete.",
    },
  ];

  constructor() {}

  ngOnInit() {}
}
