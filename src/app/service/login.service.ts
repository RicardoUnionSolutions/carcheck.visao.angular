import { Injectable, LOCALE_ID, Inject } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { formatDate } from "@angular/common";
import { ModalService } from "./modal.service";
import { TokenService } from "./token.service";

export type MODAL_BTN = {
  text?: string;
  status?: number | string;
  event?: any;
  show?: boolean;
};

export type MODAL_MSG = {
  status?: number | string;
  title: string;
  text?: string;
  html?: any;
  cancel?: MODAL_BTN;
  ok?: MODAL_BTN;
};

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private log: BehaviorSubject<any> = new BehaviorSubject({
    status: false,
    cliente: { documento: "" },
  });
  private user: any = { status: false, cliente: { documento: "" } };

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private modalService: ModalService,
    private tokenService: TokenService
  ) {
    this.logIn(this.getTokenLogin());
  }

  decodeToken(token) {
    token = token || this.getTokenLogin();
    console.log("LoginService.decodeToken() - Token recebido:", token);
    if (token == null) {
      console.log("LoginService.decodeToken() - Token é null");
      return false;
    }
    const decoded = this.tokenService.getUserFromToken(token);
    if (!decoded) {
      console.log("LoginService.decodeToken() - Token decodificado inválido");
      return false;
    }
    console.log("LoginService.decodeToken() - Token decodificado:", decoded);
    return decoded;
  }

  getTokenLogin() {
    return this.tokenService.getTokenLogin();
  }

  private setTokenLogin(value) {
    this.tokenService.setTokenLogin(value);
  }

  private removeTokenLogin() {
    this.tokenService.removeTokenLogin();
  }

  getLogIn(): Observable<any> {
    console.log("LoginService.getLogIn() - Retornando Observable");
    console.log(
      "LoginService.getLogIn() - BehaviorSubject atual:",
      this.log.value
    );
    return this.log.asObservable();
  }

  getEmail() {
    return this.user.email;
  }

  getTelefone() {
    return this.user.cliente.telefone;
  }

  logIn(token) {
    if (token != "null") {
      this.setTokenLogin(token);
    }
    try {
      let user = this.decodeToken(token);
      if (user === false) {
        console.log("LoginService - Token inválido");
        this.user = { status: false, cliente: { documento: "" } };
      } else {
        this.user = user;
        this.user.userStatus = this.user.status;
        this.user.status = true;
        console.log("LoginService - Usuário decodificado:", this.user);

        if (
          this.user.cliente.documento == null ||
          this.user.cliente.documento == "000.000.000-00" ||
          this.user.cliente.documento == "00.000.000/0000-00" ||
          this.user.cliente.documento.trim() == "" ||
          this.user.cliente.dataNascimento == null ||
          this.user.cliente.dataNascimento == "" ||
          this.user.nome == null ||
          this.user.nome.trim() == ""
        ) {
          this.user.statusCadastro = "INCOMPLETO";
        } else {
          this.user.statusCadastro = "COMPLETO";
        }

        this.user.statusCadastro = this.user.cliente.clienteAntigo
          ? "INCOMPLETO"
          : this.user.statusCadastro;

        try {
          console.log("LoginService - Tentando formatar data:", this.user.cliente.dataNascimento);
          console.log("LoginService - Locale:", this.locale);
          this.user.cliente.dataNascimento =
            this.user.cliente.dataNascimento != null
              ? formatDate(
                  this.user.cliente.dataNascimento,
                  "dd/MM/yyyy",
                  this.locale
                )
              : this.user.cliente.dataNascimento;
          console.log("LoginService - Data formatada com sucesso:", this.user.cliente.dataNascimento);
        } catch (error) {
          console.log("LoginService - Erro ao formatar data:", error);
        }
      }
    } catch (error) {
      console.log("LoginService - Erro no login:", error);
      this.logOut();
    }

    // Atualizar o estado do usuário
    this.log.next(this.user);
  }

  logOut() {
    this.removeTokenLogin();
    this.user = { status: false, cliente: { documento: "" } };
    this.log.next(this.user);
  }
}
