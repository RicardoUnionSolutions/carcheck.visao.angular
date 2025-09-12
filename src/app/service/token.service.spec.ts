import { TestBed } from "@angular/core/testing";
import { TokenService } from "./token.service";

describe("TokenService", () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenService],
    });
    service = TestBed.inject(TokenService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should decode token stored in localStorage", () => {
    localStorage.setItem("sample", "abc");
    spyOn(service.jwtHelper, "decodeToken").and.returnValue({ data: "data" });
    const decoded = service.decodeToken("sample");
    expect(decoded).toEqual({ data: "data" });
  });

  it("should return null when token missing", () => {
    const decoded = service.decodeToken("missing");
    expect(decoded).toBeNull();
  });

  it("should check token expiration", () => {
    localStorage.setItem("sample", "abc");
    spyOn(service.jwtHelper, "isTokenExpired").and.returnValue(false);
    const expired = service.isTokenExpired("sample");
    expect(service.jwtHelper.isTokenExpired).toHaveBeenCalledWith("abc");
    expect(expired).toBeFalse();
  });
});
