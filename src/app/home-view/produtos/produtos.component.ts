import { Component, Input, OnInit } from "@angular/core";
import { VariableGlobal } from "../../service/variable.global.service";
import { FazerConsultaService } from "../../service/fazer-consulta.service";
import { Router } from "@angular/router";
import { Title, Meta } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { TipoProdutoConsultasComponent } from "./tipo-produto-consultas/tipo-produto-consultas.component";
import { TipoProdutoPacotesComponent } from "./tipo-produto-pacotes/tipo-produto-pacotes.component";
import { TabNavComponent } from "../../components/tab-nav/tab-nav.component";

@Component({
  selector: "app-produtos",
  templateUrl: "./produtos.component.html",
  styleUrls: ["./produtos.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    TipoProdutoConsultasComponent,
    TipoProdutoPacotesComponent,
    TabNavComponent,
  ],
})
export class ProdutosComponent implements OnInit {
  @Input() placa: any;
  @Input() detalhesExpandido: boolean;

  detalhesVisiveis: boolean[] = [];

  consultas;
  pacotes;

  menuProdutos: any = [];
  tabIndex = { consultas: 0, pacotes: 1 };
  tipoProduto = this.tabIndex.consultas;
  listaProdutos: any = [];

  constructor(
    private variableGlobal: VariableGlobal,
    private consultaService: FazerConsultaService,
    private router: Router,
    private title: Title,
    private meta: Meta
  ) {
    this.menuProdutos = [
      { title: "Consultas", icon: "", value: "CONSULTA" },
      { title: "Pacotes", icon: "", value: "PACOTES" },
    ];
  }

  async ngOnInit() {
    this.title.setTitle("Produtos - CarCheck");
    this.meta.updateTag({
      name: "description",
      content:
        "Conheça nossos produtos: consultas completas, histórico de veículos, pacotes personalizados e muito mais para garantir sua segurança na hora da compra.",
    });

    this.pacotes = await this.consultaService.getPacotes().toPromise();
    this.consultas = this.variableGlobal.getProdutos();
    this.moveRecomendadaToCenter();

    const currentUrl = this.router.url;
    if (currentUrl === "/processo-compra-multipla") {
      this.tipoProduto = this.tabIndex.pacotes;
    }
  }

  moveRecomendadaToCenter() {
    const index = this.consultas.findIndex((consulta) => consulta.recomendada);
    if (index !== 1) {
      const [recomendada] = this.consultas.splice(index, 1);
      this.consultas.splice(1, 0, recomendada);
    }

    const indexp = this.pacotes.findIndex((pacote) => pacote.recomendada);
    if (indexp !== 1) {
      const [recomendada] = this.pacotes.splice(indexp, 1);
      this.pacotes.splice(1, 0, recomendada);
    }
  }
}
