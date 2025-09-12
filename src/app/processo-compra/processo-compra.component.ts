import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UntypedFormGroup } from "@angular/forms";
import { take } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { FormaPagamentoComponent } from "../components/forma-pagamento/forma-pagamento.component";
import { AnalyticsService } from "../service/analytics.service";
import { dadosConsultaService } from "../service/dados-consulta.service";
import { FazerConsultaService } from "../service/fazer-consulta.service";
import { LoginService } from "../service/login.service";
import { ModalService } from "../service/modal.service";
import { PagamentoService } from "../service/pagamento.service";
import { PessoaService } from "../service/pessoa.service";
import { CkModalComponent } from "../components/ck-modal/ck-modal.component";
import { StepByStepComponent } from "../components/step-by-step/step-by-step.component";
import { ComprarConsultaComponent } from "../components/comprar-consulta/comprar-consulta.component";
import { SelecionarVeiculoComponent } from "../components/selecionar-veiculo/selecionar-veiculo.component";
import { CadastrarAcessoComponent } from "../components/cadastrar/cadastrar-acesso/cadastrar-acesso.component";
import { CadastrarDadosUsuarioComponent } from "../components/cadastrar/cadastrar-dados-usuario/cadastrar-dados-usuario.component";
import { LoginUserCardComponent } from "../components/login-user-card/login-user-card.component";
import { DisplayProdutoPagamentoComponent } from "../components/display-produto-pagamento/display-produto-pagamento.component";
import { FormLaudoComponent } from "../components/form-laudo/form-laudo.component";
import { FormLaudoAdicionalComponent } from "../components/form-laudo-adicional/form-laudo-adicional.component";
import { Title, Meta } from "@angular/platform-browser";

@Component({
    selector: "app-processo-compra",
    templateUrl: "./processo-compra.component.html",
    styleUrls: ["./processo-compra.component.scss"],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    standalone: true,
    imports: [
      CommonModule,
      RouterModule,
      FormsModule,
      ReactiveFormsModule,
      // Components used in template
      StepByStepComponent,
      ComprarConsultaComponent,
      SelecionarVeiculoComponent,
      CadastrarAcessoComponent,
      CadastrarDadosUsuarioComponent,
      LoginUserCardComponent,
      FormaPagamentoComponent,
      DisplayProdutoPagamentoComponent,
      FormLaudoComponent,
      FormLaudoAdicionalComponent,
      CkModalComponent
    ]
})
export class ProcessoCompraComponent implements OnInit, AfterViewInit {
  @ViewChild(FormaPagamentoComponent) formaPagamento: FormaPagamentoComponent;

  @ViewChild(CkModalComponent) ckModal: CkModalComponent;

  possuiLaudo = false;
  detalhesCompra: String = "";
  loadingCompra: boolean = false;
  steps: any;
  currentStep: number = 0;
  doneSteps: number = 0;
  stepIndex: any = { consulta: 0, veiculo: 1, cadastro: 2, pagamento: 3 };
  laudo = {
    chassi: "",
    placa: "",
    proprietario: "",
    telefone: "",
    uf: "",
    cidade: "",
  };
  laudoStatus = "INVALID";

  valorTotalDesconto = 0;
  valorTotal = 0;
  primeiraAplicacao: boolean = true;

  tentativaPagamento: boolean = false;

  ultimoStep = false;

  cadastrar = false;
  logou = false;
  cadastrarRestoFB = false;
  msg = "";

  logIn: any;

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
    clienteTipoIndefinido: "S",
    formAcesso: {} as UntypedFormGroup,
    formCadastro: {} as UntypedFormGroup,
  };

  tipoPesquisa: string = "placa";
  pesquisaPlaca: string = "";
  pesquisaEmail: string = "";
  pesquisaChassi: string = "";

  dadosVeiculo: any = {
    anoFabricacao: "",
    anoModelo: "",
    modelo: "",
    placa: "",
    chassi: "",
    corVeiculo: "",
  };

  emailMarketing: any = {
    acao: "",
  };

  listaConsultaPrincipal = [];
  listaConsultaNormal = [];
  listaConsulta = [];
  opcoesConsultas = [];
  //consultaSelecionada:any;

  //parte nova
  consultasSelecionadas = [];

  possuiCompraAprovada = false;
  laudoAdicional: boolean;
  consultaLaudo: any;

  constructor(
    private modalService: ModalService,
    private route: ActivatedRoute,
    private pessoaService: PessoaService,
    private fazerConsultaService: FazerConsultaService,
    private analyticsService: AnalyticsService,
    private pagamentoService: PagamentoService,
    private loginService: LoginService,
    private router: Router,
    private dadosConsultaService: dadosConsultaService,
    private title: Title,
    private meta: Meta
  ) {
    this.loginService.getLogIn().subscribe((v) => {
      this.logIn = v;
      if (
        (v.status == true && v.cliente.documento == "") ||
        v.cliente.documento == "000.000.000-00" ||
        v.cliente.documento == "00.000.000/0000-00"
      ) {
        this.cadastrar = true;
        this.cadastrarRestoFB = true;
        this.logou = true;
        this.cadastrarUsuario.email = this.logIn.email;
        this.cadastrarUsuario.nome = this.logIn.nome;
        this.cadastrarUsuario.cep = this.logIn.endereco.cep;
        this.cadastrarUsuario.endereco = this.logIn.endereco.endereco;
        this.cadastrarUsuario.cidade = this.logIn.endereco.cidade;
        this.cadastrarUsuario.uf = this.logIn.endereco.endereco;
        this.cadastrarUsuario.bairro = this.logIn.endereco.bairro;
        this.cadastrarUsuario.numero = this.logIn.endereco.numero;
        this.cadastrarUsuario.clienteTipoIndefinido =
          this.logIn.cliente.clienteTipoIndefinido;
        this.cadastrarUsuario.tipoPessoa =
          this.logIn.cliente.tipoPessoa == "FISICA" ? "0" : "1";
        this.cadastrarUsuario.tokenFacebook =
          this.logIn.tokenFacebook != null ? this.logIn.tokenFacebook : "";
      }
    });

    this.loginService
      .getLogIn()
      .pipe(take(1))
      .subscribe((v) => {
        if (v.status && v.statusCadastro == "COMPLETO") {
          this.escondeCadastro();
        } else if (v.status && v.statusCadastro == "INCOMPLETO") {
          this.stepIndex = {
            consulta: 0,
            veiculo: 1,
            cadastro: 99,
            completarCadastro: 2,
            pagamento: 3,
          };

          this.steps = [
            { title: "Consulta", image: "./assets/images/checklist.png" },
            { title: "Veículo", image: "./assets/images/carro.png" },
            { title: "Cadastro", image: "./assets/images/usuario.png" },
            { title: "Pagamento", image: "./assets/images/dinheiro.png" },
          ];
        } else if (!v.status) {
          this.stepIndex = {
            consulta: 0,
            veiculo: 1,
            cadastro: 2,
            completarCadastro: 3,
            pagamento: 4,
          };

          this.steps = [
            { title: "Consulta", image: "./assets/images/checklist.png" },
            { title: "Veículo", image: "./assets/images/carro.png" },
            { title: "Acesso", image: "./assets/images/usuario.png" },
            { title: "Cadastro", image: "./assets/images/usuario.png" },
            { title: "Pagamento", image: "./assets/images/dinheiro.png" },
          ];
        }

        // Verificaçao para ver se o primeiro parametro é a consulta, se for a consulta selecionada, passa para o proximo passo
        if (
          this.route.snapshot.paramMap.get("consulta") != null &&
          !this.validaPlaca(this.route.snapshot.paramMap.get("consulta"))
        ) {
          this.nextStep();
        }

        // Verificação se o primeiro parametro é placa
        if (this.validaPlaca(this.route.snapshot.paramMap.get("consulta"))) {
          this.pesquisaPlaca = this.route.snapshot.paramMap
            .get("consulta")
            .toUpperCase()
            .replace("-", "");
        }
      });
    this.carregaOpcoesConsultaUsuario();
  }

  ngOnInit() {
    this.title.setTitle("Processo de Compra - CarCheck");
    this.meta.updateTag({
      name: "description",
      content:
        "Realize sua compra de consulta veicular em etapas simples: escolha, cadastro e pagamento seguro.",
    });
    //  this.verificaCompraAprovada();

    if (this.pesquisaPlaca == "") {
      this.pesquisaPlaca = (
        this.route.snapshot.paramMap.get("placa") || ""
      ).toUpperCase();
    }
    this.pesquisaEmail = (
      this.route.snapshot.paramMap.get("email") || ""
    ).toUpperCase();
  }

  ngAfterViewInit() {
    //this.modalService.open('modalAviso');
  }

  closeModal() {
    this.modalService.close("modalAviso");
  }
  abrirModal() {
    this.modalService.open("modalAviso");
  }

  validaPlaca(placa) {
    var er = /[a-z]{3}-?\d[A-Za-z0-9]\d{2}/gim;
    er.lastIndex = 0;
    return er.test(placa);
  }

  stepVeiculoEvent() {
    if (this.pesquisaChassi == "" && this.pesquisaPlaca == "") {
      this.msg = "danger";
      return;
    }

    if (this.tipoPesquisa == "placa" && this.pesquisaPlaca != "") {
      var ehPlacaValida = this.validaPlaca(this.pesquisaPlaca);
      if (!ehPlacaValida) {
        this.msg = "danger";
        return;
      }
    }

    if (this.tipoPesquisa == "chassi" && this.pesquisaChassi != "") {
      this.fazerConsultaService.consultar(this.pesquisaChassi).subscribe(
        (dados) => {
          if (dados == null) {
            this.dadosVeiculo = { erro: true };
          } else {
            this.dadosVeiculo = dados;
            this.dadosVeiculo.erro = false;
          }
        },
        (error) => {
          console.log("erro", error);
          this.dadosVeiculo = { erro: true };
        }
      );
      this.nextStep();
    }
    if (this.tipoPesquisa == "placa" && this.pesquisaPlaca != "") {
      this.fazerConsultaService.consultar(this.pesquisaPlaca).subscribe(
        (dados) => {
          if (!dados) {
            this.dadosVeiculo = { erro: true };
          } else {
            this.dadosVeiculo = dados;
            this.dadosVeiculo.placa = this.pesquisaPlaca.toUpperCase();
            this.dadosVeiculo.erro = false;
          }
          //console.log(dados);
        },
        (error) => {
          console.log("erro", error);
          this.dadosVeiculo = { erro: true };
        }
      );

      this.nextStep();
    }
  }

  stepCadastroEvent() {
    if (
      this.cadastrar == false &&
      this.logIn.cliente.documento != "000.000.000-00" &&
      this.logIn.cliente.documento != "00.000.000/0000-00"
    ) {
      this.currentStep = 1;
      this.escondeCadastro();
      this.nextStep();
      return;
    }

    if (
      this.logIn.cliente.documento == "000.000.000-00" ||
      this.logIn.cliente.documento == "00.000.000/0000-00"
    ) {
      this.nextStep();
      return;
    }

    for (let i in this.cadastrarUsuario.formAcesso["controls"]) {
      this.cadastrarUsuario.formAcesso["controls"][i].markAsTouched();
    }
    if (this.cadastrarUsuario.formAcesso["valid"]) {
      this.cadastrarUsuario.clienteTipoIndefinido = "S";
      let cadastro = { ...this.cadastrarUsuario };
      delete cadastro.formAcesso;
      if (delete cadastro.formCadastro != null) delete cadastro.formCadastro;

      this.loadingCompra = true;
      this.modalService.openLoading({
        title: "Aguarde...",
        msg: "Estamos verificando os seus dados.",
      });
      this.pessoaService
        .adicionar(cadastro)
        .then((response) => {
          this.loadingCompra = false;
          this.modalService.closeLoading();
          if (response == "erro_email") {
            this.cadastrarUsuario.formAcesso["controls"]["email"].setErrors({
              msg: "E-mail já cadastrado",
            });
            return;
          }
          this.analyticsService.novoCadastro();
          this.modalService.openModalMsg({
            status: "0",
            title: "Cadastro Efetuado com sucesso!",
            text: "Seus dados foram salvos com sucesso.",
            ok: {
              text: "Continuar",
              event: () => {
                this.loginService.logIn(response);
                this.cadastrar = false;
                if (
                  this.logIn.cliente.documento != "000.000.000-00" &&
                  this.logIn.cliente.documento != "00.000.000/0000-00"
                ) {
                  this.currentStep = 1;
                  this.escondeCadastro();
                }
                this.nextStep();
              },
            },
            cancel: { show: false },
          });
        })
        .catch((e) => {
          this.loadingCompra = false;
          this.modalService.closeLoading();
          this.modalService.openModalMsg({
            title: "Erro ao efetuar transação",
            text: "Ocorreu um erro inesperado ao efetuar LogIn, tente novamente mais tarde, caso o problema persista entre em contato com o suporte.",
            cancel: { show: false },
          });
          console.log(e);
        });
    } else {
      return;
    }
  }

  stepPagamentoEvent() {
    let pagamento;
    try {
      pagamento = this.formaPagamento.getPagamento();
    } catch (error) {
      console.log(error);
      return;
    }
    let dadosProprietario = {
      nomeProprietario: this.laudo.proprietario,
      telefone: this.laudo.telefone,
      uf: this.laudo.uf,
      cidade: this.laudo.cidade,
    };
    let objPagamento = {
      dadosVeiculo: this.dadosVeiculo,
      consultasSelecionadas: this.consultasSelecionadas,
      pagamento: pagamento,
      dadosProprietario: dadosProprietario,
    };
    this.analyticsService.registroEntrandoPagamento();

    this.modalService.openModalMsg({
      status: 1,
      title: "Confirmação de compra",
      text:
        "Tem certeza que deseja realizar consulta " +
        this.consultasSelecionadas[0].composta.nome.toLowerCase() +
        " para " +
        (this.tipoPesquisa == "placa"
          ? " a placa " + this.pesquisaPlaca.toLocaleUpperCase()
          : " o chassi " + this.pesquisaChassi.toLocaleUpperCase()) +
        "?",
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
                    this.consultasSelecionadas,
                    "unica"
                  );
                  this.router.navigate(["confirmacao-pagamento"]);
                  break;

                case "CANCELADO":
                  if (rs.transacao) {
                    this.pagamentoService.setUltimaCompra(
                      rs,
                      this.consultasSelecionadas,
                      "unica"
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

  stepCompletarCadastroEvent() {
    for (let i in this.cadastrarUsuario.formCadastro["controls"]) {
      this.cadastrarUsuario.formCadastro["controls"][i].markAsTouched();
    }

    if (this.cadastrarUsuario.formCadastro["invalid"]) return;

    this.cadastrarUsuario.clienteTipoIndefinido = "N";
    let cadastro = { ...this.cadastrarUsuario };
    delete cadastro.formCadastro;
    if (cadastro.formAcesso != null) delete cadastro.formAcesso;

    this.loadingCompra = true;

    this.pessoaService.completarCadastroPagamento(cadastro).subscribe(
      (response) => {
        this.analyticsService.cadastroCompleto();

        this.loginService.logIn(response);
        if (
          this.logIn.cliente.documento != "000.000.000-00" &&
          this.logIn.cliente.documento != "00.000.000/0000-00"
        ) {
          this.currentStep = 1;
          this.escondeCadastro();
        }
        this.nextStep();

        this.loadingCompra = false;
      },
      (error) => {
        this.loadingCompra = false;
        console.log("erro", error);
      }
    );
  }

  next() {
    switch (this.currentStep) {
      case this.stepIndex.consulta:
        this.nextStep();
        break;

      case this.stepIndex.veiculo:
        if (this.possuiLaudo) {
          if (this.laudoStatus == "INVALID") {
            break;
          }
          this.pesquisaPlaca = this.laudo.placa;
          this.tipoPesquisa = "placa";
        }
        const consultaSelecionada = this.consultasSelecionadas[0];
        if (
          consultaSelecionada &&
          consultaSelecionada.composta &&
          consultaSelecionada.composta.nome
        ) {
          this.analyticsService.addToCart(
            consultaSelecionada.composta.nome
          );
        }
        this.stepVeiculoEvent();
        break;

      case this.stepIndex.cadastro:
        this.stepCadastroEvent();
        break;

      case this.stepIndex.completarCadastro:
        this.stepCompletarCadastroEvent();
        break;

      case this.stepIndex.pagamento:
        this.ultimoStep = true;
        this.stepPagamentoEvent();
        break;
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.doneSteps =
        this.currentStep > this.doneSteps ? this.currentStep : this.doneSteps;
      this.msg = "";
    }
  }

  async carregaOpcoesConsultaUsuario() {
    try {
      const param = this.logIn.status ? this.logIn.email : "padrao";
      this.listaConsulta = await this.fazerConsultaService
        .getConsultaCliente(param)
        .toPromise();
      this.selecionarTipoConsulta();
      this.calcularValorTotal();
    } catch (error) {
      console.log("erro ao carregar consultas", error);
    }
  }

  cadastrarChange() {
    this.cadastrar = !this.cadastrar;
  }

  loginChange() {
    this.next();
  }

  loginFbChange() {
    if (!this.cadastrarRestoFB) this.next();
  }

  valorCentavos(preco) {
    let vr = parseFloat(preco).toFixed(2).split(".");
    return vr[1];
  }

  valorReais(preco) {
    let vr = parseFloat(preco).toFixed(2).split(".");
    return vr[0];
  }

  selecionarTipoConsulta() {
    const nomeConsulta = (
      this.route.snapshot.paramMap.get("consulta") || ""
    ).toLowerCase();
    this.listaConsulta.forEach((c) => (c.quantidade = 1));
    let consultaSelecionada = this.listaConsulta.find((c) =>
      c.composta.nome.toLowerCase().includes(nomeConsulta)
    );
    consultaSelecionada =
      consultaSelecionada || this.listaConsulta.find((c) => c.principal);
    consultaSelecionada = consultaSelecionada || this.listaConsulta[0] || null;

    this.consultasSelecionadas = [consultaSelecionada];
    this.consultaLaudo = this.listaConsulta.find(
      (c) => c.composta.tipoProduto == "LAUDO"
    );
    this.possuiLaudo = consultaSelecionada.composta.tipoProduto == "LAUDO";
    const next = (
      this.route.snapshot.queryParamMap.get("next") || ""
    ).toLocaleUpperCase();

    if (next == "CONSULTA") {
      // this.router.navigateByUrl(this.router.url.replace(next, 'VEICULO'));
      this.nextStep();
    }
  }

  escondeCadastro() {
    this.stepIndex = {
      consulta: 0,
      veiculo: 1,
      pagamento: 2,
      cadastro: 99,
      completarCadastro: 99,
    };

    this.steps = [
      { title: "Consulta", image: "./assets/images/checklist.png" },
      { title: "Veículo", image: "./assets/images/carro.png" },
      { title: "Pagamento", image: "./assets/images/dinheiro.png" },
    ];
  }

  verificaCompraAprovada() {
    this.dadosConsultaService.getPossuiCompraAprovada().subscribe(
      (data: any) => {
        if (data == true) {
          this.escondeCadastro();
        }
      },
      (error) => {
        console.log("erro", error);
      }
    );
  }

  selecionarConsultaEvent(e: any[]) {
    this.consultasSelecionadas = e;
    this.possuiLaudo = !!e.find((e) => e.composta.tipoProduto == "LAUDO");
    this.calcularValorTotal();
  }

  calcularValorTotal() {
    this.valorTotal = this.consultasSelecionadas.reduce(
      (a, b) => a + b.valorConsulta,
      0
    );
    if (!this.valorTotalDesconto) {
      this.valorTotalDesconto = this.valorTotal;
    }
  }

  toggleLaudoAdicional($e) {
    this.laudoAdicional = $e;
    if (this.laudoAdicional) {
      this.laudo.placa = this.pesquisaPlaca;
      this.laudo.chassi = this.pesquisaChassi;
      this.consultasSelecionadas = [
        ...this.consultasSelecionadas,
        this.consultaLaudo,
      ];
    } else {
      this.resetLaudo();
      this.consultasSelecionadas = this.consultasSelecionadas.filter(
        (c) => c != this.consultaLaudo
      );
    }
    this.calcularValorTotal();
  }

  resetLaudo() {
    this.laudo = {
      chassi: "",
      placa: "",
      proprietario: "",
      telefone: "",
      uf: "",
      cidade: "",
    };
  }
}
