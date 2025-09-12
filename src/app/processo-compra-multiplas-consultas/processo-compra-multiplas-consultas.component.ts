import { CkModalComponent } from "../components/ck-modal/ck-modal.component";
import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StepByStepComponent } from "../components/step-by-step/step-by-step.component";
import { ComprarConsultaMultiplaComponent } from "../components/comprar-consulta-multipla/comprar-consulta-multipla.component";
import { CadastrarDadosUsuarioComponent } from "../components/cadastrar/cadastrar-dados-usuario/cadastrar-dados-usuario.component";
import { DisplayProdutoPagamentoComponent } from "../components/display-produto-pagamento/display-produto-pagamento.component";
import { ProdutosComponent } from "../home-view/produtos/produtos.component";
import { PagSeguroService } from "../service/pagseguro.service";
import { PagamentoService } from "../service/pagamento.service";
import { Router } from "@angular/router";
import { AnalyticsService } from "../service/analytics.service";
import { PessoaService } from "../service/pessoa.service";
import { LoginService } from "../service/login.service";
import { ModalService } from "../service/modal.service";
import { FormGroup } from "@angular/forms";
import { VariableGlobal } from "../service/variable.global.service";
import { dadosConsultaService } from "../service/dados-consulta.service";
import { take } from "rxjs/operators";
import { FormaPagamentoComponent } from "../components/forma-pagamento/forma-pagamento.component";
import { Title, Meta } from "@angular/platform-browser";

@Component({
    selector: "processo-compra-multiplas-consultas",
    templateUrl: "./processo-compra-multiplas-consultas.component.html",
    styleUrls: ["./processo-compra-multiplas-consultas.component.scss"],
    standalone: true,
    imports: [
      CommonModule,
      StepByStepComponent,
      ComprarConsultaMultiplaComponent,
      CadastrarDadosUsuarioComponent,
      FormaPagamentoComponent,
      DisplayProdutoPagamentoComponent,
      ProdutosComponent,
      CkModalComponent
    ]
})
export class ProcessoCompraMultiplasConsultasComponent implements OnInit {
  @ViewChild(FormaPagamentoComponent) formaPagamento: FormaPagamentoComponent;
  @ViewChild(CkModalComponent) ckModal: CkModalComponent;

  scrollToPacotes() {
    const element = document.getElementsByTagName("tipo-produto-pacotes");
    element[0].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  detalhesCompra: String = "";

  valorTotal: any = 0;
  valorTotalDesconto: 0;

  codigoDesconto: any = "";
  valorToltalOriginal: any = 0.0;
  primeiraAplicacao: boolean = true;

  loadingCompra: any = false;

  steps: any;
  currentStep: number = 0;
  doneSteps: number = 0;
  stepIndex: any = {
    consulta: 0,
    completarCadastro: 1,
    pagamento: 2,
  };
  msg: any = "";
  cadastrarUsuario = {
    /* pj */
    razaoSocial: "",
    cnpj: "",
    /* pf */
    nome: "",
    cpf: "",
    /* pj/pf */
    email: "",
    senha: "",
    cep: "",
    numero: "",
    endereco: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    tipoPessoa: "0",
    telefone: "",
    tokenFacebook: "",
    clienteTipoIndefinido: "N",
    formAcesso: FormGroup,
    formCadastro: FormGroup,
  };

  dadosVeiculo: any = {
    anoFabricacao: "",
    anoModelo: "",
    modelo: "",
    placa: "",
    chassi: "",
    corVeiculo: "",
  };
  laudo = {
    chassi: "",
    placa: "",
    proprietario: "",
    telefone: "",
    uf: "",
    cidade: "",
  };

  emailMarketing: any = {
    acao: "",
  };

  usuario: any;

  consultas: any;

  listaPagamento: any;

  urlSite: String = "";
  possuiCompraAprovada = false;

  pacote: any;

  constructor(
    private varGlobal: VariableGlobal,
    private modalService: ModalService,
    public pagSeguro: PagSeguroService,
    private analyticsService: AnalyticsService,
    private pagamentoService: PagamentoService,
    private router: Router,
    private pessoaService: PessoaService,
    private loginService: LoginService,
    private dadosConsultaService: dadosConsultaService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.pacote = history.state.pacote;
    console.log(this.pacote);

    this.urlSite = this.varGlobal.getUrlSite().home;

    this.consultas = [
      {
        composta: { id: 3 },
        label: "Completa",
        icon: "completa.png",
        valorConsulta: 54.90,
        valorReais: "",
        valorCentavos: "",
        quantidade: 0,
        link: this.urlSite + "/produto/consulta-veicular-completa/",
        desc: `Informe a placa ou chassi para conferir o histórico veicular completo do
        seminovo. Confira todos os dados disponibilizados pela
        <a target='_blank' class='text-orange-1 fw-500' href='${this.urlSite}/produto/consulta-veicular-completa/'>consulta completa.</a>`,
      },
      {
        composta: { id: 5 },
        label: "Segura",
        icon: "segura.png",
        valorConsulta: 48.90,
        valorReais: "",
        valorCentavos: "",
        quantidade: 0,
        link: this.urlSite + "/produto/consulta-veicular-segura/",
        desc: `Conheça todas as verificações de restrição do seminovo disponíveis no sistema.
                Confira os dados informados pela
                <a target='_blank' class='text-orange-1 fw-500' href='${this.urlSite}/produto/consulta-veicular-segura/'> consulta segura.</a>`,
      },
      {
        composta: { id: 2 },
        label: "Leilão",
        icon: "leilao.png",
        valorConsulta: 32.90,
        valorReais: "",
        valorCentavos: "",
        quantidade: 0,
        link: this.urlSite + "/produto/consulta-veicular-leilão/",
        desc: `Garanta um preço justo na compra do seminovo, sabendo se o modelo já passou por um leilão ou não pela
        <a target='_blank' class='text-orange-1 fw-500' href='${this.urlSite}/produto/consulta-veicular-leilão/'> consulta leilão.</a> `,
      },
    ];

    if (this.pacote) {
      this.consultas.forEach((consulta, index) => {
        if (consulta.composta.id == this.pacote.composta_id) {
          this.consultas[index].quantidade = this.pacote.quantidade_composta;
          this.valorTotal = this.pacote.valor_atual;
          this.valorTotalDesconto = this.pacote.valor_promocional;
        }
      });
      this.currentStep = this.stepIndex.completarCadastro;
    }

    this.loginService.getLogIn().subscribe((v) => {
      this.usuario = v;
    });

    if (this.usuario.cliente.tipoPessoa == "JURIDICA") {
      this.cadastrarUsuario.tipoPessoa = "1";
    } else {
      this.cadastrarUsuario.tipoPessoa = "0";
    }

    this.loginService
      .getLogIn()
      .pipe(take(1))
      .subscribe((v) => {
        //console.log('**************************************************************v.statusCadastro',v.statusCadastro )
        if (v.statusCadastro == "INCOMPLETO") {
          this.stepIndex = {
            consulta: 0,
            completarCadastro: 1,
            pagamento: 2,
          };

          this.steps = [
            { title: "Consulta", image: "./assets/images/checklist.png" },
            { title: "Cadastro", image: "./assets/images/usuario.png" },
            { title: "Pagamento", image: "./assets/images/dinheiro.png" },
          ];
        } else {
          this.stepIndex = {
            consulta: 0,
            completarCadastro: 99,
            pagamento: 1,
          };

          this.steps = [
            { title: "Consulta", image: "./assets/images/checklist.png" },
            { title: "Pagamento", image: "./assets/images/dinheiro.png" },
          ];
        }
      });
  }

  ngOnInit() {
    this.titleService.setTitle(
      "Comprar Pacotes de Consultas Veiculares - CarCheck"
    );
    this.metaService.updateTag({
      name: "description",
      content:
        "Compre pacotes de consultas veiculares completas, seguras ou de leilão com facilidade e segurança. Ideal para quem precisa analisar múltiplos veículos.",
    });
  }

  closeModal() {
    this.modalService.close("modalAvisoCompraMultipla");
  }
  abrirModal() {
    this.modalService.open("modalAvisoCompraMultipla");
  }

  back() {
    if (this.currentStep > 0) this.currentStep--;
  }

  calcularValorTotal() {
    if (!this.pacote) {
      this.valorTotal = this.consultas.reduce((a, b) => a + b.valorConsulta, 0);
      if (!this.valorTotalDesconto) {
        this.valorTotalDesconto = this.valorTotal;
      }
    }
  }

  valorCentavos(preco) {
    let vr = parseFloat(preco).toFixed(2).split(".");
    return vr[1];
  }

  valorReais(preco) {
    let vr = parseFloat(preco).toFixed(2).split(".");
    return vr[0];
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.doneSteps =
        this.currentStep > this.doneSteps ? this.currentStep : this.doneSteps;
      this.msg = "";
    }
  }

  next() {
    switch (this.currentStep) {
      case this.stepIndex.consulta:
        this.nextStep();
        this.analyticsService.addToCartCredito(
          this.consultas.filter((c) => c.quantidade > 0)
        );

        break;

      case this.stepIndex.completarCadastro:
        this.stepCompletarCadastroEvent();

        break;

      case this.stepIndex.pagamento:
        this.stepPagamentoEvent();

        break;
    }
  }

  onChangeStep() {
    this.calcularValorTotal();
  }

  stepPagamentoEvent() {
    let pagamento;
    try {
      pagamento = this.formaPagamento.getPagamento();
    } catch (error) {
      console.log(error);
      this.msg = "error";
      this.loadingCompra = false;
      return;
    }
    let consultasSelecionadas = this.consultas.filter((c) => c.quantidade > 0);
    let pacoteSelecionado = this.pacote || null;
    let dadosProprietario = {
      nomeProprietario: this.laudo.proprietario,
      telefone: this.laudo.telefone,
      uf: this.laudo.uf,
      cidade: this.laudo.cidade,
    };
    let objPagamento = {
      dadosProprietario: dadosProprietario,
      consultasSelecionadas: consultasSelecionadas,
      pacote: pacoteSelecionado,
      pagamento: pagamento,
      dadosVeiculo: this.dadosVeiculo,
    };
    this.analyticsService.registroEntrandoPagamento();

    this.modalService.openModalMsg({
      status: 1,
      title: "Confirmação de compra",
      text: "Tem certeza que deseja realizar a compra para as consultas selecionadas?",
      ok: {
        event: () => {
          this.loadingCompra = true;
          this.pagamentoService
            .pagar(objPagamento)
            .then((rs) => {
              this.loadingCompra = false;
              switch (rs.situacaoPagamento) {
                case "AGUARDANDO_LIBERACAO":
                case "APROVADO":
                  this.pagamentoService.setUltimaCompra(
                    rs,
                    consultasSelecionadas,
                    "multipla"
                  );
                  this.router.navigate(["confirmacao-pagamento"]);
                  break;

                case "CANCELADO":
                  if (rs.transacao) {
                    this.pagamentoService.setUltimaCompra(
                      rs,
                      consultasSelecionadas,
                      "multipla"
                    );
                    this.router.navigate(["confirmacao-pagamento"]);
                  }
                  this.msg = "error";
                  break;

                default:
                  console.log("ERRO AO EFETUAR PAGAMENTO", rs);
                  break;
              }
            })
            .catch((e) => {
              console.log("erro ao efetuar pagaento", e);
              this.msg = "error";
              this.loadingCompra = false;
            });
        },
      },
    });
  }

  formataMesagemErro(erro: string) {
    let lErro = [];
    if (
      erro != null &&
      erro != undefined &&
      erro.replace(" ", "") != "" &&
      erro.length > 0
    ) {
      let lista = JSON.parse(erro);
      for (let err of lista) {
        lErro.push(err["message"]);
      }
    } else {
      lErro.push(
        "Ocorreu um erro no processamento do pagamento, verifique que seus dados estão corretos"
      );
    }
    return lErro;
  }

  stepCompletarCadastroEvent() {
    for (let i in this.cadastrarUsuario.formCadastro["controls"]) {
      this.cadastrarUsuario.formCadastro["controls"][i].markAsTouched();
    }

    if (this.cadastrarUsuario.formCadastro["invalid"]) return;

    // Apenas avança para a próxima etapa sem efetuar transação
    this.nextStep();
  }

  verificaCompraAprovada() {
    this.dadosConsultaService.getPossuiCompraAprovada().subscribe(
      (data: any) => {
        if (data == true) {
          this.stepIndex = {
            consulta: 0,
            completarCadastro: 99,
            pagamento: 1,
          };

          this.steps = [
            { title: "Consulta", image: "./assets/images/checklist.png" },
            { title: "Pagamento", image: "./assets/images/dinheiro.png" },
          ];
        }
      },
      (error) => {
        console.log("erro", error);
      }
    );
  }
}
