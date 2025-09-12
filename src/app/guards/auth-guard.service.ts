import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { Observable } from 'rxjs';
import { VariableGlobal } from '../service/variable.global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  user = { status: false, cliente: { documento: '' } };

  constructor(private login: LoginService, private route: Router, private global: VariableGlobal) {
    this.login.getLogIn().subscribe(user => this.user = user);
  }

  canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {

    router.url.forEach(i => {
      if (i.path.replace('/', '').toLocaleLowerCase() == 'logout') {
        this.login.logOut();
        // window.location.href = this.global.getUrlSite().home;
      }
    });

    if (this.user.status == false) {
      this.route.navigate(['home']);
    }

    return this.user.status;
  }
}
