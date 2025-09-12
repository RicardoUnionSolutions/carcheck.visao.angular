import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  private readonly tokenKey = "tokenLogin";
  jwtHelper = new JwtHelperService();

  getToken(key: string = this.tokenKey): string | null {
    const token = localStorage.getItem(key);
    return token && token !== "null" ? token : null;
  }

  getTokenLogin(): string | null {
    return this.getToken();
  }

  saveToken(token: string, key: string = this.tokenKey): void {
    localStorage.setItem(key, token);
  }

  removeToken(key: string = this.tokenKey): void {
    localStorage.removeItem(key);
  }

  decodeToken(tokenOrKey?: string): any | null {
    let jwt = tokenOrKey;
    if (!jwt || !jwt.includes(".")) {
      jwt = this.getToken(jwt);
    }
    if (!jwt) {
      return null;
    }
    try {
      return this.jwtHelper.decodeToken(jwt);
    } catch (e) {
      console.error("TokenService.decodeToken() - Erro ao decodificar token:", e);
      return null;
    }
  }

  isTokenExpired(token?: string): boolean {
    const jwt = token || this.getToken();
    if (!jwt) {
      return true;
    }
    try {
      return this.jwtHelper.isTokenExpired(jwt);
    } catch {
      return true;
    }
  }
}
