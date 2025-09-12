import { Injectable, inject } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { NavigationService } from "../service/navigation.service";
import { LoginService } from "../service/login.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  private navigationService = inject(NavigationService);
  private loginService = inject(LoginService);

  private user = { status: false, cliente: { documento: "" } };

  constructor() {
    this.loginService
      .getLogIn()
      .subscribe((user) => (this.user = user));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    if (state.url.includes("logout")) {
      this.loginService.logOut();
    }

    if (this.user.status === false) {
      this.navigationService.navigateTo("/home");
    }

    return this.user.status;
  }
}
