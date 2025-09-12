import { Component } from '@angular/core';
import { NavigationEnd, Router } from '../../node_modules/@angular/router';
import { AnalyticsService } from './service/analytics.service';
import { LoginService } from './service/login.service';
import { ModalService } from './service/modal.service';
import { PessoaService } from './service/pessoa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  login: any;
  paddingLogin: boolean = false;
  currentUrl = '';
  title = 'app';

  constructor(private modal: ModalService, private loginService: LoginService, public router: Router, private analyticsService: AnalyticsService, private pessoaService: PessoaService) {
    this.loginService.getLogIn().subscribe(v => {
      this.login = v;
      this.updatePaddingLoginBar();

      // this.pessoaService.agendarEmailMarketing().subscribe(v => {
      // });
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.analyticsService.atualizacaoPagina(event.urlAfterRedirects);
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url.trim().split('/')[1];
        }
        this.updatePaddingLoginBar();
      }
    });

  }

  updatePaddingLoginBar() {
    this.paddingLogin = (this.login.status) || (this.currentUrl == 'consulta');
  };


}
