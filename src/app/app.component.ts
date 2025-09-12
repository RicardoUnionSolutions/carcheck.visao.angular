import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { setTheme } from "ngx-bootstrap/utils";
import { CkNavbarComponent } from "../lib/componentes/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { FloatingChatComponent } from "./components/floating-chat/floating-chat.component";
import { CkLoadingComponent } from "./components/ck-loading/ck-loading.component";
import { CkModalMsgComponent } from "./components/ck-modal/ck-modal-msg/ck-modal-msg.component";
import { AnalyticsService } from "./service/analytics.service";
import { LoginService } from "./service/login.service";
import { ModalService } from "./service/modal.service";
import { PessoaService } from "./service/pessoa.service";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CkNavbarComponent,
    FooterComponent,
    FloatingChatComponent,
    CkLoadingComponent,
    CkModalMsgComponent,
  ],
})
export class AppComponent implements OnInit {
  login: any;
  paddingLogin: boolean = false;
  currentUrl = "";
  title = "app";

  constructor(
    private modal: ModalService,
    private loginService: LoginService,
    public router: Router,
    private analyticsService: AnalyticsService,
    private pessoaService: PessoaService
  ) {
    this.loginService.getLogIn().subscribe((v) => {
      this.login = v;
      this.updatePaddingLoginBar();

      // this.pessoaService.agendarEmailMarketing().subscribe(v => {
      // });
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.analyticsService.atualizacaoPagina(event.urlAfterRedirects);
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url.trim().split("/")[1];
        }
        this.updatePaddingLoginBar();
      }
    });
  }

  ngOnInit() {
    // Configure ngx-bootstrap theme
    setTheme("bs5");
  }

  updatePaddingLoginBar() {
    this.paddingLogin = this.login.status || this.currentUrl == "consulta";
  }
}
