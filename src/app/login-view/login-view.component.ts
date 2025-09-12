import { CkModalComponent } from "../components/ck-modal/ck-modal.component";
import { LoginComponent } from "../components/login/login.component";
import { CadastrarComponent } from "../components/cadastrar/cadastrar.component";
import { ConfirmarEmailComponent } from "../components/confirmar-email/confirmar-email.component";
import { Component, OnInit, ViewChild, AfterViewInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PessoaService } from "../service/pessoa.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LoginService } from "../service/login.service";
import { UntypedFormGroup } from "@angular/forms";
import { ModalService } from "../service/modal.service";
import { AnalyticsService } from "../service/analytics.service";
import { NavigationService } from "../service/navigation.service";
import { TokenService } from "../service/token.service";

@Component({
  selector: "login-view",
  templateUrl: "./login-view.component.html",
  styleUrls: ["./login-view.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    CadastrarComponent,
    CkModalComponent,
    ConfirmarEmailComponent,
  ],
})
export class LoginViewComponent implements OnInit, AfterViewInit {
  @ViewChild(CkModalComponent) ckModal: CkModalComponent;

  private navigationService = inject(NavigationService);

  cadastrar = false;
  cadastrarRestoFB = false;

  emailVerificado: boolean | undefined = undefined;

  dadosLogIn: any;

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
    tokenFacebook: "",

    dataNascimento: "",
    telefone: "",
    clienteTipoIndefinido: "N",
    form: new UntypedFormGroup({}),
  };

  emailMarketing: any = {
    acao: "",
  };

  logInSubscriber = null;
  returnUrl: any;

  token: any;
  user: any;

  constructor(
    private modalService: ModalService,
    private loginService: LoginService,
    private pessoaService: PessoaService,
    private route: ActivatedRoute,
    private router: Router,
    private analyticsService: AnalyticsService,
    private tokenService: TokenService
  ) {
    this.logInSubscriber = this.loginService.getLogIn().subscribe((v) => {
      this.dadosLogIn = v;

      if (v.status == true) {
        // Usar o serviço centralizado para redirecionamento
        this.navigationService.navigateAfterLogin();
      }
      /*else if (v.status == true && v.cliente.documento == '') {


         this.cadastrar = true;

         this.cadastrarUsuario.email = this.dadosLogIn.email;
         this.cadastrarUsuario.nome = this.dadosLogIn.nome;
         this.cadastrarUsuario.cep = this.dadosLogIn.endereco.cep;
         this.cadastrarUsuario.endereco = this.dadosLogIn.endereco.endereco;
         this.cadastrarUsuario.cidade = this.dadosLogIn.endereco.cidade;
         this.cadastrarUsuario.uf = this.dadosLogIn.endereco.endereco;
         this.cadastrarUsuario.bairro = this.dadosLogIn.endereco.bairro;
         this.cadastrarUsuario.numero = this.dadosLogIn.endereco.numero;
         this.cadastrarUsuario.tokenFacebook = this.dadosLogIn.tokenFacebook != null ? this.dadosLogIn.tokenFacebook : '';

       }*/
    });

    this.route.params.subscribe((params) => {
      if (params.logout == "out") {
        this.navigationService.logout();
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params["returnUrl"];
      this.cadastrar = params["cadastro"];
      
      if (this.returnUrl) {
        this.navigationService.setRedirectUrl(this.returnUrl);
      }
    });
  }

  ngAfterViewInit() {
    //this.modalService.open('modalAvisoLogin');
  }

  closeModal() {
    this.modalService.close("modalAvisoLogin");
  }
  abrirModal() {
    this.modalService.open("modalAvisoLogin");
  }

  ngOnDestroy() {
    this.logInSubscriber.unsubscribe();
  }
  /*
    next() {
      if (this.cadastrar == true) {
        console.log(this.cadastrarUsuario);

        this.pessoaService.adicionar(this.cadastrarUsuario)
          .subscribe(
            users => {
              if (users.status == 200) {
                //localStorage.setItem('tokenLogin', users._body);
                //  this.usuario.logado = this.temToken();

                this.loginService.logIn(users._body);
              }
            },
            error => {
              console.log("erro", error)
            }
          );
      }

    }*/

  efetuarCadastro() {
    for (var i in this.cadastrarUsuario.form["controls"]) {
      this.cadastrarUsuario.form["controls"][i].markAsTouched();
    }

    //console.log(this.cadastrarUsuario);
    //console.log("É valido =",this.cadastrarUsuario.form['valid'])
    if (this.cadastrarUsuario.form["invalid"]) {
      return;
    }

    this.cadastrarUsuario.clienteTipoIndefinido = "N";
    let cadastro = { ...this.cadastrarUsuario };
    delete cadastro.form;
    //console.log(cadastro);
    this.modalService.openLoading({
      title: "Aguarde...",
      msg: "Estamos verificando os seus dados.",
    });
    if (this.cadastrarUsuario.tokenFacebook != "")
      this.pessoaService
        .atualizar(cadastro)
        .then((response) => {
          this.modalService.closeLoading();
          this.analyticsService.novoCadastroFb();
          //this.modalService.rdstationEvento(cadastro.email, "CADASTRO").then(value => { });
          this.modalService.openModalMsg({
            status: "0",
            title: "Cadastro Efetuado com sucesso!",
            text: "Seus dados foram salvos com sucesso. Clique em ontinuar para acessar sua conta.",
            ok: {
              text: "Continuar",
              event: () => {
                this.loginService.logIn(response);
              },
            },
            cancel: { show: false },
          });
        })
        .catch((e) => {
          this.modalService.closeLoading();
          console.log(e);
        });
    else
      this.pessoaService
        .adicionar(cadastro)
        .then((response) => {
          console.log(response);
          this.modalService.closeLoading();
          if (response == "erro_email") {
            this.cadastrarUsuario.form["controls"]["email"].setErrors({
              msg: "E-mail já cadastrado",
            });
            return;
          }

          this.analyticsService.novoCadastro();

          this.token = response;
          this.user = this.tokenService.decodeTokenFromString(this.token);
          this.emailVerificado = this.user.emailVerificado;
          if (this.emailVerificado) {
            this.modalService.openModalMsg({
              status: "0",
              title: "Cadastro Efetuado com sucesso!",
              text: "Seus dados foram salvos corretamente. Clique em continuar para acessar sua conta.",
              ok: {
                text: "Continuar",
                event: () => {
                  this.loginService.logIn(response);
                },
              },
              cancel: { show: false },
            });
          }
        })
        .catch((e) => {
          this.modalService.closeLoading();
          this.modalService.openModalMsg({
            title: "Erro ao efetuar transação",
            text: "Ocorreu um erro inesperado ao efetuar LogIn, tente novamente mais tarde, caso o problema persista entre em contato com o suporte.",
            cancel: { show: false },
          });
          console.error(e);
        });
  }

  cadastrarChange() {
    this.cadastrar = !this.cadastrar;
  }
  /*
    atualizouCad() {
      //  this.router.navigate(['/consulta/']);
      this.next();
      //  this.usuario.logado = this.temToken();
    }*/

  onLoginSuccess(loginData: any) {
    console.log("LoginView - Dados do login recebidos:", loginData);
    
    if (loginData && typeof loginData === 'object' && loginData.user) {
      // Caso: email não verificado - dados completos são passados
      this.user = loginData.user;
      this.token = loginData.token;
      this.emailVerificado = loginData.emailVerificado;
      
      console.log("LoginView - Email verificado:", this.emailVerificado);
      
      if (!this.emailVerificado) {
        console.log("LoginView - Exibindo modal de confirmação de email");
      } else {
        // Email verificado - fazer login e redirecionar
        this.loginService.logIn(this.token);
      }
    } else {
      // Caso: email verificado - apenas evento simples é emitido
      console.log("LoginView - Login com email verificado, redirecionamento será feito pelo LoginComponent");
    }
  }

  onEmailConfirmado(confirmacaoData: {user: any, token: any}) {
    // Salvar o token no serviço de login
    this.loginService.logIn(confirmacaoData.token);
    
    // O redirecionamento será feito automaticamente pelo logInSubscriber
  }

  loginFbChange() {
    // var token;
    // var dadosObj;
    // if(localStorage.getItem("tokenLogin")){
    //   token = this.tokenService.decodeToken("tokenLogin");
    //   dadosObj = JSON.parse(token);
    // }
    // console.log(dadosObj.cliente.documento);
    // if(this.dadosLogIn.status!= false && this.dadosLogIn.cliente.documento=="") {
    //   this.cadastrarRestoFB = true;
    //  } else {
    //    this.next();
    // this.usuario.logado = this.temToken();
    //  }
  }
}
