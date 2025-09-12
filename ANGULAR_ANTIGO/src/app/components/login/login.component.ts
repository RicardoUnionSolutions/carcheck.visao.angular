import { Component, OnInit, Input, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import { PessoaService } from '../../service/pessoa.service';
import { LoginService } from '../../service/login.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ModalService } from '../../service/modal.service';
import { AnalyticsService } from '../../service/analytics.service';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Title, Meta } from '@angular/platform-browser';

declare var FB: any;
declare var window: any;
declare var google: any; 

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() cadastrarBtnClick = new EventEmitter();
  @Output() loginBtnClick = new EventEmitter();
  @Output() loginFbBtnClick = new EventEmitter();
  @Output() loginGoogleBtnClick = new EventEmitter();

  jwtPayLoad: any;
  coisas = null;
  usuario = { logado: false };
  passwordElement = null;
  emailNaoVerificado = false;
  user: any;
  token: any;

  dadosLogIn;

  formMask: any;

  email: AbstractControl;

  @Input() salvo = false;

  @Input() loginEntrada = {
    login: '',
    senha: '',
    manterconectado: false,
    form: null
  };

  @Input() usuarioEntrada = {
    email: '',
    nome: '',
    status: ''
  }

  @Input() clienteEntrada = {
    documento: '',
    salvo: ''
  }

  form: FormGroup;
  jwtHelper = new JwtHelperService();

  constructor(
    private modalService: ModalService,
    private pessoaService: PessoaService,
    private ngZone: NgZone,
    private loginService: LoginService,
    private fb: FormBuilder,
    private analyticsService: AnalyticsService,
    private ref: ChangeDetectorRef,
    private title: Title,
    private meta: Meta
  ) {

    this.loginService.getLogIn().subscribe(v => { this.usuario.logado = v.status; this.dadosLogIn = v; });

    var manterconectado = JSON.parse(localStorage.getItem('manterconectado'));
    if (manterconectado != null) {
      this.loginEntrada.login = manterconectado.login;
      this.loginEntrada.senha = manterconectado.senha;
      this.loginEntrada.manterconectado = manterconectado.manterconectado;
    }

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = () => {

      FB.init({
        appId: '3292598594393987',
        cookie: true,
        xfbml: true,
        version: 'v15.0'
      });
      FB.AppEvents.logPageView();
    };

  };

  ngOnInit() {

    this.title.setTitle('Login - CarCheck');
    this.meta.updateTag({
      name: 'description',
      content: 'Acesse sua conta para visualizar consultas veiculares, histórico de laudos e gerenciar seus dados.'
    });

    this.initGoogleLoginButton();

    this.form = this.fb.group({
      email: [this.loginEntrada.login, [Validators.required, Validators.email]],
      senha: [this.loginEntrada.senha, [Validators.required, Validators.minLength(4)]],
    });

    this.form.controls.senha.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((v: string) => {
        let newValue = v.replace(/\s/g, '')
        this.form.controls.senha.patchValue(newValue);
        this.loginEntrada.senha = newValue;
      });

    this.form.controls.email.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((v: string) => {
        let newValue = v.replace(/\s/g, '')
        this.form.controls.email.patchValue(newValue);
        this.loginEntrada.login = newValue;
      });

  }

  ngOnchanges() {
    if (this.form) {
      this.form.patchValue({
        email: this.loginEntrada.login,
        senha: this.loginEntrada.senha
      });
    }
  }

  cadastrar() {
    this.cadastrarBtnClick.emit();
  }

  initGoogleLoginButton() {
    // Carrega o script do Google One-tap dinamicamente
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    //login com google one-tap
    window.onGoogleLibraryLoad = () => {
      console.log('Google\'s One-tap sign in script loaded!');

      // @ts-ignore
      google.accounts.id.initialize({
        // DOC: https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration
        client_id: '210450991548-6alqffcge601d46pc9b1176gpmhot0ss.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this), // Função de decodificar o token do google
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // renderizar o botão de login do google
      // @ts-ignore
      google.accounts.id.renderButton(
        document.getElementById("googleLogin"),
        { theme: "outline", size: "large" },
      );

      // OPTIONAL: Caso queria fazer redirecionamento e abertura do modal de loading
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {
        console.log('Google prompt event triggered...');

        if (notification.getDismissedReason() === 'credential_returned') {
          this.ngZone.run(() => {
            this.modalService.openLoading({ title: 'Aguarde...', text: 'Efetuando Login!' });
          });
        }
      });

    }; //fim LoginGoogle

    // Adiciona o script ao final do body
    document.body.appendChild(script);
  }

  login() {
    this.emailNaoVerificado = false;
    this.form.controls.email.markAsTouched();
    this.form.controls.senha.markAsTouched();
    //console.log("this.form.invalid",this.form.invalid);
    if (this.form.invalid) return;
    this.modalService.openLoading({ title: 'Aguarde...', text: 'Efetuando Login!' });
    this.pessoaService.logar(this.loginEntrada)
      .subscribe(
        users => {
          if (users == 'erro_email_senha') {
            this.modalService.closeLoading();
            this.form.controls.senha.setErrors({ msg: 'A senha não confere com o e-mail informado.' });
            return;
          }
          this.token = users;
          this.user = this.jwtHelper.decodeToken(this.token).iss;
          this.user = JSON.parse(this.user);
          this.emailNaoVerificado = !this.user.emailVerificado;
          if (this.user.emailVerificado) {
            this.loginService.logIn(users);
            this.loginBtnClick.emit();
            this.modalService.closeLoading();
          }
          this.modalService.closeLoading();
        },
        error => {
          this.modalService.closeLoading();
        }
      );
  }

  loginErro() {
  }

  //decodificar token google e login
  userGoogle;
  handleCredentialResponse(response: CredentialResponse) {
    let decodedToken: any | null = null;
    try {
      decodedToken = JSON.parse(atob(response?.credential.split('.')[1]));
    } catch (e) {
      console.error('Error while trying to decode token', e);
    }
    // console.log('decodedToken', decodedToken);
    this.userGoogle = decodedToken
    console.log(this.userGoogle.name);
    this.modalService.openLoading({ title: 'Aguarde...', text: 'Efetuando Login!' });
    var promise = new Promise((resolve, reject) => {
      this.ngZone.run(() => {
        this.pessoaService.adicionarGoogle(this.userGoogle).subscribe(response => {
          this.analyticsService.novoCadastroGoogle();
          this.loginService.logIn(response);
          this.modalService.closeLoading();
        });
      });
    });
    promise.then(() => {
      this.loginGoogleBtnClick.emit();
    });
  }

  loginFb() {

    var promise = new Promise((resolve, reject) => {
      FB.login((loginResponse) => {
        FB.api('/me?fields=id,name,about,age_range,birthday,email,hometown', (dadosUsuario) => {
          this.ngZone.run(() => {
            this.pessoaService.adicionarFB(dadosUsuario).subscribe(response => {

              if (response == 'erro_email') {
                this.modalService.openModalMsg({
                  status: 2,
                  title: 'Erro ao efetuar login',
                  text: 'E-mail já cadastrado.',
                  cancel: { show: false }, ok: { text: "Fechar" }
                });
                return;
              }
              this.analyticsService.novoCadastroFb();
              this.loginService.logIn(response);
              resolve(null);
            });
          });
        });
      }, { scope: 'email' });
    });

    promise.then(() => {
      this.loginFbBtnClick.emit();
    });
  }
}
