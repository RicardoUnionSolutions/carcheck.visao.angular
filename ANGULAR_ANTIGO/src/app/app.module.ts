import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localePT from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TextMaskModule } from 'angular2-text-mask';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { CkInputComponent } from './components/ck-input/ck-input.component';
import { CkProgressBarComponent } from './components/ck-progress-bar/ck-progress-bar.component';
import { CkSelectComponent } from './components/ck-select/ck-select.component';
import { ComprarConsultaMultiplaComponent } from './components/comprar-consulta-multipla/comprar-consulta-multipla.component';
import { ComprarConsultaComponent } from './components/comprar-consulta/comprar-consulta.component';
import { FooterComponent } from './components/footer/footer.component';
import { BoletoComponent } from './components/forma-pagamento/boleto/boleto.component';
import { CreditoComponent } from './components/forma-pagamento/credito/credito.component';
import { DebitoComponent } from './components/forma-pagamento/debito/debito.component';
import { FormaPagamentoComponent } from './components/forma-pagamento/forma-pagamento.component';
import { PixComponent } from './components/forma-pagamento/pix/pix.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SelecionarVeiculoComponent } from './components/selecionar-veiculo/selecionar-veiculo.component';
import { StepBarComponent } from './components/step-by-step/step-bar/step-bar.component';
import { StepByStepComponent } from './components/step-by-step/step-by-step.component';
import { StepComponent } from './components/step-by-step/step/step.component';

import { CadastrarPessoaFisicaComponent } from './components/cadastrar/cadastrar-pessoa-fisica/cadastrar-pessoa-fisica.component';
import { CadastrarPessoaJuridicaComponent } from './components/cadastrar/cadastrar-pessoa-juridica/cadastrar-pessoa-juridica.component';
import { CadastrarComponent } from './components/cadastrar/cadastrar.component';
import { InfoCadastroComponent } from './components/cadastrar/info-cadastro/info-cadastro.component';
import { TabNavComponent } from './components/tab-nav/tab-nav.component';
import { ConsultaInicialComponent } from './consulta-inicial/consulta-inicial.component';
import { BarComponent } from './consulta/bar/bar.component';
import { ChecklistComponent } from './consulta/checklist/checklist.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { DadosDecodificacaoChassiComponent } from './consulta/detalhamento/dados-decodificacao-chassi/dados-decodificacao-chassi.component';
import { DadosDpvatComponent } from './consulta/detalhamento/dados-dpvat/dados-dpvat.component';
import { DadosDuplicidadeMotorComponent } from './consulta/detalhamento/dados-duplicidade-motor/dados-duplicidade-motor.component';
import { DadosEstaduaisComponent } from './consulta/detalhamento/dados-estaduais/dados-estaduais.component';
import { DadosFipeComponent } from './consulta/detalhamento/dados-fipe/dados-fipe.component';
import { DadosGravamesComponent } from './consulta/detalhamento/dados-gravames/dados-gravames.component';
import { DadosIndicioSinistroComponent } from './consulta/detalhamento/dados-indicio-sinistro/dados-indicio-sinistro.component';
import { DadosLeilaoComponent } from './consulta/detalhamento/dados-leilao/dados-leilao.component';
import { DadosMotorComponent } from './consulta/detalhamento/dados-motor/dados-motor.component';
import { DadosNacionaisComponent } from './consulta/detalhamento/dados-nacionais/dados-nacionais.component';
import { DadosProprietariosComponent } from './consulta/detalhamento/dados-proprietarios/dados-proprietarios.component';
import { DadosRecallComponent } from './consulta/detalhamento/dados-recall/dados-recall.component';
import { DetalhamentoComponent } from './consulta/detalhamento/detalhamento.component';
import { ResumoComponent } from './consulta/resumo/resumo.component';
import { TimelineComponent } from './consulta/timeline/timeline.component';
import { ProcessoCompraComponent } from './processo-compra/processo-compra.component';
import { StatusPagamentoComponent } from './status-pagamento/status-pagamento.component';

import { dadosConsultaService } from './service/dados-consulta.service';
import { ErrorHandlerService } from './service/error-handler.service';
import { FazerConsultaService } from './service/fazer-consulta.service';
import { PagamentoService } from './service/pagamento.service';
import { PagSeguroService } from './service/pagseguro.service';
import { PessoaService } from './service/pessoa.service';
import { TokenService } from './service/token.service';
import { VariableGlobal } from './service/variable.global.service';

import { JwtHelperService as JwtHelper, JwtModule } from '@auth0/angular-jwt';
import { InlineSVGModule } from 'ng-inline-svg';
import { CkChartComponent } from './components/ck-chart/ck-chart.component';
import { CkCounterComponent } from './components/ck-counter/ck-counter.component';
import { CkTagComponent } from './components/ck-tag/ck-tag.component';
import { CheckItemComponent } from './consulta/checklist/check-item/check-item.component';
import { DadosDesvalorizacaoComponent } from './consulta/detalhamento/dados-desvalorizacao/dados-desvalorizacao.component';
import { DadosContaComponent } from './dados-conta/dados-conta.component';
import { HistoricoCardComponent } from './historico-consulta/historico-card/historico-card.component';
import { HistoricoConsultaComponent } from './historico-consulta/historico-consulta.component';
import { LoginViewComponent } from './login-view/login-view.component';
import { ProcessoCompraMultiplasConsultasComponent } from './processo-compra-multiplas-consultas/processo-compra-multiplas-consultas.component';

import { NavbarDropdownComponent } from "./components/navbar/navbar-dropdown/navbar-dropdown.component";
import { NavbarSubComponent } from "./components/navbar/navbar-sub/navbar-sub.component";

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CompletarCadastroComponent } from './completar-cadastro/completar-cadastro.component';
import { CadastrarAcessoComponent } from './components/cadastrar/cadastrar-acesso/cadastrar-acesso.component';
import { CadastrarDadosUsuarioComponent } from './components/cadastrar/cadastrar-dados-usuario/cadastrar-dados-usuario.component';
import { CkLoadingComponent } from './components/ck-loading/ck-loading.component';
import { CkModalMsgComponent } from './components/ck-modal/ck-modal-msg/ck-modal-msg.component';
import { CkModalComponent } from './components/ck-modal/ck-modal.component';
import { LoginUserCardComponent } from './components/login-user-card/login-user-card.component';
import { ConfirmacaoPagamentoComponent } from './confirmacao-pagamento/confirmacao-pagamento.component';
import { ConsultaMsgComponent } from './consulta/consulta-msg/consulta-msg.component';
import { DadosBlocoDenatranComponent } from './consulta/detalhamento/dados-bloco-denatran/dados-bloco-denatran.component';
import { DadosBlocoDetranComponent } from './consulta/detalhamento/dados-bloco-detran/dados-bloco-detran.component';
import { DadosBlocoMultaComponent } from './consulta/detalhamento/dados-bloco-multa/dados-bloco-multa.component';
import { DadosPrecoMedioComponent } from './consulta/detalhamento/dados-preco-medio/dados-preco-medio.component';
import { FeedbackComponent } from './consulta/feedback/feedback.component';
import { ObservacoesComponent } from './consulta/observacoes/observacoes.component';
import { RealizarConsultasComponent } from './realizar-consultas/realizar-consultas.component';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { CepService } from './service/cep.service';
import { LoginService } from './service/login.service';
import { ModalService } from './service/modal.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CodeInputModule } from 'angular-code-input';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxCaptchaModule } from 'ngx-captcha';
import { CardModule } from 'ngx-card';
import 'url-search-params-polyfill';
import { AppInterceptor } from './app-interceptor.service';
import { BlogViewComponent } from './blog-view/blog-view.component';
import { PostViewComponent } from './blog-view/post-view/post-view.component';
import { BannerVistoriaComponent } from './components/banner-vistoria/banner-vistoria.component';
import { ConfirmarEmailComponent } from './components/confirmar-email/confirmar-email.component';
import { ConsultasDisponiveisComponent } from './components/consultas-disponiveis/consultas-disponiveis.component';
import { DisplayProdutoPagamentoComponent } from './components/display-produto-pagamento/display-produto-pagamento.component';
import { FloatingChatComponent } from './components/floating-chat/floating-chat.component';
import { FormLaudoAdicionalComponent } from './components/form-laudo-adicional/form-laudo-adicional.component';
import { FormLaudoComponent } from './components/form-laudo/form-laudo.component';
import { SideMenubarComponent } from './components/navbar/side-menubar/side-menubar.component';
import { StepByStepSmComponent } from './components/step-by-step-sm/step-by-step-sm.component';
import { ConsultaCompanyComponent } from './consulta-company/consulta-company.component';
import { ConsultaPlacaVeiculoComponent } from './consulta-placa-veiculo/consulta-placa-veiculo.component';
import { CardServicosComponent } from './consulta/card-servicos/card-servicos.component';
import { DadosBlocoHistoricoRouboFurtoComponent } from './consulta/detalhamento/dados-bloco-historico-roubo-furto/dados-bloco-historico-roubo-furto.component';
import { DadosBlocoRoboDenatranComponent } from './consulta/detalhamento/dados-bloco-robo-denatran/dados-bloco-robo-denatran.component';
import { DadosConsultaDenatranComponent } from './consulta/detalhamento/dados-consulta-denatran/dados-consulta-denatran.component';
import { DadosDivergenciaMotorComponent } from './consulta/detalhamento/dados-divergencia-motor/dados-divergencia-motor.component';
import { DadosParecerTecnicoComponent } from './consulta/detalhamento/dados-parecer-tecnico/dados-parecer-tecnico.component';
import { DadosPrecoMercadoFinanceiroComponent } from './consulta/detalhamento/dados-preco-mercado-financeiro/dados-preco-mercado-financeiro.component';
import { ItemTagComponent } from './consulta/detalhamento/dados-preco-mercado-financeiro/item-tag/item-tag.component';
import { ItemVeiculoComponent } from './consulta/detalhamento/dados-preco-mercado-financeiro/item-veiculo/item-veiculo.component';
import { DadosRemarketingComponent } from './consulta/detalhamento/dados-remarketing/dados-remarketing.component';
import { ContatoComponent } from './contato/contato.component';
import { AppearOnScrollDirective } from './directives/appear-on-scroll.directive';
import { AppearRightOnScrollDirective } from './directives/appearRight-on-scroll.directive';
import { OnlyLettersDirective } from './directives/onlyLetters.directive';
import { OnlyNumbersDirective } from './directives/onlyNumbers.directive';
import { DuvidasFrequentesComponent } from './duvidas-frequentes/duvidas-frequentes.component';
import { AplicativoComponent } from './home-view/aplicativo/aplicativo.component';
import { BlogComponent } from './home-view/blog/blog.component';
import { ComoFuncionaComponent } from './home-view/como-funciona/como-funciona.component';
import { DepoimentosComponent } from './home-view/depoimentos/depoimentos.component';
import { DestaqueServicosComponent } from './home-view/destaque-servicos/destaque-servicos.component';
import { DestaqueComponent } from './home-view/destaque/destaque.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { ProdutosComponent } from './home-view/produtos/produtos.component';
import { TipoProdutoConsultasComponent } from './home-view/produtos/tipo-produto-consultas/tipo-produto-consultas.component';
import { TipoProdutoPacotesComponent } from './home-view/produtos/tipo-produto-pacotes/tipo-produto-pacotes.component';
import { SeguraltaComponent } from './home-view/seguralta/seguralta.component';
import { ServicosComponent } from './home-view/servicos/servicos.component';
import { SobreComponent } from './home-view/sobre/sobre.component';
import { PagarDebitosComponent } from './pagar-debitos/pagar-debitos.component';
import { PoliticaDePrivacidadeComponent } from './politica-de-privacidade/politica-de-privacidade.component';
import { CompararProdutoComponent } from './produtos/comparar-produto/comparar-produto.component';
import { ConsultaVeicularCompletaComponent } from './produtos/consulta-veicular-completa/consulta-veicular-completa.component';
import { ExemploConsultaCompletaComponent } from './produtos/consulta-veicular-completa/exemplo-consulta-completa/exemplo-consulta-completa.component';
import { ConsultaVeicularLeilaoComponent } from './produtos/consulta-veicular-leilao/consulta-veicular-leilao.component';
import { ExemploConsultaLeilaoComponent } from './produtos/consulta-veicular-leilao/exemplo-consulta-leilao/exemplo-consulta-leilao.component';
import { ConsultaVeicularSeguraComponent } from './produtos/consulta-veicular-segura/consulta-veicular-segura.component';
import { ExemploConsultaSeguraComponent } from './produtos/consulta-veicular-segura/exemplo-consulta-segura/exemplo-consulta-segura.component';
import { PagarDebitosService } from './service/pagar-debitos.service';
import { NaoInformadoPipe } from "./utils/NaoInformadoPipe";
import { VistoriaComponent } from './vistoria/vistoria.component';
import { LazyWrapperComponent } from './shared/lazy-wrapper/lazy-wrapper.component';
import { CardsServicosComponent } from './components/cards-servicos/cards-servicos.component';
import { ModalTermosUsoComponent } from './components/modal-termos-uso/modal-termos-uso.component';

export function jwtTokenGetter() {
  return "";
}

registerLocaleData(localePT);

@NgModule({
  declarations: [
    AppComponent,
    ProcessoCompraComponent,
    FormaPagamentoComponent,
    CreditoComponent,
    BoletoComponent,
    PixComponent,
    DebitoComponent,
    ComprarConsultaComponent,
    ComprarConsultaMultiplaComponent,
    LoginComponent,
    StepByStepComponent,
    StepBarComponent,
    StepComponent,
    CkInputComponent,
    CkSelectComponent,
    NavbarComponent,
    FooterComponent,
    SelecionarVeiculoComponent,
    CadastrarComponent,
    CadastrarPessoaFisicaComponent,
    CadastrarPessoaJuridicaComponent,
    ConfirmarEmailComponent,
    TabNavComponent,
    InfoCadastroComponent,
    ConsultaComponent,
    DetalhamentoComponent,
    TimelineComponent,
    ChecklistComponent,
    ResumoComponent,
    BarComponent,
    ConsultaInicialComponent,
    StatusPagamentoComponent,
    DadosNacionaisComponent,
    DadosProprietariosComponent,
    DadosDecodificacaoChassiComponent,
    DadosEstaduaisComponent,
    DadosDpvatComponent,
    DadosGravamesComponent,
    DadosFipeComponent,
    DadosDuplicidadeMotorComponent,
    DadosRecallComponent,
    DadosIndicioSinistroComponent,
    CkProgressBarComponent,
    DadosLeilaoComponent,
    DadosMotorComponent,
    DadosDesvalorizacaoComponent,
    CkChartComponent,
    CheckItemComponent,
    CkCounterComponent,
    ProcessoCompraMultiplasConsultasComponent,
    CkTagComponent,
    LoginViewComponent,
    DadosContaComponent,
    HistoricoConsultaComponent,
    HistoricoCardComponent,
    NavbarDropdownComponent,
    NavbarSubComponent,
    CompletarCadastroComponent,
    ConsultaMsgComponent,
    RealizarConsultasComponent,
    LoginUserCardComponent,
    ConfirmacaoPagamentoComponent,
    RecuperarSenhaComponent,
    CkModalComponent,
    CkLoadingComponent,
    ObservacoesComponent,
    FeedbackComponent,
    CkModalMsgComponent,
    DadosPrecoMedioComponent,
    CadastrarAcessoComponent,
    CadastrarDadosUsuarioComponent,
    DadosBlocoDetranComponent,
    DadosBlocoDenatranComponent,
    DadosBlocoMultaComponent,
    DadosRemarketingComponent,
    ConsultasDisponiveisComponent,
    DadosPrecoMercadoFinanceiroComponent,
    ItemVeiculoComponent,
    ItemTagComponent,
    DadosBlocoRoboDenatranComponent,
    DadosConsultaDenatranComponent,
    DadosParecerTecnicoComponent,
    DadosBlocoHistoricoRouboFurtoComponent,
    DadosDivergenciaMotorComponent,
    NaoInformadoPipe,
    BannerVistoriaComponent,
    VistoriaComponent,
    StepByStepSmComponent,
    FormLaudoComponent,
    FormLaudoAdicionalComponent,
    DisplayProdutoPagamentoComponent,
    SideMenubarComponent,
    HomeViewComponent,
    DestaqueComponent,
    ProdutosComponent,
    SobreComponent,
    ComoFuncionaComponent,
    BlogComponent,
    AppearOnScrollDirective,
    AppearRightOnScrollDirective,
    OnlyLettersDirective,
    OnlyNumbersDirective,
    ConsultaPlacaVeiculoComponent,
    CompararProdutoComponent,
    ConsultaVeicularCompletaComponent,
    ConsultaVeicularSeguraComponent,
    ConsultaVeicularLeilaoComponent,
    ContatoComponent,
    DuvidasFrequentesComponent,
    BlogViewComponent,
    PostViewComponent,
    ConsultaCompanyComponent,
    TipoProdutoConsultasComponent,
    TipoProdutoPacotesComponent,
    PoliticaDePrivacidadeComponent,
    DepoimentosComponent,
    ExemploConsultaCompletaComponent,
    ExemploConsultaSeguraComponent,
    ExemploConsultaLeilaoComponent,
    ServicosComponent,
    AplicativoComponent,
    SeguraltaComponent,
    DestaqueServicosComponent,
    FloatingChatComponent,
    LazyWrapperComponent,
    PagarDebitosComponent,
    CardServicosComponent,
    CardsServicosComponent,
    ModalTermosUsoComponent
  ],
  imports: [
    InfiniteScrollModule,
    BrowserModule,
    CodeInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    TextMaskModule,
    InlineSVGModule.forRoot({ baseUrl: "/assets/images/svg/" }),
    JwtModule.forRoot({ config: { tokenGetter: jwtTokenGetter } }),
    PaginationModule.forRoot(),
    ModalModule.forRoot(),
    CardModule,
  ],
  entryComponents: [
    BlogComponent,
    SobreComponent,
    ComoFuncionaComponent,
    DuvidasFrequentesComponent,
    DepoimentosComponent,
  ],
  providers: [
    ModalService,
    CepService,
    FormBuilder,
    PessoaService,
    VariableGlobal,
    PagSeguroService,
    PagamentoService,
    ErrorHandlerService,
    JwtHelper,
    FazerConsultaService,
    LoginService,
    TokenService,
    dadosConsultaService,
    PagarDebitosService,
    { provide: LOCALE_ID, useValue: "pt" },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
