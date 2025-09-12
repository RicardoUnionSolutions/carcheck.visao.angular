import { HttpErrorResponse, HttpHandler, HttpHeaders, HttpRequest, HttpResponse } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { AppInterceptor } from "./app-interceptor.service";
import { LoginService } from "./service/login.service";
import { ModalService } from "./service/modal.service";

class LoginServiceStub {
  constructor(private token: string | null = "jwt-token") {}
  setToken(token: string | null) {
    this.token = token;
  }
  getTokenLogin() {
    return this.token;
  }
  getLogIn() {
    return of(null);
  }
  logOut() {}
}

class ModalServiceStub {
  openModalMsg(_: any) {}
}

describe("AppInterceptor", () => {
  const baseUrl = "http://api.test";
  let interceptor: AppInterceptor;
  let loginSvc: LoginServiceStub;
  let modalSvc: ModalServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppInterceptor,
        { provide: LoginService, useClass: LoginServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
      ],
    });
    interceptor = TestBed.inject(AppInterceptor);
    loginSvc = TestBed.inject(LoginService) as any;
    modalSvc = TestBed.inject(ModalService) as any;
  });

  it("should add Authorization header when token exists", (done) => {
    const req = new HttpRequest("GET", `${baseUrl}/resource`);
    const handler: HttpHandler = {
      handle: (request: HttpRequest<any>) => {
        expect(request.headers.get("Authorization")).toBe("jwt-token");
        return of(new HttpResponse({ status: 200 }));
      },
    };
    interceptor.intercept(req, handler).subscribe(() => done());
  });

  it("should not add Authorization header when token is missing", (done) => {
    loginSvc.setToken(null);
    const req = new HttpRequest("GET", `${baseUrl}/resource`);
    const handler: HttpHandler = {
      handle: (request: HttpRequest<any>) => {
        expect(request.headers.has("Authorization")).toBeFalsy();
        return of(new HttpResponse({ status: 200 }));
      },
    };
    interceptor.intercept(req, handler).subscribe(() => done());
  });

  it("should call getServerMsg and hasServerError for JSON responses", (done) => {
    const req = new HttpRequest("GET", `${baseUrl}/resource`);
    const handler: HttpHandler = {
      handle: () => of(new HttpResponse({ status: 200, body: {} })),
    };
    const msgSpy = spyOn(interceptor as any, "getServerMsg").and.callThrough();
    const errSpy = spyOn(
      interceptor as any,
      "hasServerError"
    ).and.callThrough();

    interceptor.intercept(req, handler).subscribe(() => {
      expect(msgSpy).toHaveBeenCalled();
      expect(errSpy).toHaveBeenCalled();
      done();
    });
  });

  it("should not call getServerMsg and hasServerError for non-JSON responseType", (done) => {
    const req = new HttpRequest("GET", `${baseUrl}/resource`, null, {
      responseType: "blob" as const, // Using blob as non-JSON response type
    });

    const handler: HttpHandler = {
      handle: () => of(new HttpResponse({ 
        status: 200, 
        body: new Blob(),
        headers: new HttpHeaders({ 'content-type': 'application/octet-stream' })
      })),
    };

    const msgSpy = spyOn(interceptor as any, "getServerMsg").and.callThrough();
    const errSpy = spyOn(interceptor as any, "hasServerError").and.callThrough();

    interceptor.intercept(req, handler).subscribe({
      next: () => {
        // These methods should not be called for non-JSON responses
        expect(msgSpy).not.toHaveBeenCalled();
        expect(errSpy).not.toHaveBeenCalled();
        done();
      },
      error: (err) => {
        fail(`Should not error: ${err}`);
        done();
      }
    });
  });

  it("should open modal with server message", () => {
    const modalSpy = spyOn(modalSvc, "openModalMsg");
    const response = new HttpResponse({
      body: { serverMsg: { status: 2, titulo: "t", descricao: "d" } },
    });

    (interceptor as any).getServerMsg(response);

    expect(modalSpy).toHaveBeenCalledWith({
      status: 2,
      title: "t",
      text: "d",
      cancel: { show: false },
      ok: { status: -1, text: "Fechar" },
    });
  });

  it("should open modal with default values when serverMsg fields are missing", () => {
    const modalSpy = spyOn(modalSvc, "openModalMsg");
    const response = new HttpResponse({ body: { serverMsg: {} } });

    (interceptor as any).getServerMsg(response);

    expect(modalSpy).toHaveBeenCalledWith({
      status: 4,
      title: "",
      text: "",
      cancel: { show: false },
      ok: { status: -1, text: "Fechar" },
    });
  });

  it("should not open modal when serverMsg is not an object", () => {
    const modalSpy = spyOn(modalSvc, "openModalMsg");
    const response = new HttpResponse({ body: { serverMsg: "error" } });

    (interceptor as any).getServerMsg(response);

    expect(modalSpy).not.toHaveBeenCalled();
  });

  it("should not open modal when serverMsg is missing", () => {
    const modalSpy = spyOn(modalSvc, "openModalMsg");
    const response = new HttpResponse({ body: {} });

    (interceptor as any).getServerMsg(response);

    expect(modalSpy).not.toHaveBeenCalled();
  });

  it("should not throw when serverMsg is missing", () => {
    const response = new HttpResponse({ body: {} });

    expect(() => (interceptor as any).hasServerError(response)).not.toThrow();
  });

  it("should not throw when response body is absent", () => {
    const response = new HttpResponse({});

    expect(() => (interceptor as any).hasServerError(response)).not.toThrow();
  });

  it("should throw HttpErrorResponse when serverError is true", () => {
    const response = new HttpResponse({
      url: `${baseUrl}/resource`,
      headers: new HttpHeaders(),
      status: 200,
      body: { serverMsg: {}, serverError: true },
    });

    try {
      (interceptor as any).hasServerError(response);
      fail("should have thrown");
    } catch (err) {
      expect(err instanceof HttpErrorResponse).toBeTruthy();
      expect(err.statusText).toBe("APP_SERVER_ERROR");
    }
  });

  it("should not throw when serverError is false", () => {
    const response = new HttpResponse({
      url: `${baseUrl}/resource`,
      headers: new HttpHeaders(),
      status: 200,
      body: { serverMsg: {}, serverError: false },
    });

    expect(() => (interceptor as any).hasServerError(response)).not.toThrow();
  });

  it("should handle 401 error by logging out and showing modal", (done) => {
    const modalSvcSpy = jasmine.createSpyObj<ModalService>("ModalService", [
      "openModalMsg",
    ]);
    const loginSvcSpy = jasmine.createSpyObj<LoginService>("LoginService", [
      "getTokenLogin",
      "getLogIn",
      "logOut",
    ]);

    loginSvcSpy.getTokenLogin.and.returnValue("jwt-token");
    loginSvcSpy.getLogIn.and.returnValue(of(null));

    const interceptor = new AppInterceptor(loginSvcSpy, modalSvcSpy);

    const req = new HttpRequest("GET", `${baseUrl}/resource`);
    const handler: HttpHandler = {
      handle: () => throwError(new HttpErrorResponse({ status: 401 })),
    };

    interceptor.intercept(req, handler).subscribe({
      next: () => done.fail("Should have errored"),
      error: () => {
        expect(modalSvcSpy.openModalMsg).toHaveBeenCalled();
        expect(loginSvcSpy.logOut).toHaveBeenCalled();
        done();
      },
    });
  });

  it("should return original response when no error or serverMsg is present", (done) => {
    const req = new HttpRequest("GET", `${baseUrl}/resource`);
    const expectedResponse = new HttpResponse({ status: 200, body: {} });

    const handler: HttpHandler = {
      handle: () => of(expectedResponse),
    };

    interceptor.intercept(req, handler).subscribe((res) => {
      expect(res).toBe(expectedResponse);
      done();
    });
  });

  it("should rethrow non-401 errors without triggering logout or modal", (done) => {
    const modalSpy = spyOn(modalSvc, "openModalMsg");
    const logoutSpy = spyOn(loginSvc, "logOut");

    const req = new HttpRequest("GET", `${baseUrl}/resource`);
    const handler: HttpHandler = {
      handle: () => throwError(new HttpErrorResponse({ status: 500 })),
    };

    interceptor.intercept(req, handler).subscribe({
      next: () => done.fail("Should have errored"),
      error: () => {
        expect(modalSpy).not.toHaveBeenCalled();
        expect(logoutSpy).not.toHaveBeenCalled();
        done();
      },
    });
  });
});
