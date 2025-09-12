import { ApplicationConfig } from "@angular/core";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { provideServerRendering } from "@angular/platform-server";
import { provideRouter } from "@angular/router";
import { LOCALE_ID } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import localePT from "@angular/common/locales/pt";

import { routes } from "./app.routes";
import { AppInterceptor } from "./app-interceptor.service";
import { VariableGlobal } from "./service/variable.global.service";
import { TokenService } from "./service/token.service";
import { LoginService } from "./service/login.service";
import { PessoaService } from "./service/pessoa.service";
import { AnalyticsService } from "./service/analytics.service";
import { dadosConsultaService } from "./service/dados-consulta.service";
import { PostService } from "./service/blog.service";
import { UsuarioLogadoService } from "./service/usuario-logado.service";
import { PagamentoService } from "./service/pagamento.service";
import { FazerConsultaService } from "./service/fazer-consulta.service";
import { WebSocketService } from "./service/webSocket.service";
import { ConsultaDuasEtapasService } from "./service/consulta-duas-etapas.service";
import { PagSeguroService } from "./service/pagseguro.service";
import { NotificationService } from "./service/notification.service";

// Register locale data
registerLocaleData(localePT);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideServerRendering(),
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: "pt" },
    // Serviços da aplicação
    VariableGlobal,
    TokenService,
    LoginService,
    PessoaService,
    AnalyticsService,
    dadosConsultaService,
    PostService,
    UsuarioLogadoService,
    PagamentoService,
    FazerConsultaService,
    WebSocketService,
    ConsultaDuasEtapasService,
    PagSeguroService,
    NotificationService,
  ],
};
