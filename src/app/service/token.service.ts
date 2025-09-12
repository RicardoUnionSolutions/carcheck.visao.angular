import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly tokenKey = 'tokenLogin';
  private jwtHelper = new JwtHelperService();

  getTokenLogin(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    return token === 'null' ? null : token;
  }

  setTokenLogin(value: string): void {
    localStorage.setItem(this.tokenKey, value);
  }

  removeTokenLogin(): void {
    localStorage.removeItem(this.tokenKey);
  }

  decodeToken(token?: string | null): any | null {
    const current = token || this.getTokenLogin();
    if (!current) {
      return null;
    }
    try {
      return this.jwtHelper.decodeToken(current);
    } catch (error) {
      console.error('TokenService.decodeToken - error decoding token', error);
      return null;
    }
  }

  getUserFromToken(token?: string | null): any | null {
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return null;
    }
    if (decoded.iss) {
      try {
        return JSON.parse(decoded.iss);
      } catch (error) {
        console.error('TokenService.getUserFromToken - invalid iss field', error);
        return null;
      }
    }
    return decoded;
  }
}
