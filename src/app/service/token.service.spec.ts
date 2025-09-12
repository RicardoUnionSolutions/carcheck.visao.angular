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
    spyOn(service.jwtHelper, "decodeToken").and.returnValue({ iss: "data" });
    const decoded = service.decodeToken("sample");
    expect(decoded).toBe("data");
  });

  it("should return null when token missing", () => {
    const decoded = service.decodeToken("missing");
    expect(decoded).toBeNull();
  });
});
