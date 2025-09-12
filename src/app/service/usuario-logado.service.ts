import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable()
export class UsuarioLogadoService {
  constructor(private tokenService: TokenService) {}

  setUsuarioLogado(tokenUsuario: string) {
    this.tokenService.saveToken(tokenUsuario);
  }

  getUsuarioLogado() {
    return this.tokenService.decodeToken();
  }

  logout() {
    this.tokenService.removeToken();
  }

}
