import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  private readonly tokenKey = "tokenLogin";
  private jwtHelper = new JwtHelperService();

  /**
   * Recupera o token armazenado no localStorage.
   */
  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    return token && token !== "null" ? token : null;
  }

  /**
   * Armazena o token no localStorage.
   */
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Remove o token do localStorage.
   */
  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Decodifica um token JWT.
   */
  decode(token: string = this.getToken()!): any | null {
    if (!token) {
      return null;
    }
    try {
      return this.jwtHelper.decodeToken(token);
    } catch {
      return null;
    }
  }

  /**
   * Retorna o objeto de usuário contido no token, se existir.
   */
  getUserFromToken(token: string = this.getToken()!): any | null {
    const decoded = this.decode(token);
    if (!decoded || !decoded.iss) {
      return null;
    }
    try {
      return JSON.parse(decoded.iss);
    } catch {
      return null;
    }
  }

  /**
   * Verifica se o token é válido e não está expirado.
   */
  isTokenValid(token: string = this.getToken()!): boolean {
    if (!token) {
      return false;
    }
    try {
      return !this.jwtHelper.isTokenExpired(token);
    } catch {
      return false;
    }
  }
}

