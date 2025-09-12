import { TestBed } from "@angular/core/testing";
import { LOCALE_ID } from "@angular/core";
import { LoginService } from "./login.service";
import { ModalService } from "./modal.service";
import { TokenService } from "./token.service";

class ModalServiceStub {
  openModalMsg() {}
  openLoading() {}
}

describe("LoginService", () => {
  let service: LoginService;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginService,
        { provide: LOCALE_ID, useValue: "en-US" },
        { provide: ModalService, useClass: ModalServiceStub },
        TokenService,
      ],
    });
    service = TestBed.inject(LoginService);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should decode valid token and set user as logged in", () => {
    const user = {
      status: false,
      cliente: { documento: "123", dataNascimento: "2000-01-01" },
      nome: "John",
    };
    spyOn(tokenService, "decodeTokenFromString").and.returnValue(user);
    service.logIn("token");
    service.getLogIn().subscribe((v) => expect(v.status).toBeTruthy());
    expect(localStorage.getItem("tokenLogin")).toBe("token");
  });

  it("should logout and clear token from storage", () => {
    localStorage.setItem("tokenLogin", "token");
    service.logOut();
    service.getLogIn().subscribe((v) => expect(v.status).toBeFalsy());
    expect(localStorage.getItem("tokenLogin")).toBeNull();
  });

  it("should return false when decoding null token", () => {
    expect(service.decodeToken(null)).toBeFalsy();
  });

  it("should retrieve token from localStorage", () => {
    localStorage.setItem("tokenLogin", "abc");
    expect(service.getTokenLogin()).toBe("abc");
  });

  it('should treat string "null" token as null', () => {
    localStorage.setItem("tokenLogin", "null");
    expect(service.getTokenLogin()).toBeNull();
  });

  it('should not overwrite existing token when provided token is "null"', () => {
    localStorage.setItem("tokenLogin", "existing");
    spyOn(service, "decodeToken").and.returnValue(false);
    service.logIn("null");
    expect(localStorage.getItem("tokenLogin")).toBe("existing");
  });

  it("should expose email and telefone after login", () => {
    const user = {
      status: false,
      email: "john@example.com",
      cliente: {
        documento: "123",
        dataNascimento: "2000-01-01",
        telefone: "9999",
      },
      nome: "John",
    };
    spyOn(tokenService, "decodeTokenFromString").and.returnValue(user);
    service.logIn("token");
    expect(service.getEmail()).toBe("john@example.com");
    expect(service.getTelefone()).toBe("9999");
  });

  it("should set statusCadastro as COMPLETO and format birth date", () => {
    const user = {
      status: false,
      email: "john@example.com",
      cliente: {
        documento: "123",
        dataNascimento: "2000-01-01",
        telefone: "9999",
        clienteAntigo: false,
      },
      nome: "John",
    };
    spyOn(tokenService, "decodeTokenFromString").and.returnValue(user);
    service.logIn("token");
    service.getLogIn().subscribe((v) => {
      expect(v.statusCadastro).toBe("COMPLETO");
      expect(v.cliente.dataNascimento).toBe("01/01/2000");
    });
  });

  it("should set statusCadastro as INCOMPLETO when user data is missing", () => {
    const user = {
      status: false,
      nome: "",
      cliente: { documento: "", dataNascimento: null, telefone: "" },
    };
    spyOn(tokenService, "decodeTokenFromString").and.returnValue(user);
    service.logIn("token");
    service
      .getLogIn()
      .subscribe((v) => expect(v.statusCadastro).toBe("INCOMPLETO"));
  });

  it("should set statusCadastro as INCOMPLETO if clienteAntigo is true", () => {
    const user = {
      status: false,
      nome: "John",
      cliente: {
        documento: "123",
        dataNascimento: "2000-01-01",
        telefone: "1",
        clienteAntigo: true,
      },
    };
    spyOn(tokenService, "decodeTokenFromString").and.returnValue(user);
    service.logIn("token");
    service
      .getLogIn()
      .subscribe((v) => expect(v.statusCadastro).toBe("INCOMPLETO"));
  });

  it("should logout when decodeToken returns false", () => {
    spyOn(service, "decodeToken").and.returnValue(false);
    service.logIn("token");
    service.getLogIn().subscribe((v) => expect(v.status).toBeFalsy());
  });

  it("should handle decodeToken errors by logging out", () => {
    const logoutSpy = spyOn(service, "logOut").and.callThrough();
    spyOn(service, "decodeToken").and.throwError("invalid");
    service.logIn("token");
    expect(logoutSpy).toHaveBeenCalled();
    expect(localStorage.getItem("tokenLogin")).toBeNull();
  });
});
