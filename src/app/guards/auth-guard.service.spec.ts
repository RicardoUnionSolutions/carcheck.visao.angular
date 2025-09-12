import { AuthGuardService } from "./auth-guard.service";
import { LoginService } from "../service/login.service";
import { Router } from "@angular/router";
import { VariableGlobal } from "../service/variable.global.service";
import { BehaviorSubject } from "rxjs";

describe("AuthGuardService", () => {
  let guard: AuthGuardService;
  let loginSubject: BehaviorSubject<any>;
  let loginService: jasmine.SpyObj<LoginService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    loginSubject = new BehaviorSubject({
      status: true,
      cliente: { documento: "" },
    });

    loginService = jasmine.createSpyObj<LoginService>("LoginService", [
      "getLogIn",
      "logOut",
    ]);
    loginService.getLogIn.and.returnValue(loginSubject.asObservable());

    router = jasmine.createSpyObj<Router>("Router", ["navigate"]);

    guard = new AuthGuardService(loginService, router, new VariableGlobal());
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  it("should reflect login service updates", () => {
    loginSubject.next({ status: false, cliente: { documento: "123" } });
    expect(guard.user).toEqual({
      status: false,
      cliente: { documento: "123" },
    });
  });

  it("should allow activation when user is logged in", () => {
    const result = guard.canActivate({ url: [] } as any, null as any);
    expect(result).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(loginService.logOut).not.toHaveBeenCalled();
  });

  it("should redirect to home when user is not logged in", () => {
    loginSubject.next({ status: false, cliente: { documento: "" } });
    const result = guard.canActivate({ url: [] } as any, null as any);
    expect(result).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(["home"]);
    expect(loginService.logOut).not.toHaveBeenCalled();
  });

  it("should call logOut when route contains logout segment (case-insensitive)", () => {
    const result = guard.canActivate(
      { url: [{ path: "logout" }] } as any,
      null as any
    );
    expect(loginService.logOut).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it("should call logOut for logout paths with mixed case and slashes", () => {
    const result = guard.canActivate(
      { url: [{ path: "/LoGoUt" }] } as any,
      null as any
    );
    expect(loginService.logOut).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it("should logOut and redirect when user is not logged in and url contains logout", () => {
    loginSubject.next({ status: false, cliente: { documento: "" } });
    const result = guard.canActivate(
      { url: [{ path: "logout" }] } as any,
      null as any
    );
    expect(result).toBeFalsy();
    expect(loginService.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["home"]);
  });

  it("should not logOut for unrelated paths", () => {
    const result = guard.canActivate(
      { url: [{ path: "dashboard" }] } as any,
      null as any
    );
    expect(loginService.logOut).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
