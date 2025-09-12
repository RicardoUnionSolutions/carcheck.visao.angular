import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { LoginService } from "./service/login.service";
import { Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { ModalService, MODAL_MSG } from "./service/modal.service";
import { Router } from '@angular/router';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(
    private login: LoginService,
    private modalService: ModalService,
    private router: Router
  ) {
    this.login.getLogIn();
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.login.getTokenLogin();
    if (token && !req.headers.has("Authorization")) {
      req = req.clone({
        setHeaders: { Authorization: token },
      });
    }
    return next
      .handle(req)
      .pipe(
        map((r) => {
          const VALID_RESPONSE = r && r instanceof HttpResponse;
          const REQ_JSON = req.responseType == "json";

          if (VALID_RESPONSE && REQ_JSON) {
            this.getServerMsg(r);
            this.hasServerError(r);
          }

          return r;
        })
      )
      .pipe(
        catchError((r) => {
          const hasToken = !!this.login.getTokenLogin();
          if (hasToken && r && r instanceof HttpErrorResponse && r.status == 401) {
            let modalMsg: MODAL_MSG = {
              status: 4,
              title: "Sessão expirou",
              text: "Faça o login novamente",
              cancel: { show: false },
              ok: { status: -1, text: "Fechar" },
            };
            this.modalService.openModalMsg(modalMsg);
            this.login.logOut();
            this.router.navigate(['/login']);
          }
          throw r;
        })
      );
  }

  hasServerError(response) {
    if (!response.body || !response.body.serverMsg) return;
    if (response.body.serverError)
      throw new HttpErrorResponse({
        url: response.url,
        headers: response.headers,
        status: response.status || 518,
        statusText: "APP_SERVER_ERROR",
        error: response.body,
      });
  }

  getServerMsg(response) {
    if (!response.body || !response.body.serverMsg) return;
    let msg = response.body.serverMsg;
    if (!msg || typeof msg !== "object") return;

    let modalMsg: MODAL_MSG = {
      status: msg.status || 4,
      title: msg.titulo || "",
      text: msg.descricao || "",
      cancel: { show: false },
      ok: { status: -1, text: "Fechar" },
    };
    this.modalService.openModalMsg(modalMsg);
  }
}
