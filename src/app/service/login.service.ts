import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { formatDate } from '@angular/common';
import { ModalService } from './modal.service';
import { Router } from '@angular/router';

export type MODAL_BTN = {
  text?: string, status?: number | string, event?: any, show?: boolean
}

export type MODAL_MSG = {
  status?: number | string,
  title: string,
  text?: string,
  html?: any,
  cancel?: MODAL_BTN,
  ok?: MODAL_BTN
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private log: BehaviorSubject<any> = new BehaviorSubject({ status: false, cliente: { documento: '' } });
  private user: any = { status: false, cliente: { documento: '' } };
  private loginTokenName = "tokenLogin";
  jwtHelper: any;

  constructor(@Inject(LOCALE_ID) private locale: string, private modalService: ModalService, private router: Router) {
    this.jwtHelper = new JwtHelperService();
    this.logIn(this.getTokenLogin());
  }

  decodeToken(token) {
    token = token || this.getTokenLogin();
    return token == null ? false : this.jwtHelper.decodeToken(token).iss;
  }

  getTokenLogin() {
    let token = localStorage.getItem(this.loginTokenName);
    return token == 'null' ? null : token;
  }

  private setTokenLogin(value) {
    localStorage.setItem(this.loginTokenName, value);
  }

  private removeTokenLogin() {
    localStorage.removeItem(this.loginTokenName);
  }

  getLogIn(): Observable<any> {
    return this.log.asObservable();
  }

  getEmail() {
    return this.user.email;
  }

  getTelefone() {
    return this.user.cliente.telefone;
  }

  logIn(token) {
    if (token != 'null') {
      this.setTokenLogin(token);
    }
    try {
      let user = this.decodeToken(token);
      if (user === false) {
        this.user = { status: false, cliente: { documento: '' } };
      } else {
        this.user = JSON.parse(user);
        this.user.userStatus = this.user.status;
        this.user.status = true;

        if (this.user.cliente.documento == null ||
          this.user.cliente.documento == '000.000.000-00' ||
          this.user.cliente.documento == '00.000.000/0000-00' ||
          this.user.cliente.documento.trim() == '' ||
          this.user.cliente.dataNascimento == null ||
          this.user.cliente.dataNascimento == '' ||
          this.user.nome == null ||
          this.user.nome.trim() == '') {
          this.user.statusCadastro = 'INCOMPLETO';
        } else {
          this.user.statusCadastro = 'COMPLETO';
        }

        this.user.statusCadastro = this.user.cliente.clienteAntigo ? 'INCOMPLETO' : this.user.statusCadastro;

        try {
          this.user.cliente.dataNascimento = this.user.cliente.dataNascimento != null ? formatDate(this.user.cliente.dataNascimento, 'dd/MM/yyyy', this.locale) : this.user.cliente.dataNascimento;
        } catch (error) {
          console.log(error);
        }
        //console.log(this.user);
      }
    } catch (error) {
      console.log("problema com login 2");
      // let modalMsg: MODAL_MSG = {
      //     status: 4,
      //     title: 'Sessão expirou',
      //     text: 'Faça o login novamente',
      //     cancel: { show: false },
      //     ok: { status: -1, text: 'Fechar' }
      // };
      // this.modalService.openModalMsg(modalMsg);

      this.logOut();
      this.router.navigate(['/home']);
    }

    this.log.next(this.user);
  }

  logOut() {
    this.removeTokenLogin();
    this.user = { status: false, cliente: { documento: '' } };
    this.log.next(this.user);
  }

}

