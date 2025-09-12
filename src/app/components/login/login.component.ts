import {
  Component,
  OnInit,
  input,
  output,
  NgZone,
  ChangeDetectorRef,
  inject,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { PessoaService } from "../../service/pessoa.service";
import { LoginService } from "../../service/login.service";
import { ModalService } from "../../service/modal.service";
import { AnalyticsService } from "../../service/analytics.service";
import { distinctUntilChanged, filter } from "rxjs/operators";
import { CredentialResponse, PromptMomentNotification } from "google-one-tap";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Title, Meta } from "@angular/platform-browser";
import { CkInputComponent } from "../ck-input/ck-input.component";
import { ConfirmarEmailComponent } from "../confirmar-email/confirmar-email.component";

declare var FB: any;
declare var window: any;
declare var google: any;

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CkInputComponent,
    ConfirmarEmailComponent,
  ],
})
export class LoginComponent implements OnInit {
  cadastrarBtnClick = output<void>();
  loginBtnClick = output<any>();
  loginFbBtnClick = output<void>();
  loginGoogleBtnClick = output<void>();

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

  salvo = input(false);

  loginEntrada = input({
    login: "",
    senha: "",
    manterconectado: false,
    form: null,
  });

  usuarioEntrada = input({
    email: "",
    nome: "",
    status: "",
  });

  clienteEntrada = input({
    documento: "",
    salvo: "",
  });

  form: FormGroup;
  jwtHelper = new JwtHelperService();
  
  // Propriedade local para armazenar dados do login
  loginData = {
    login: '',
    senha: '',
    manterconectado: false,
    form: null
  };

  private modalService = inject(ModalService);
  private pessoaService = inject(PessoaService);
  private ngZone = inject(NgZone);
  private loginService = inject(LoginService);
  private fb = inject(FormBuilder);
  private analyticsService = inject(AnalyticsService);
  private ref = inject(ChangeDetectorRef);
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);

  constructor() {
    this.loginService.getLogIn().subscribe((v) => {
      this.usuario.logado = v.status;
      this.dadosLogIn = v;
    });

    var manterconectado = JSON.parse(localStorage.getItem("manterconectado"));
    if (manterconectado != null) {
      // Note: Signal inputs are read-only, so we can't modify them directly
      // This logic should be handled in the parent component
    }

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    window.fbAsyncInit = () => {
      FB.init({
        appId: "3292598594393987",
        cookie: true,
        xfbml: true,
        version: "v15.0",
      });
      FB.AppEvents.logPageView();
    };
  }

  ngOnInit() {
    this.title.setTitle("Login - CarCheck");
    this.meta.updateTag({
      name: "description",
      content:
        "Acesse sua conta para visualizar consultas veiculares, histórico de laudos e gerenciar seus dados.",
    });

    this.initGoogleLoginButton();

    // Inicializar dados locais com valores do input signal
    this.loginData = { ...this.loginEntrada() };

    this.form = this.fb.group({
      email: [this.loginData.login, [Validators.required, Validators.email]],
      senha: [
        this.loginData.senha,
        [Validators.required, Validators.minLength(4)],
      ],
    });

    this.form.controls.senha.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((v: string) => {
        let newValue = v.replace(/\s/g, "");
        this.form.controls.senha.patchValue(newValue);
        this.loginData.senha = newValue;
      });

    this.form.controls.email.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((v: string) => {
        let newValue = v.replace(/\s/g, "");
        this.form.controls.email.patchValue(newValue);
        this.loginData.login = newValue;
      });
  }

  ngOnchanges() {
    if (this.form) {
      // Atualizar dados locais quando o input signal muda
      this.loginData = { ...this.loginEntrada() };
      this.form.patchValue({
        email: this.loginData.login,
        senha: this.loginData.senha,
      });
    }
  }

  cadastrar() {
    this.cadastrarBtnClick.emit();
  }

  initGoogleLoginButton() {
    // Carrega o script do Google One-tap dinamicamente
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    //login com google one-tap
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        // DOC: https://developers.google.com/identity/gsi/web/reference/js-reference#IdConfiguration
        client_id:
          "210450991548-6alqffcge601d46pc9b1176gpmhot0ss.apps.googleusercontent.com",
        callback: this.handleCredentialResponse.bind(this), // Função de decodificar o token do google
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // renderizar o botão de login do google
      // @ts-ignore
      google.accounts.id.renderButton(document.getElementById("googleLogin"), {
        theme: "outline",
        size: "large",
      });

      // OPTIONAL: Caso queria fazer redirecionamento e abertura do modal de loading
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {
        if (notification.getDismissedReason() === "credential_returned") {
          this.ngZone.run(() => {
            this.modalService.openLoading({
              title: "Aguarde...",
              text: "Efetuando Login!",
            });
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
    this.modalService.openLoading({
      title: "Aguarde...",
      text: "Efetuando Login!",
    });
    this.pessoaService.logar(this.loginData)
      .then((users) => {
        if (users == "erro_email_senha") {
        this.modalService.closeLoading();
        this.form.controls.senha.setErrors({
          msg: "A senha não confere com o e-mail informado.",
        });
        return;
      }
      this.token = users;
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      this.user = JSON.parse(decodedToken.iss);
      this.emailNaoVerificado = !this.user.emailVerificado;
      // SEMPRE verificar se o email está verificado após login bem-sucedido
      if (this.user.emailVerificado) {
        this.loginService.logIn(users);
        this.loginBtnClick.emit(undefined);
        this.modalService.closeLoading();

        // Redirecionamento será controlado pelo LoginViewComponent
      } else {
        // NÃO chama loginService.logIn() para evitar redirecionamento
        // Apenas emite evento com dados para o login-view processar
        this.loginBtnClick.emit({
          user: this.user,
          token: users,
          emailVerificado: this.user.emailVerificado
        });
        this.modalService.closeLoading();
      }
    }).then((users) => {
      if (this.user && this.user.emailVerificado) {
        this.loginService.logIn(users);
        this.loginBtnClick.emit(undefined);
      }
    }).catch((error) => {
      this.modalService.closeLoading();
    });
  }

  loginErro() {}

  //decodificar token google e login
  userGoogle;
  handleCredentialResponse(response: CredentialResponse) {
    let decodedToken: any | null = null;
    try {
      decodedToken = JSON.parse(atob(response?.credential.split(".")[1]));
    } catch (e) {
      console.error("Error while trying to decode token", e);
    }
    this.userGoogle = decodedToken;
    this.modalService.openLoading({
      title: "Aguarde...",
      text: "Efetuando Login!",
    });
    var promise = new Promise((resolve, reject) => {
      this.ngZone.run(() => {
        this.pessoaService
          .adicionarGoogle(this.userGoogle)
          .subscribe((response) => {
            this.analyticsService.novoCadastroGoogle();
            this.loginService.logIn(response);
            this.modalService.closeLoading();

            // Redirecionamento direto como fallback
            this.router.navigate(["/historico-consulta"]);
          });
      });
    });
    promise.then(() => {
      this.loginGoogleBtnClick.emit();
    });
  }

  loginFb() {
    var promise = new Promise((resolve, reject) => {
      FB.login(
        (loginResponse) => {
          FB.api(
            "/me?fields=id,name,about,age_range,birthday,email,hometown",
            (dadosUsuario) => {
              this.ngZone.run(() => {
                this.pessoaService
                  .adicionarFB(dadosUsuario)
                  .subscribe((response) => {
                    if (response == "erro_email") {
                      this.modalService.openModalMsg({
                        status: 2,
                        title: "Erro ao efetuar login",
                        text: "E-mail já cadastrado.",
                        cancel: { show: false },
                        ok: { text: "Fechar" },
                      });
                      return;
                    }
                    this.analyticsService.novoCadastroFb();
                    this.loginService.logIn(response);

                    // Redirecionamento direto como fallback
                    this.router.navigate(["/historico-consulta"]);

                    resolve(null);
                  });
              });
            }
          );
        },
        { scope: "email" }
      );
    });

    promise.then(() => {
      this.loginFbBtnClick.emit();
    });
  }
}
