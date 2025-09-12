import { Injectable, inject } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { NavigationService } from "../service/navigation.service";
import { LoginService } from "../service/login.service";
import { Observable, map, take } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  private navigationService = inject(NavigationService);
  private loginService = inject(LoginService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    // Verificar se está tentando acessar a rota de login
    if (state.url === '/login' || state.url.startsWith('/login')) {
      return true;
    }

    // Verificar se pode acessar a rota usando o serviço centralizado
    if (this.navigationService.canAccessRoute(state.url)) {
      return true;
    }

    // Se não pode acessar, redirecionar para login com a URL atual como redirect
    this.navigationService.navigateToLogin(state.url);
    return false;
  }
}
