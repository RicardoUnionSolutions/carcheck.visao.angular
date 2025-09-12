import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  private readonly loginTokenName = "tokenLogin";
  jwtHelper = new JwtHelperService();

  setToken(token: string): void {
    localStorage.setItem(this.loginTokenName, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.loginTokenName);
    return token && token !== "null" ? token : null;
  }

  getTokenLogin(): string | null {
    return this.getToken();
  }

  removeToken(): void {
    localStorage.removeItem(this.loginTokenName);
  }

  decodeToken(tokenName?: string): any | null {
    const token = tokenName ? localStorage.getItem(tokenName) : this.getToken();
    return this.decodeTokenFromString(token);
  }

  decodeTokenFromString(token: string | null): any | null {
    if (!token || token === "null") return null;
    try {
      const decoded = this.jwtHelper.decodeToken(token);
      if (decoded && typeof decoded.iss === "string") {
        try {
          return JSON.parse(decoded.iss);
        } catch {
          return decoded.iss;
        }
      }
      return decoded;
    } catch (error) {
      console.log("TokenService.decodeTokenFromString error:", error);
      return null;
    }
  }
}

