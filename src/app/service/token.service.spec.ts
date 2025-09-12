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
    spyOn((service as any).jwtHelper, "decodeToken").and.returnValue({ foo: "bar" });
    const decoded = service.decodeToken("sample");
    expect(decoded).toEqual({ foo: "bar" });
  });

  it("should return null when token missing", () => {
    const decoded = service.decodeToken("missing");
    expect(decoded).toBeNull();
  });

  it("should parse user from iss field", () => {
    spyOn(service, "decodeToken").and.returnValue({ iss: JSON.stringify({ name: "john" }) });
    const user = service.getUserFromToken();
    expect(service.decodeToken).toHaveBeenCalled();
    expect(user).toEqual({ name: "john" });
  });
});
