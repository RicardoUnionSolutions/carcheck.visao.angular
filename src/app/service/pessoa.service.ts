import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, lastValueFrom } from "rxjs";
import { VariableGlobal } from "./variable.global.service";
import { LoginService } from "./login.service";
import { TokenService } from "./token.service";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PessoaService {
  jwtPayLoad: any;

  constructor(
    private http: HttpClient,
    private variableGlobal: VariableGlobal,
    private loginService: LoginService
  ) {}

  getCookie(name) {
    var v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
    console.log(v);
    return v ? v[2] : null;
  }

  getEmail() {
    return this.loginService.getEmail();
  }

  getTelefone() {
    return this.loginService.getTelefone();
  }

  //cadastrar usuário
  adicionar(cadastro: any): Promise<any> {
    cadastro.email = cadastro.email.toLowerCase();
    if (this.getCookie("identificadorParceiro") != null) {
      cadastro.identificacaoParceiro = this.getCookie("identificadorParceiro");
    }
    return lastValueFrom(this.http
      .post(this.variableGlobal.getUrl("cliente/cadastrarCliente"), cadastro, {
        responseType: "json",
      }));
  }

  //atualizar usuário
  atualizar(cadastro: any): Promise<any> {
    //if(cadastro.documento == null) cadastro.documento = (cadastro.tipoPessoa=="0" ? cadastro.cpf : cadastro.cnpj);
    return lastValueFrom(this.http
      .post(
        this.variableGlobal.getUrl("cliente/atualizaDadosConta"),
        cadastro,
        { responseType: "json" }
      ));
  }

  getCreditoCliente(email: any): Observable<any> {
    return this.http.get(
      this.variableGlobal.getUrl(
        "consultar/pegarCreditoCliente?email=" + email.toLowerCase()
      )
    );
  }

  //cadastrar usuario facebook
  adicionarFB(cadastro: any): Observable<any> {
    if (this.getCookie("identificadorParceiro") != null) {
      cadastro.identificacaoParceiro = this.getCookie("identificadorParceiro");
    }
    return this.http.post(
      this.variableGlobal.getUrl("cliente/cadastrarClienteFacebook"),
      cadastro,
      { responseType: "json" }
    );
  }

  //cadastrar usuario Google
  adicionarGoogle(cadastro: any): Observable<any> {
    return this.http.post(
      this.variableGlobal.getUrl("cliente/cadastrarClienteGoogle"),
      cadastro,
      { responseType: "json" }
    );
  }

  logar(login: any): Promise<any> {
    if (login.login) login.login = login.login.toLowerCase();

    if (login.email) login.email = login.email.toLowerCase();

    if (login.manterconectado) {
      localStorage.setItem("manterconectado", JSON.stringify(login));
    }

    return lastValueFrom(this.http.post(this.variableGlobal.getUrl("cliente/login"), login, {
      responseType: "text",
    }));
  }

  logarFB(login: any): Observable<any> {
    if (login.manterconectado) {
      localStorage.setItem("manterconectado", JSON.stringify(login));
    }

    return this.http
      .post(this.variableGlobal.getUrl("cliente/loginFB"), login, {
        responseType: "json",
      })
      .pipe(
        map((retorno) => {
          this.loginService.logIn(retorno);
          return retorno;
        })
      );
  }

  logarGoogle(login: any): Observable<any> {
    if (login.manterconectado) {
      localStorage.setItem("manterconectado", JSON.stringify(login));
    }

    return this.http
      .post(this.variableGlobal.getUrl("cliente/loginGoogle"), login, {
        responseType: "json",
      })
      .pipe(
        map((retorno) => {
          this.loginService.logIn(retorno);
          return retorno;
        })
      );
  }

  recuperarSenha(email: string) {
    return this.http.post(
      this.variableGlobal.getUrl("cliente/recuperarSenha"),
      { email: email.toLowerCase() },
      { responseType: "json" }
    );
  }

  //completar cadastro no pagamento
  completarCadastroPagamento(cadastro: any): Observable<any> {
    return this.http.post(
      this.variableGlobal.getUrl("cliente/completaDadosConta"),
      cadastro,
      { responseType: "json" }
    );
  }

  //cadastraAtualizaEmailMarketing
  cadastrarAtualizarEmailMarketing(emailMarketing: any): Observable<any> {
    return this.http.post(
      this.variableGlobal.getUrl("cliente/enviaEmailMarketing"),
      emailMarketing
    );
  }

  //agendarEmailMarketing
  agendarEmailMarketing(): Observable<any> {
    return this.http.post(
      this.variableGlobal.getUrl("cliente/agendarEmailMarketing"),
      {}
    );
  }

  cadastraEmailMarketing(emailMarketing: any): Observable<any> {
    return this.http.post(
      this.variableGlobal.getUrl("cliente/cadastraEmailMarketing"),
      emailMarketing
    );
  }

  enviarContato(body: any): Promise<any> {
    return lastValueFrom(this.http
      .post(this.variableGlobal.getUrl("cliente/enviarContato"), body));
  }

  verificarCodigo(entrada: any): Promise<any> {
    return lastValueFrom(this.http
      .post(this.variableGlobal.getUrl("cliente/verificarCodigo"), entrada));
  }

  reenviarCodigo(entrada: any): Promise<any> {
    return lastValueFrom(this.http
      .post(this.variableGlobal.getUrl("cliente/reenviarVerificacao"), entrada));
  }
}
