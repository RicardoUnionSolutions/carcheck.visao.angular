import { CkModalComponent } from './../components/ck-modal/ck-modal.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PessoaService } from '../service/pessoa.service';
import { TokenService } from '../service/token.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../service/login.service';
import { FormGroup } from '@angular/forms';
import { VariableGlobal } from '../service/variable.global.service';
import { ModalService } from '../service/modal.service';
import { AnalyticsService } from '../service/analytics.service';
import { throws } from 'assert';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent implements OnInit, AfterViewInit {

  @ViewChild(CkModalComponent) ckModal: CkModalComponent;

  cadastrar = false;
  cadastrarRestoFB = false;

  emailVerificado;

  dadosLogIn: any;

  cadastrarUsuario = {
    /* pj */
    razaoSocial: '',
    cnpj: '',
    /* pf */
    nome: '',
    cpf: '',
    /* pj/pf */
    email: '',
    senha: '',
    cep: '',
    numero: '',
    endereco: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    tipoPessoa: '0',
    tokenFacebook: '',

    dataNascimento: '',
    telefone: '',
    clienteTipoIndefinido: 'N',

    form: FormGroup
  }

  emailMarketing: any = {
    acao: ''
  }

  logInSubscriber = null;
  returnUrl: any;

  jwtHelper = new JwtHelperService();
  token: any;
  user: any

  termosUsoAceito: boolean = false;
  alertTermosUso: boolean = false;
  mostrarModalTermos: boolean = false;

  constructor(private modalService: ModalService, private loginService: LoginService, private pessoaService: PessoaService, private route: ActivatedRoute, private router: Router, private analyticsService: AnalyticsService) {


    this.logInSubscriber = this.loginService.getLogIn().subscribe(
      v => {
        //console.log(v);
        this.dadosLogIn = v;
        if (v.status == true && !this.returnUrl) {
          this.router.navigate(['/']);

        } else if (v.status == true && this.returnUrl) {
          const state = history.state.pacote ? { pacote: history.state.pacote } : {};

          this.router.navigate([this.returnUrl], { state: state });
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
      }
    );

    this.route.params.subscribe(params => {
      if (params.logout == 'out') {
        this.loginService.logOut();
        this.router.navigate(['/login']);
      }
    });

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'];
      this.cadastrar = params['cadastro'];
    });
  }

  ngAfterViewInit() {
    //this.modalService.open('modalAvisoLogin');
  }

  closeModal() {
    this.modalService.close('modalAvisoLogin');
  }
  abrirModal() {
    this.modalService.open('modalAvisoLogin');
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
    if (!this.termosUsoAceito) {
      this.alertTermosUso = true;
      return;
    }

    for (var i in this.cadastrarUsuario.form['controls']) {
      this.cadastrarUsuario.form['controls'][i].markAsTouched();
    }

    //console.log(this.cadastrarUsuario);
    //console.log("É valido =",this.cadastrarUsuario.form['valid'])
    if (this.cadastrarUsuario.form['invalid']) {
      return;
    }

    this.cadastrarUsuario.clienteTipoIndefinido = 'N';
    let cadastro = { ...this.cadastrarUsuario };
    delete cadastro.form;
    //console.log(cadastro);
    this.modalService.openLoading({ title: 'Aguarde...', msg: 'Estamos verificando os seus dados.' });
    if (this.cadastrarUsuario.tokenFacebook != '')
      this.pessoaService.atualizar(cadastro)
        .then(response => {
          this.modalService.closeLoading();
          this.analyticsService.novoCadastroFb();
          //this.modalService.rdstationEvento(cadastro.email, "CADASTRO").then(value => { });
          this.modalService.openModalMsg({
            status: '0', title: 'Cadastro Efetuado com sucesso!',
            text: 'Seus dados foram salvos com sucesso. Clique em ontinuar para aessar sua conta.',
            ok: {
              text: 'Continuar', event: () => {
                this.loginService.logIn(response);
              }
            },
            cancel: { show: false }
          });
        })
        .catch((e) => {
          this.modalService.closeLoading();
          console.log(e);
        });
    else
      this.pessoaService.adicionar(cadastro).then((response) => {
        console.log(response);
        this.modalService.closeLoading();
        if (response == 'erro_email') {
          this.cadastrarUsuario.form['controls']['email'].setErrors({ msg: 'E-mail já cadastrado' });
          return;
        }

        this.analyticsService.novoCadastro();

        this.token = response;
        this.user = this.jwtHelper.decodeToken(this.token).iss;
        this.user = JSON.parse(this.user);
        this.emailVerificado = this.user.emailVerificado;
        if (this.emailVerificado) {
          this.modalService.openModalMsg({
            status: '0', title: 'Cadastro Efetuado com sucesso!',
            text: 'Seus dados foram salvos corretamente. Clique em continuar para aessar sua conta.',
            ok: {
              text: 'Continuar', event: () => {
                this.loginService.logIn(response);
              }
            },
            cancel: { show: false }
          });
        }


      })
        .catch(e => {
          this.modalService.closeLoading();
          this.modalService.openModalMsg({ title: 'Erro ao efetuar transação', text: 'Ocorreu um erro inesperado ao efetuar LogIn, tente novamente mais tarde, caso o problema persista entre em contato com o suporte.', cancel: { show: false } });
          throws(e);
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

  openModalTermosUso() {
    this.mostrarModalTermos = true;
  }

  onFecharModalTermos(check) {
    if (check) {
      this.termosUsoAceito = true;
      this.alertTermosUso = false;
    }
    this.mostrarModalTermos = false;
  }
}
