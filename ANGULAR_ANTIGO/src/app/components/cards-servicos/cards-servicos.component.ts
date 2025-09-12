import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-servicos',
  templateUrl: './cards-servicos.component.html',
  styleUrls: ['./cards-servicos.component.scss']
})
export class CardsServicosComponent implements OnInit {

  @Input() showNovidades = false;

  servicos = [
    {
      class: "seguro",
      title: "Seguro de veículos",
      icone: "fa-shield-alt",
      descricao: "Proteja seu carro com um seguro completo, confiável e acessível.",
      btn: "Solicitar cotação",
      url: "https://jessicasouza.seguralta.com.br",
      disponivel: true,
      target: "_blank",
      obs: ""
    },
    {
      class: "financiamento",
      title: "Financiamento",
      icone: "fa-hand-holding-usd",
      descricao: "Com condições especiais, seu carro novo está mais perto do que nunca!",
      btn: "Solicitar financiamento",
      url: "https://wa.me/5511916668244?text=Ol%C3%A1%2C%20vim%20atrav%C3%A9s%20da%20Carcheck%20Brasil%2C%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20o%20Financiamento%20de%20ve%C3%ADculos%20",
      disponivel: true,
      target: "_blank",
      obs: ""
    },
    {
      class: "debitos",
      title: "Pagar débitos",
      icone: "fa-usd",
      descricao: "Pague seu IPVA, Multas, Licenciamento de forma rápida e segura em ate 21x",
      btn: "Verificar débitos",
      url: "/pagar-debitos",
      disponivel: true,
      target: "_parent",
      obs: "* Apenas para veículos do estado de São Paulo"
    },
    {
      class: "vistoria",
      title: "Vistoria veícular",
      icone: "fa-clipboard-check",
      descricao: "Vistoria veicular simplificada: rápida, segura e especializada.",
      btn: "Solicitar vistoria",
      url: "",
      disponivel: false,
      target: "_parent",
      obs: ""
    },
    {
      class: "estetica",
      title: "Estética automotiva",
      icone: "fa-car",
      descricao: "Revitalize o visual do seu carro com nossos serviços de estética automotiva. Qualidade e cuidado em cada detalhe!",
      btn: "Saiba mais",
      url: "",
      disponivel: false,
      target: "_blank",
      obs: ""
    }
  ]

  constructor() { }

  ngOnInit() {
    if (!this.showNovidades) {
      this.servicos = this.servicos.filter(servico => servico.disponivel);
    }
  }

}
