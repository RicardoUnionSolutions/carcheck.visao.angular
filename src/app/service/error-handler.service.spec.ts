import { TestBed } from "@angular/core/testing";
import { ErrorHandlerService } from "./error-handler.service";

describe("ErrorHandlerService", () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlerService],
    });
    service = TestBed.inject(ErrorHandlerService);
  });

  it("should log provided string message", () => {
    const logSpy = spyOn(console, "log");
    service.handle("unexpected error");
    expect(logSpy.calls.count()).toBe(1);
    expect(logSpy.calls.argsFor(0)).toEqual(["unexpected error"]);
  });

  it("should log default message and original error when error is not a string", () => {
    const logSpy = spyOn(console, "log");
    const err = { status: 500 };
    service.handle(err);
    expect(logSpy.calls.argsFor(0)).toEqual(["Ocorreu um erro", err]);
    expect(logSpy.calls.argsFor(1)).toEqual([
      "Erro ao processar serviço. Tente novamente",
    ]);
  });

  it("should treat null as non-string error and log default message", () => {
    const logSpy = spyOn(console, "log");
    service.handle(null);
    expect(logSpy.calls.argsFor(0)).toEqual(["Ocorreu um erro", null]);
    expect(logSpy.calls.argsFor(1)).toEqual([
      "Erro ao processar serviço. Tente novamente",
    ]);
  });
});

