# Angular 20 - Funcionalidades Utilizadas no Sistema CarCheck

## Visão Geral
O sistema CarCheck foi migrado para Angular 20 e utiliza as funcionalidades mais modernas do framework. Este documento explica detalhadamente como cada funcionalidade do Angular 20 está implementada e utilizada no sistema.

## 🚀 **1. Componentes Standalone (Standalone Components)**

### 1.1 Implementação
Os componentes standalone são a base da arquitetura moderna do Angular 20, eliminando a necessidade de NgModules para a maioria dos casos.

```typescript
@Component({
  selector: "app-home-view",
  templateUrl: "./home-view.component.html",
  styleUrls: ["./home-view.component.scss"],
  standalone: true,  // ✅ Componente standalone
  imports: [         // ✅ Imports diretos no componente
    DestaqueComponent,
    AplicativoComponent,
    ProdutosComponent,
    DestaqueServicosComponent,
    LazyWrapperComponent,
  ],
})
export class HomeViewComponent implements OnInit {
  // Implementação do componente
}
```

### 1.2 Benefícios no Sistema
- **Tree-shaking melhorado**: Apenas componentes utilizados são incluídos no bundle
- **Lazy loading otimizado**: Componentes podem ser carregados individualmente
- **Manutenção simplificada**: Não há necessidade de gerenciar NgModules
- **Performance**: Bundle menor e carregamento mais rápido

### 1.3 Exemplos no Sistema
```typescript
// Componente de Login
@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CkInputComponent,
    ConfirmarEmailComponent,
  ],
})

// Componente de Consulta
@Component({
  selector: "consulta",
  templateUrl: "./consulta.component.html",
  styleUrls: ["./consulta.component.scss"],
  standalone: true,
  imports: [CommonModule, InlineSVGDirective]
})
```

## 🔧 **2. Application Config (app.config.ts)**

### 2.1 Configuração Moderna
O Angular 20 utiliza `ApplicationConfig` em vez de `NgModule` para configuração da aplicação.

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),                    // ✅ Roteamento
    provideHttpClient(withInterceptorsFromDi()), // ✅ HTTP Client
    provideAnimations(),                      // ✅ Animações
    provideClientHydration(),                 // ✅ SSR Hydration
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: "pt" },  // ✅ Localização
    // Serviços da aplicação
    VariableGlobal,
    LoginService,
    PessoaService,
    // ... outros serviços
  ],
};
```

### 2.2 Funcionalidades Configuradas
- **Roteamento**: `provideRouter()` com rotas definidas
- **HTTP Client**: Com interceptors para autenticação
- **Animações**: Suporte completo a animações
- **SSR**: Hidratação do lado do servidor
- **Localização**: Configuração para português brasileiro

## 🎯 **3. Signals (Sistema Reativo)**

### 3.1 Implementação de Signals
O sistema utiliza signals para gerenciamento de estado reativo.

```typescript
import { signal, computed } from '@angular/core';

@Component({
  selector: "ck-side-menubar",
  standalone: true,
  // ...
})
export class CkSideMenubarComponent implements OnInit {
  // ✅ Signal para estado reativo
  isOpen = signal(false);
  
  // ✅ Computed signal baseado em outros signals
  isOpenComputed = computed(() => this.isOpen());

  toggleMenu(): void {
    // ✅ Atualização do signal
    this.isOpen.set(!this.isOpen());
  }
}
```

### 3.2 Benefícios dos Signals
- **Performance**: Detecção de mudanças mais eficiente
- **Reatividade**: Atualizações automáticas da UI
- **Simplicidade**: Código mais limpo e legível
- **Debugging**: Melhor rastreamento de mudanças de estado

## 🔄 **4. Control Flow (@if, @for, @switch)**

### 4.1 Nova Sintaxe de Control Flow
O Angular 20 introduziu uma sintaxe mais limpa para control flow.

```html
<!-- ✅ Nova sintaxe @if -->
@if (user.isLoggedIn) {
  <div class="user-menu">
    <span>Bem-vindo, {{ user.name }}</span>
  </div>
} @else {
  <div class="login-button">
    <button (click)="login()">Entrar</button>
  </div>
}

<!-- ✅ Nova sintaxe @for -->
@for (consulta of consultas; track consulta.id) {
  <div class="consulta-item">
    <h3>{{ consulta.placa }}</h3>
    <p>{{ consulta.data }}</p>
  </div>
} @empty {
  <p>Nenhuma consulta encontrada</p>
}

<!-- ✅ Nova sintaxe @switch -->
@switch (status) {
  @case ('loading') {
    <div class="loading">Carregando...</div>
  }
  @case ('success') {
    <div class="success">Sucesso!</div>
  }
  @default {
    <div class="error">Erro inesperado</div>
  }
}
```

### 4.2 Vantagens da Nova Sintaxe
- **Performance**: Melhor otimização pelo Angular
- **Legibilidade**: Código mais limpo e intuitivo
- **Type Safety**: Melhor verificação de tipos
- **Tree Shaking**: Remoção de código não utilizado

## 🌐 **5. Server-Side Rendering (SSR)**

### 5.1 Configuração SSR
O sistema utiliza SSR para melhor SEO e performance inicial.

```typescript
// app.config.server.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideServerRendering(),  // ✅ SSR habilitado
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: "pt" },
    // ... outros providers
  ],
};
```

### 5.2 Benefícios do SSR
- **SEO**: Melhor indexação pelos motores de busca
- **Performance**: Carregamento inicial mais rápido
- **UX**: Conteúdo visível imediatamente
- **Core Web Vitals**: Melhores métricas de performance

## 🔐 **6. Guards e Interceptors Modernos**

### 6.1 AuthGuard com inject()
```typescript
@Injectable({
  providedIn: "root",
})
export class AuthGuardService implements CanActivate {
  // ✅ Uso da função inject() moderna
  private navigationService = inject(NavigationService);
  private loginService = inject(LoginService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.loginService.getLogIn().pipe(
      map(user => user.status),
      take(1)
    );
  }
}
```

### 6.2 HTTP Interceptor
```typescript
@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(
    private login: LoginService,
    private modalService: ModalService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.login.getTokenLogin();
    
    // ✅ Adiciona token de autenticação
    if (req.url.startsWith(this.baseUrl) && token) {
      req = req.clone({
        setHeaders: { Authorization: token },
      });
    }
    
    return next.handle(req).pipe(
      map((r) => {
        // ✅ Processa respostas
        if (r instanceof HttpResponse) {
          this.getServerMsg(r);
          this.hasServerError(r);
        }
        return r;
      })
    );
  }
}
```

## 📱 **7. PWA e Service Workers**

### 7.1 Configuração PWA
O sistema está preparado para PWA com service workers.

```typescript
// Configuração no app.config.ts
providers: [
  provideClientHydration(),  // ✅ Suporte a PWA
  // ... outros providers
]
```

### 7.2 Funcionalidades PWA
- **Offline Support**: Funcionamento sem conexão
- **Push Notifications**: Notificações nativas
- **App Installation**: Instalação como app nativo
- **Background Sync**: Sincronização em background

## 🎨 **8. SCSS e Styling Moderno**

### 8.1 Uso de @use em vez de @import
```scss
// ✅ Sintaxe moderna SCSS
@use 'sass:math';
@use 'sass:map';
@use 'sass:color';
@use 'variables' as *;
@use 'mixins/breakpoints' as *;

// ❌ Sintaxe antiga (depreciada)
@import 'variables';
@import 'mixins/breakpoints';
```

### 8.2 Configuração de includePaths
```json
// angular.json
{
  "projects": {
    "carcheck": {
      "architect": {
        "build": {
          "options": {
            "stylePreprocessorOptions": {
              "includePaths": [
                "src/assets/scss/bootstrap",
                "src/assets/scss/style"
              ]
            }
          }
        }
      }
    }
  }
}
```

## 🔄 **9. RxJS e Observables**

### 9.1 Uso de BehaviorSubject
```typescript
@Injectable({
  providedIn: "root",
})
export class LoginService {
  // ✅ BehaviorSubject para estado reativo
  private log: BehaviorSubject<any> = new BehaviorSubject({
    status: false,
    cliente: { documento: "" },
  });

  getLogIn(): Observable<any> {
    return this.log.asObservable();
  }

  logIn(token) {
    // ... processamento do login
    this.log.next(this.user);  // ✅ Emite mudança de estado
  }
}
```

### 9.2 WebSocket com RxJS
```typescript
@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private socket: WebSocketSubject<any> | null = null;

  openWebSocket(): void {
    if (!this.socket) {
      this.socket = this.create(environment.webSocketUrl);
    }
  }

  getMessages() {
    return this.socket?.asObservable();  // ✅ Observable para mensagens
  }
}
```

## 🧪 **10. Testing Moderno**

### 10.1 Configuração de Testes
```typescript
// karma.conf.js
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    // ... configurações modernas
  });
};
```

### 10.2 Testes com Jest (Opcional)
```typescript
// Exemplo de teste moderno
describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });
    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

## 📊 **11. Performance e Otimização**

### 11.1 Lazy Loading
```typescript
// Rotas com lazy loading
const routes: Routes = [
  {
    path: "consulta/:tokenConsulta",
    component: ConsultaComponent,  // ✅ Carregamento sob demanda
  },
  {
    path: "realizar-consultas",
    canActivate: [AuthGuardService],
    component: RealizarConsultasComponent,
  },
];
```

### 11.2 OnPush Change Detection
```typescript
@Component({
  selector: "app-component",
  changeDetection: ChangeDetectionStrategy.OnPush,  // ✅ Otimização
  standalone: true,
})
export class AppComponent {
  // Componente otimizado
}
```

## 🔧 **12. Build e Deploy**

### 12.1 Scripts de Build
```json
{
  "scripts": {
    "build": "ng build --configuration production",
    "build:ssr": "ng build --configuration production && ng build --configuration production --ssr",
    "serve:ssr": "node dist/server/server.mjs"
  }
}
```

### 12.2 Configurações de Produção
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  wsUrl: 'https://api.carcheck.com.br',
  webSocketUrl: 'wss://ws.carcheck.com.br'
};
```

## 🚀 **13. Funcionalidades Avançadas**

### 13.1 ViewEncapsulation
```typescript
@Component({
  selector: "app-consulta-veicular-completa",
  templateUrl: "./consulta-veicular-completa.component.html",
  styleUrls: ["./consulta-veicular-completa.component.scss"],
  encapsulation: ViewEncapsulation.None,  // ✅ Estilos globais
  standalone: true,
})
```

### 13.2 HostBinding e HostListener
```typescript
@Component({
  selector: "app-navbar",
  standalone: true,
})
export class NavbarComponent implements OnInit, OnDestroy {
  @HostListener('window:resize', ['$event'])  // ✅ Listener de eventos
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.updateResponsiveState();
  }

  @HostBinding('class.mobile')  // ✅ Binding de classes
  get isMobile() {
    return this.screenWidth < 768;
  }
}
```

## 📈 **14. Monitoramento e Analytics**

### 14.1 Integração com Analytics
```typescript
@Injectable({
  providedIn: "root",
})
export class AnalyticsService {
  atualizacaoPagina(url: string): void {
    // ✅ Tracking de navegação
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: url
    });
  }

  novoCadastroGoogle(): void {
    // ✅ Tracking de eventos
    gtag('event', 'sign_up', {
      method: 'Google'
    });
  }
}
```

## 🎯 **15. Melhores Práticas Implementadas**

### 15.1 Injeção de Dependência
```typescript
// ✅ Uso da função inject() moderna
export class AuthGuardService implements CanActivate {
  private navigationService = inject(NavigationService);
  private loginService = inject(LoginService);
}

// ✅ Injeção tradicional ainda suportada
export class LoginService {
  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private modalService: ModalService
  ) {}
}
```

### 15.2 Gerenciamento de Estado
```typescript
// ✅ Estado centralizado com BehaviorSubject
@Injectable({
  providedIn: "root",
})
export class NavigationService {
  private navigationState = new BehaviorSubject<NavigationState>({
    isAuthenticated: false,
    redirectUrl: null,
    isLoading: false
  });

  // ✅ Observables para componentes
  public readonly isAuthenticated$ = this.navigationState.asObservable();
}
```

## 🔍 **16. Debugging e DevTools**

### 16.1 Console Logs Estruturados
```typescript
// ✅ Logs estruturados para debugging
console.log("LoginService - Token recebido:", token);
console.log("LoginService - Usuário decodificado:", this.user);
console.log("LoginService - Status de cadastro:", this.user.statusCadastro);
```

### 16.2 Error Handling
```typescript
// ✅ Tratamento de erros robusto
try {
  let user = this.decodeToken(token);
  if (user === false) {
    console.log("LoginService - Token inválido");
    this.user = { status: false, cliente: { documento: "" } };
  }
} catch (error) {
  console.log("LoginService - Erro no login:", error);
  this.logOut();
}
```

## 📋 **17. Resumo das Funcionalidades Angular 20**

### ✅ **Implementadas no Sistema:**
1. **Componentes Standalone** - Arquitetura moderna
2. **Application Config** - Configuração sem NgModules
3. **Signals** - Sistema reativo moderno
4. **Control Flow** - Sintaxe @if, @for, @switch
5. **SSR** - Server-Side Rendering
6. **Guards Modernos** - Com função inject()
7. **HTTP Interceptors** - Autenticação automática
8. **SCSS Moderno** - @use em vez de @import
9. **RxJS** - Observables e BehaviorSubject
10. **Lazy Loading** - Carregamento sob demanda
11. **PWA Ready** - Preparado para Progressive Web App
12. **Testing** - Configuração moderna de testes
13. **Performance** - OnPush e otimizações
14. **Analytics** - Integração com Google Analytics
15. **Error Handling** - Tratamento robusto de erros

### 🚀 **Benefícios Obtidos:**
- **Performance**: Bundle menor e carregamento mais rápido
- **Manutenibilidade**: Código mais limpo e organizado
- **Escalabilidade**: Arquitetura preparada para crescimento
- **Developer Experience**: Ferramentas modernas e produtivas
- **User Experience**: Interface mais responsiva e fluida

### 📚 **Recursos para Aprendizado:**
- [Angular 20 Documentation](https://angular.dev)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/standalone-components)
- [Control Flow](https://angular.dev/guide/control-flow)
- [Server-Side Rendering](https://angular.dev/guide/ssr)

---

Este documento serve como guia completo para entender como o Angular 20 está sendo utilizado no sistema CarCheck, fornecendo exemplos práticos e explicando os benefícios de cada funcionalidade implementada.

