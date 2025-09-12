import { TestBed, waitForAsync } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NavigationEnd, NavigationCancel, Router } from "@angular/router";
import { BehaviorSubject, Subject, of } from "rxjs";

import { AppComponent } from "./app.component";
import { ModalService } from "./service/modal.service";
import { LoginService } from "./service/login.service";
import { AnalyticsService } from "./service/analytics.service";
import { PessoaService } from "./service/pessoa.service";

class ModalServiceStub {}

class LoginServiceStub {
  private loginSubject = new BehaviorSubject<any>({ status: false });
  getLogIn() {
    return this.loginSubject.asObservable();
  }
  emitLogin(value: any) {
    this.loginSubject.next(value);
  }
}

class RouterStub {
  events = new Subject<any>();
}

class PessoaServiceStub {
  agendarEmailMarketing() {
    return of({});
  }
}

describe("AppComponent", () => {
  let loginService: LoginServiceStub;
  let router: RouterStub;
  let analyticsService: jasmine.SpyObj<AnalyticsService>;

  beforeEach(waitForAsync(() => {
    analyticsService = jasmine.createSpyObj("AnalyticsService", [
      "atualizacaoPagina",
    ]);

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: LoginService, useClass: LoginServiceStub },
        { provide: AnalyticsService, useValue: analyticsService },
        { provide: PessoaService, useClass: PessoaServiceStub },
        { provide: Router, useClass: RouterStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    loginService = TestBed.inject(LoginService) as any;
    router = TestBed.inject(Router) as any;
  }));

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should have paddingLogin false by default", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.login.status).toBeFalsy();
    expect(app.paddingLogin).toBeFalsy();
  });

  it('should have default title "app"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBe("app");
  });

  it("should set paddingLogin true when user logs in", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    loginService.emitLogin({ status: true });
    expect(app.paddingLogin).toBeTruthy();
  });

  it("should update currentUrl and call analytics on navigation", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    router.events.next(new NavigationEnd(1, "/consulta", "/consulta"));
    expect(app.currentUrl).toBe("consulta");
    expect(app.paddingLogin).toBeTruthy();
    expect(analyticsService.atualizacaoPagina).toHaveBeenCalledWith(
      "/consulta"
    );
  });

  it("should ignore router events other than NavigationEnd", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    router.events.next(new NavigationCancel(1, "/foo", ""));
    expect(analyticsService.atualizacaoPagina).not.toHaveBeenCalled();
    expect(app.currentUrl).toBe("");
    expect(app.paddingLogin).toBeFalsy();
  });

  it("should set paddingLogin to true when currentUrl is consulta even if not logged in", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.login = { status: false } as any;
    app.currentUrl = "consulta";
    app.updatePaddingLoginBar();
    expect(app.paddingLogin).toBeTruthy();
  });

  it("should not set paddingLogin if not logged and not in consulta", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.login = { status: false } as any;
    app.currentUrl = "";
    app.updatePaddingLoginBar();
    expect(app.paddingLogin).toBeFalsy();
  });

  it("should set paddingLogin if logged in and not in consulta", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.login = { status: true } as any;
    app.currentUrl = "";
    app.updatePaddingLoginBar();
    expect(app.paddingLogin).toBeTruthy();
  });
});
