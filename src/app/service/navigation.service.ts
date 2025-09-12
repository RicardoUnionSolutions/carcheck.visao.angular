import { Injectable, inject, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginService } from './login.service';

export interface NavigationState {
  isAuthenticated: boolean;
  redirectUrl: string | null;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService implements OnInit {
  private router = inject(Router);
  private loginService = inject(LoginService);
  
  // Estado centralizado de navegação
  private navigationState = new BehaviorSubject<NavigationState>({
    isAuthenticated: false,
    redirectUrl: null,
    isLoading: false
  });

  // Observables para componentes
  public readonly isAuthenticated$ = this.navigationState.asObservable();
  public readonly isLoading$ = this.navigationState.asObservable();

  // Getters para estado atual
  get isAuthenticated(): boolean {
    return this.navigationState.value.isAuthenticated;
  }

  get redirectUrl(): string | null {
    return this.navigationState.value.redirectUrl;
  }

  get isLoading(): boolean {
    return this.navigationState.value.isLoading;
  }

  ngOnInit(): void {
    // Sincronizar com o estado inicial do LoginService
    this.loginService.getLogIn().subscribe(user => {
      this.setAuthenticationStatus(user.status);
      
      // Se o usuário foi deslogado, redirecionar para login
      if (!user.status && this.router.url !== '/login') {
        this.navigateToLogin();
      }
    });
  }

  /**
   * Atualiza o estado de autenticação
   */
  setAuthenticationStatus(isAuthenticated: boolean): void {
    this.updateState({ isAuthenticated });
  }

  /**
   * Define a URL de redirecionamento após login
   */
  setRedirectUrl(url: string | null): void {
    this.updateState({ redirectUrl: url });
  }

  /**
   * Define o estado de carregamento
   */
  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  /**
   * Navega para a página de login
   */
  navigateToLogin(redirectUrl?: string): void {
    if (redirectUrl) {
      this.setRedirectUrl(redirectUrl);
    }
    this.router.navigate(['/login']);
  }

  /**
   * Navega para a página principal após login
   */
  navigateAfterLogin(): void {
    const redirectUrl = this.redirectUrl || '/historico-consulta';
    this.setRedirectUrl(null); // Limpa a URL de redirecionamento
    
    // Verificar se há estado para passar (como pacote)
    const state = history.state?.pacote ? { pacote: history.state.pacote } : {};
    
    this.router.navigate([redirectUrl], { state });
  }

  /**
   * Navega para uma URL específica
   */
  navigateTo(url: string | string[], extras?: NavigationExtras): void {
    this.router.navigate(Array.isArray(url) ? url : [url], extras);
  }

  /**
   * Navega para a URL de redirecionamento ou página padrão
   */
  navigateToRedirectOrDefault(defaultUrl: string = '/historico-consulta'): void {
    const redirectUrl = this.redirectUrl || defaultUrl;
    this.setRedirectUrl(null);
    this.router.navigate([redirectUrl]);
  }

  /**
   * Verifica se o usuário pode acessar uma rota
   */
  canAccessRoute(route: string): boolean {
    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ['/login', '/recuperar-senha', '/contato', '/duvidas-frequentes', '/politica-de-privacidade'];
    
    if (publicRoutes.includes(route)) {
      return true;
    }

    // Para rotas protegidas, verifica se está autenticado
    return this.isAuthenticated;
  }

  /**
   * Processa logout e redireciona para login
   */
  logout(): void {
    this.setAuthenticationStatus(false);
    this.setRedirectUrl(null);
    this.navigateToLogin();
  }

  /**
   * Atualiza o estado interno
   */
  private updateState(partialState: Partial<NavigationState>): void {
    const currentState = this.navigationState.value;
    this.navigationState.next({ ...currentState, ...partialState });
  }
}
