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

  it("should store and retrieve token", () => {
    service.setToken("abc");
    expect(service.getToken()).toBe("abc");
  });

  it("should decode user from token", () => {
    const user = { name: "john" };
    spyOn(service as any, "decode").and.returnValue({ iss: JSON.stringify(user) });
    expect(service.getUserFromToken("token")).toEqual(user);
  });

  it("should return null for invalid token", () => {
    spyOn(service as any, "decode").and.returnValue(null);
    expect(service.getUserFromToken("token")).toBeNull();
  });
});
