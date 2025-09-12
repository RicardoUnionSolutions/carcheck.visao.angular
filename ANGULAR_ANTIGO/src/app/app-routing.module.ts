
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcessoCompraComponent } from './processo-compra/processo-compra.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { ConsultaInicialComponent } from './consulta-inicial/consulta-inicial.component';
import { StatusPagamentoComponent } from './status-pagamento/status-pagamento.component';
import { ProcessoCompraMultiplasConsultasComponent } from './processo-compra-multiplas-consultas/processo-compra-multiplas-consultas.component';
import { LoginViewComponent } from './login-view/login-view.component';
import { DadosContaComponent } from './dados-conta/dados-conta.component';
import { HistoricoConsultaComponent } from './historico-consulta/historico-consulta.component';
import { CompletarCadastroComponent } from './completar-cadastro/completar-cadastro.component';
import { RealizarConsultasComponent } from './realizar-consultas/realizar-consultas.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { ConfirmacaoPagamentoComponent } from './confirmacao-pagamento/confirmacao-pagamento.component';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { VistoriaComponent } from './vistoria/vistoria.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { ConsultaPlacaVeiculoComponent } from './consulta-placa-veiculo/consulta-placa-veiculo.component';
import { ConsultaVeicularCompletaComponent } from './produtos/consulta-veicular-completa/consulta-veicular-completa.component';
import { ConsultaVeicularSeguraComponent } from './produtos/consulta-veicular-segura/consulta-veicular-segura.component';
import { ConsultaVeicularLeilaoComponent } from './produtos/consulta-veicular-leilao/consulta-veicular-leilao.component';
import { ContatoComponent } from './contato/contato.component';
import { DuvidasFrequentesComponent } from './duvidas-frequentes/duvidas-frequentes.component';
import { BlogViewComponent } from './blog-view/blog-view.component';
import { PostViewComponent } from './blog-view/post-view/post-view.component';
import { ConsultaCompanyComponent } from './consulta-company/consulta-company.component';
import { PoliticaDePrivacidadeComponent } from './politica-de-privacidade/politica-de-privacidade.component';
import { ServicosComponent } from './home-view/servicos/servicos.component';
import { PagarDebitosComponent } from './pagar-debitos/pagar-debitos.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], component: HistoricoConsultaComponent },
  { path: 'home', component: HomeViewComponent },
  { path: 'consulta-placa-veiculo', component: ConsultaPlacaVeiculoComponent },
  { path: 'produto/consulta-veicular-completa', component: ConsultaVeicularCompletaComponent },
  { path: 'produto/consulta-veicular-segura', component: ConsultaVeicularSeguraComponent },
  { path: 'produto/consulta-veicular-leilão', component: ConsultaVeicularLeilaoComponent },
  { path: 'produto/consulta-veicular-leilao', component: ConsultaVeicularLeilaoComponent },
  { path: 'contato', component: ContatoComponent },
  { path: 'servicos', component: ServicosComponent },
  { path: 'duvidas-frequentes', component: DuvidasFrequentesComponent },
  { path: 'blog', component: BlogViewComponent },
  { path: 'blog/:id/:slug', component: PostViewComponent },
  { path: 'blog/:categoriaSlug', component: BlogViewComponent },
  { path: 'vistoria/:token', component: VistoriaComponent },
  { path: 'logout', canActivate: [AuthGuardService], component: LoginViewComponent },
  { path: 'login', component: LoginViewComponent },
  { path: 'cadastro-pf', component: LoginViewComponent },
  { path: 'cadastro-pj', component: LoginViewComponent },
  { path: 'login/:logout', component: LoginViewComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'completar-cadastro', component: CompletarCadastroComponent },
  { path: 'comprar-consulta-placa', component: ProcessoCompraComponent },
  { path: 'comprar-consulta-placa/:consulta', component: ProcessoCompraComponent },
  { path: 'comprar-consulta-placa/:consulta/:placa', component: ProcessoCompraComponent },
  { path: 'comprar-consulta-placa/:consulta/:placa/:email', component: ProcessoCompraComponent },
  { path: 'processo-compra-multipla', canActivate: [AuthGuardService], component: ProcessoCompraMultiplasConsultasComponent },
  { path: 'status-pagamento', canActivate: [AuthGuardService], component: StatusPagamentoComponent },
  { path: 'conta', canActivate: [AuthGuardService], component: DadosContaComponent },
  { path: 'realizar-consultas', canActivate: [AuthGuardService], component: RealizarConsultasComponent },
  { path: 'confirmacao-pagamento', canActivate: [AuthGuardService], component: ConfirmacaoPagamentoComponent },
  { path: 'consulta/:tokenConsulta', component: ConsultaComponent },
  { path: 'visualizar-consulta/:tokenConsulta', component: ConsultaCompanyComponent },
  // {path: 'consulta-teste/:placa/:tokenRecaptcha', component: ConsultaInicialComponent},
  { path: 'consulta-teste/:placa/:email/:nome/:tokenRecaptcha', component: ConsultaInicialComponent },
  { path: 'politica-da-privacidade', component: PoliticaDePrivacidadeComponent },
  { path: 'pagar-debitos', component: PagarDebitosComponent },
  { path: 'pagar-debitos/:consultaId', component: PagarDebitosComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled', // Add options right here
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
