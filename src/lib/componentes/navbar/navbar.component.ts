import { Component, OnInit, inject } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LoginService } from "../../../app/service/login.service";
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: "navbar-home",
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class CkNavbarComponent implements OnInit {
  currentUrl = "/";
  isOpen = false;
  logIn: any = { status: false };

  private router = inject(Router);
  private loginService = inject(LoginService);

  constructor() {
    this.loginService.getLogIn().subscribe((v) => {
      console.log("Navbar - Status do login recebido:", v);
      this.logIn = v;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit() {
    // Component initialization
  }

  navigateToLogin() {
    this.router.navigate(["/login"]);
  }

  navigateToCadastro() {
    this.router.navigate(["/login"], { queryParams: { cadastro: true } });
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }
}
