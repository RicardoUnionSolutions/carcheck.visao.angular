import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { VariableGlobal } from '../../service/variable.global.service';
import { PessoaService } from '../../service/pessoa.service';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @ViewChild('notificationButton') notificationButton: ElementRef;
  @ViewChild('notificationCounter') notificationCounter: ElementRef;
  @ViewChild('notificationList') notificationList: ElementRef;



  userOptions = [
    { icon: 'clock-circle.svg', label: 'Status de Pagamento', url: '/status-pagamento' },
    { icon: 'config.svg', label: 'Minha Conta', url: '/conta' },
    { icon: 'logout.svg', label: 'Sair', url: '/logout' }
  ];

  menuOptions = [
    { icon: 'search.svg', label: 'Minhas consultas', url: '/' },
    { icon: 'cifrao-circle.svg', label: 'Comprar', url: '/processo-compra-multipla' },
    { icon: 'list.svg', label: 'Consultar', url: '/realizar-consultas' },
    { icon: 'relatorio.svg', label: 'Serviços', url: '/servicos' }
  ];

  consultas: any[];

  consultasMenu: any;

  userOptionsMenu: any = { url: null, routerUrl: '/' };

  urlSite: String = '';

  currentUrl = '/';
  tokenUsuario;
  disableUserMenu = true;
  logIn;
  showMenu = true;
  showDropDownUsuario = false;
  expandNavUsuario = false;

  expandNavSite: boolean = false;
  isOpen: boolean;


  constructor(private router: Router,
    private loginService: LoginService,
    private varGlobal: VariableGlobal,
    private pessoaService: PessoaService,
    private notificationService: NotificationService,
  ) {

    this.urlSite = this.varGlobal.getUrlSite().home;

    this.consultasMenu = { url: this.urlSite + '/tipos-de-consultas/', routerUrl: null };


    this.loginService.getLogIn().subscribe(v => {
      this.logIn = v;
      this.toggleShowMenu();
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url.trim().split('/')[1];
        this.toggleShowMenu();
      }
    });


  }

  toggleShowMenu() {
    this.showMenu = ((this.logIn.status) && (this.currentUrl != 'consulta'));
    this.showDropDownUsuario = ((this.logIn.status) && (this.currentUrl == 'consulta'));
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });


  }

  navigateToCadastro() {
    this.toggleMenu();
    this.router.navigate(['/login'], { queryParams: { cadastro: true } });
  }

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

  toggleNavUsuario(e) {
    if (e == true) {
      this.expandNavUsuario = e;
      this.expandNavSite = false;
    }
  }

  showNotifications() {
    this.notificationService.showNotifications();
  }

  limparNotificacoes() {
    this.notificationService.clearNotifications();
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

}
