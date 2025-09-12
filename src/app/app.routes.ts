import { Routes } from "@angular/router";
import { HomeViewComponent } from "./home-view/home-view.component";
import { ConsultaPlacaVeiculoComponent } from "./consulta-placa-veiculo/consulta-placa-veiculo.component";
import { ConsultaVeicularCompletaComponent } from "./produtos/consulta-veicular-completa/consulta-veicular-completa.component";
import { ConsultaVeicularSeguraComponent } from "./produtos/consulta-veicular-segura/consulta-veicular-segura.component";
import { ConsultaVeicularLeilaoComponent } from "./produtos/consulta-veicular-leilao/consulta-veicular-leilao.component";
import { ContatoComponent } from "./contato/contato.component";
import { ServicosComponent } from "./home-view/servicos/servicos.component";
import { DuvidasFrequentesComponent } from "./duvidas-frequentes/duvidas-frequentes.component";
import { BlogViewComponent } from "./blog-view/blog-view.component";
import { PostViewComponent } from "./blog-view/post-view/post-view.component";
import { VistoriaComponent } from "./vistoria/vistoria.component";
import { LoginViewComponent } from "./login-view/login-view.component";
import { RecuperarSenhaComponent } from "./recuperar-senha/recuperar-senha.component";
import { CompletarCadastroComponent } from "./completar-cadastro/completar-cadastro.component";
import { ProcessoCompraComponent } from "./processo-compra/processo-compra.component";
import { ProcessoCompraMultiplasConsultasComponent } from "./processo-compra-multiplas-consultas/processo-compra-multiplas-consultas.component";
import { StatusPagamentoComponent } from "./status-pagamento/status-pagamento.component";
import { DadosContaComponent } from "./dados-conta/dados-conta.component";
import { RealizarConsultasComponent } from "./realizar-consultas/realizar-consultas.component";
import { ConfirmacaoPagamentoComponent } from "./confirmacao-pagamento/confirmacao-pagamento.component";
import { ConsultaComponent } from "./consulta/consulta.component";
import { ConsultaCompanyComponent } from "./consulta-company/consulta-company.component";
import { ConsultaInicialComponent } from "./consulta-inicial/consulta-inicial.component";
import { PoliticaDePrivacidadeComponent } from "./politica-de-privacidade/politica-de-privacidade.component";
import { PagarDebitosComponent } from "./pagar-debitos/pagar-debitos.component";
import { HistoricoConsultaComponent } from "./historico-consulta/historico-consulta.component";
import { AuthGuardService } from "./guards/auth-guard.service";
import { ComponentesViewerComponent } from "../lib/componentes/componentes-viewer/componentes-viewer.component";
import { CkInputDemoComponent } from "../lib/componentes/ck-input-demo/ck-input-demo.component";
import { CkSelectDemoComponent } from "../lib/componentes/ck-select-demo/ck-select-demo.component";
import { CkModalDemoComponent } from "../lib/componentes/ck-modal-demo/ck-modal-demo.component";
import { CkLoadingDemoComponent } from "../lib/componentes/ck-loading-demo/ck-loading-demo.component";
import { CkProgressDemoComponent } from "../lib/componentes/ck-progress-demo/ck-progress-demo.component";
import { CkTagDemoComponent } from "../lib/componentes/ck-tag-demo/ck-tag-demo.component";
import { CkCounterDemoComponent } from "../lib/componentes/ck-counter-demo/ck-counter-demo.component";
import { StepDemoComponent } from "../lib/componentes/step-demo/step-demo.component";

export const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuardService],
    component: HistoricoConsultaComponent,
  },
  { path: "home", component: HomeViewComponent },
  {
    path: "historico-consulta",
    canActivate: [AuthGuardService],
    component: HistoricoConsultaComponent,
  },
  { path: "consulta-placa-veiculo", component: ConsultaPlacaVeiculoComponent },
  {
    path: "produto/consulta-veicular-completa",
    component: ConsultaVeicularCompletaComponent,
  },
  {
    path: "produto/consulta-veicular-segura",
    component: ConsultaVeicularSeguraComponent,
  },
  {
    path: "produto/consulta-veicular-leilao",
    component: ConsultaVeicularLeilaoComponent,
  },
  { path: "contato", component: ContatoComponent },
  { path: "servicos", component: ServicosComponent },
  { path: "duvidas-frequentes", component: DuvidasFrequentesComponent },
  { path: "blog", component: BlogViewComponent },
  { path: "blog/:id/:slug", component: PostViewComponent },
  { path: "blog/:categoriaSlug", component: BlogViewComponent },
  { path: "vistoria/:token", component: VistoriaComponent },
  {
    path: "logout",
    canActivate: [AuthGuardService],
    component: LoginViewComponent,
  },
  { path: "login", component: LoginViewComponent },
  { path: "cadastro-pf", component: LoginViewComponent },
  { path: "cadastro-pj", component: LoginViewComponent },
  { path: "login/:logout", component: LoginViewComponent },
  { path: "recuperar-senha", component: RecuperarSenhaComponent },
  { path: "completar-cadastro", component: CompletarCadastroComponent },
  { path: "comprar-consulta-placa", component: ProcessoCompraComponent },
  {
    path: "comprar-consulta-placa/:consulta",
    component: ProcessoCompraComponent,
  },
  {
    path: "comprar-consulta-placa/:consulta/:placa",
    component: ProcessoCompraComponent,
  },
  {
    path: "comprar-consulta-placa/:consulta/:placa/:email",
    component: ProcessoCompraComponent,
  },
  {
    path: "processo-compra-multipla",
    canActivate: [AuthGuardService],
    component: ProcessoCompraMultiplasConsultasComponent,
  },
  {
    path: "status-pagamento",
    canActivate: [AuthGuardService],
    component: StatusPagamentoComponent,
  },
  {
    path: "conta",
    canActivate: [AuthGuardService],
    component: DadosContaComponent,
  },
  {
    path: "realizar-consultas",
    canActivate: [AuthGuardService],
    component: RealizarConsultasComponent,
  },
  {
    path: "confirmacao-pagamento",
    canActivate: [AuthGuardService],
    component: ConfirmacaoPagamentoComponent,
  },
  { path: "consulta/:tokenConsulta", component: ConsultaComponent },
  {
    path: "visualizar-consulta/:tokenConsulta",
    component: ConsultaCompanyComponent,
  },
  {
    path: "consulta-teste/:placa/:email/:nome/:tokenRecaptcha",
    component: ConsultaInicialComponent,
  },
  {
    path: "politica-de-privacidade",
    component: PoliticaDePrivacidadeComponent,
  },
  { path: "pagar-debitos", component: PagarDebitosComponent },
  { path: "pagar-debitos/:consultaId", component: PagarDebitosComponent },
  { path: "lib/componentes", component: ComponentesViewerComponent },
  { path: "lib/componentes/ck-input-demo", component: CkInputDemoComponent },
  { path: "lib/componentes/ck-select-demo", component: CkSelectDemoComponent },
  { path: "lib/componentes/ck-modal-demo", component: CkModalDemoComponent },
  {
    path: "lib/componentes/ck-loading-demo",
    component: CkLoadingDemoComponent,
  },
  {
    path: "lib/componentes/ck-progress-demo",
    component: CkProgressDemoComponent,
  },
  { path: "lib/componentes/ck-tag-demo", component: CkTagDemoComponent },
  {
    path: "lib/componentes/ck-counter-demo",
    component: CkCounterDemoComponent,
  },
  { path: "lib/componentes/step-demo", component: StepDemoComponent },
  { path: "**", redirectTo: "" },
];
