import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from './token.service';

@Injectable()
export class UsuarioLogadoService {

  constructor(private tokenService : TokenService ) { }

  setUsuarioLogado(tokenUsuario:string){
    localStorage.setItem('tokenLogin',tokenUsuario);
  }

  getUsuarioLogado(){
    return this.tokenService.decodeToken("tokenLogin");
  }

  logout(){
    localStorage.removeItem("tokenLogin");
  }

}
