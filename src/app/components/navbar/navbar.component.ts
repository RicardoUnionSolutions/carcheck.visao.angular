import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
  OnDestroy,
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { LoginService } from "../../service/login.service";
import { VariableGlobal } from "../../service/variable.global.service";
import { PessoaService } from "../../service/pessoa.service";
import { NotificationService } from "../../service/notification.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild("notificationButton") notificationButton: ElementRef;
  @ViewChild("notificationCounter") notificationCounter: ElementRef;
  @ViewChild("notificationList") notificationList: ElementRef;

  // Propriedades responsivas
  isMobile: boolean = false;
  isTablet: boolean = false;
  screenWidth: number = 0;

  userOptions = [
    {
      icon: "clock-circle.svg",
      label: "Status de Pagamento",
      url: "/status-pagamento",
    },
    { icon: "config.svg", label: "Minha Conta", url: "/conta" },
    { icon: "logout.svg", label: "Sair", url: "/logout" },
  ];

  menuOptions = [
    { icon: "search.svg", label: "Minhas consultas", url: "/" },
    {
      icon: "cifrao-circle.svg",
      label: "Comprar",
      url: "/processo-compra-multipla",
    },
    { icon: "list.svg", label: "Consultar", url: "/realizar-consultas" },
    { icon: "relatorio.svg", label: "Serviços", url: "/servicos" },
  ];

  consultas: any[];

  consultasMenu: any;

  userOptionsMenu: any = { url: null, routerUrl: "/" };

  urlSite: String = "";

  currentUrl = "/";
  tokenUsuario;
  disableUserMenu = true;
  logIn;
  showMenu = true;
  showDropDownUsuario = false;
  expandNavUsuario = false;

  expandNavSite: boolean = false;
  isOpen: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private varGlobal: VariableGlobal,
    private pessoaService: PessoaService,
    private notificationService: NotificationService
  ) {
    this.urlSite = this.varGlobal.getUrlSite().home;

    this.consultasMenu = {
      url: this.urlSite + "/tipos-de-consultas/",
      routerUrl: null,
    };

    this.loginService.getLogIn().subscribe((v) => {
      this.logIn = v;
      this.toggleShowMenu();
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url.trim().split("/")[1];
        this.toggleShowMenu();
      }
    });
  }

  toggleShowMenu() {
    this.showMenu = this.logIn.status && this.currentUrl != "consulta";
    this.showDropDownUsuario =
      this.logIn.status && this.currentUrl == "consulta";
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });

    // Inicializar responsividade
    this.checkScreenSize();
  }

  ngOnDestroy() {
    // Cleanup se necessário
  }

  // ===== MÉTODOS RESPONSIVOS =====
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.screenWidth = window.innerWidth;
    this.isMobile = this.screenWidth < 992; // lg breakpoint
    this.isTablet = this.screenWidth >= 768 && this.screenWidth < 992;

    // Fechar menu mobile se a tela ficar grande
    if (!this.isMobile && this.isOpen) {
      this.isOpen = false;
    }
  }

  // ===== MÉTODOS DE NAVEGAÇÃO =====
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  navigateTo(url: string) {
    this.toggleMenu();
    this.router.navigate([url]);
  }

  onLoginClick() {
    this.router.navigate(["/login"]);
  }

  onRegisterClick() {
    this.router.navigate(["/login"], { queryParams: { cadastro: true } });
  }

  navigateToCadastro() {
    this.toggleMenu();
    this.router.navigate(["/login"], { queryParams: { cadastro: true } });
  }

  // ===== MÉTODOS DE NOTIFICAÇÃO =====
  showNotifications() {
    this.notificationService.showNotifications();
  }

  limparNotificacoes() {
    this.notificationService.clearNotifications();
  }

  // ===== MÉTODOS DE DROPDOWN =====
  toggleNavSite() {
    if (this.expandNavUsuario == true) {
      this.expandNavUsuario = false;
      setTimeout(() => {
        this.expandNavSite = true;
      }, 50);
    } else {
      this.expandNavSite = !this.expandNavSite;
    }
  }

  toggleNavUsuario(e: boolean) {
    if (e == true) {
      this.expandNavUsuario = e;
      this.expandNavSite = false;
    }
  }
}
