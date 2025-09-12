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
  private loginTokenName = "tokenLogin";

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private modalService: ModalService,
    private tokenService: TokenService
  ) {
    this.logIn(this.getTokenLogin());
  }

  decodeToken(token) {
    token = token || this.getTokenLogin();
    const user = this.tokenService.getUserFromToken(token);
    return user ? user : false;
  }

  getTokenLogin() {
    return this.tokenService.getToken();
  }

  private setTokenLogin(value) {
    this.tokenService.setToken(value);
  }

  private removeTokenLogin() {
    this.tokenService.removeToken();
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
    if (token != null && token != "null") {
      this.setTokenLogin(token);
    }

    if (!this.tokenService.isTokenValid(token || undefined)) {
      this.user = { status: false, cliente: { documento: "" } };
      this.log.next(this.user);
      return;
    }

    try {
      let user = this.decodeToken(token);
      if (user === false) {
        this.user = { status: false, cliente: { documento: "" } };
      } else {
        this.user = user;
        this.user.userStatus = this.user.status;
        this.user.status = true;

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
          this.user.cliente.dataNascimento =
            this.user.cliente.dataNascimento != null
              ? formatDate(
                  this.user.cliente.dataNascimento,
                  "dd/MM/yyyy",
                  this.locale
                )
              : this.user.cliente.dataNascimento;
        } catch (error) {}
      }
    } catch (error) {
      this.logOut();
    }

    this.log.next(this.user);
  }

  logOut() {
    this.removeTokenLogin();
    this.user = { status: false, cliente: { documento: "" } };
    this.log.next(this.user);
  }
}
