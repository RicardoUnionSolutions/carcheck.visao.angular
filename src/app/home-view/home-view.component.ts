import { Component, OnInit } from "@angular/core";
import { Title, Meta } from "@angular/platform-browser";
import { DepoimentosComponent } from "./depoimentos/depoimentos.component";
import { SobreComponent } from "./sobre/sobre.component";
import { ComoFuncionaComponent } from "./como-funciona/como-funciona.component";
import { DuvidasFrequentesComponent } from "../duvidas-frequentes/duvidas-frequentes.component";
import { BlogComponent } from "./blog/blog.component";
import { LazyWrapperComponent } from "../shared/lazy-wrapper/lazy-wrapper.component";
import { DestaqueComponent } from "./destaque/destaque.component";
import { AplicativoComponent } from "./aplicativo/aplicativo.component";
import { ProdutosComponent } from "./produtos/produtos.component";
import { DestaqueServicosComponent } from "./destaque-servicos/destaque-servicos.component";

@Component({
  selector: "app-home-view",
  templateUrl: "./home-view.component.html",
  styleUrls: ["./home-view.component.scss"],
  standalone: true,
  imports: [
    DestaqueComponent,
    AplicativoComponent,
    ProdutosComponent,
    DestaqueServicosComponent,
    LazyWrapperComponent,
  ],
})
export class HomeViewComponent implements OnInit {
  depoimentosComponent = DepoimentosComponent;
  sobreComponent = SobreComponent;
  comoFuncionaComponent = ComoFuncionaComponent;
  duvidasFrequentesComponent = DuvidasFrequentesComponent;
  blogComponent = BlogComponent;

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit() {
    this.title.setTitle("Home - CarCheck");
    this.meta.updateTag({
      name: "description",
      content:
        "Saiba tudo sobre o histórico de veículos com a CarCheck. Consultas completas com dados de leilão, sinistro, fipe, proprietários e mais.",
    });
  }
}
