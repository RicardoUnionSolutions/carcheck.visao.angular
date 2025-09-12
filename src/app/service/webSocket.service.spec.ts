import { TestBed } from "@angular/core/testing";
import { WebSocketService } from "./webSocket.service";
import { WebSocketSubject } from "rxjs/webSocket";
import { of } from "rxjs";
import { environment } from "../../environments/environment";

describe("WebSocketService", () => {
  let service: WebSocketService;
  let mockSocket: jasmine.SpyObj<WebSocketSubject<any>>;

  beforeEach(() => {
    mockSocket = jasmine.createSpyObj("WebSocketSubject", [
      "next",
      "complete",
      "asObservable",
    ]);
    mockSocket.asObservable.and.returnValue(of("mensagem"));

    TestBed.configureTestingModule({
      providers: [WebSocketService],
    });

    service = TestBed.inject(WebSocketService);
    (service as any).socket = mockSocket;
  });

  afterEach(() => {
    service.closeWebSocket();
  });

  it("should create socket when openWebSocket is called without existing socket", () => {
    (service as any).socket = null;
    const createSpy = spyOn<any>(service, "create").and.returnValue(mockSocket);
    service.openWebSocket();
    expect(createSpy).toHaveBeenCalledWith(environment.webSocketUrl);
    expect((service as any).socket).toBe(mockSocket);
  });

  it("should not create a new socket if one already exists", () => {
    const createSpy = spyOn<any>(service, "create");
    service.openWebSocket();
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("should send messages through socket", () => {
    const message = { text: "test" };
    service.sendMessage(message);
    expect(mockSocket.next).toHaveBeenCalledWith(message);
  });

  it("should expose messages as observable", (done) => {
    const result = service.getMessages();
    expect(result).toBeTruthy();
    result?.subscribe((msg) => {
      expect(msg).toBe("mensagem");
      done();
    });
  });

  it("should close socket when closeWebSocket is called", () => {
    service.closeWebSocket();
    expect(mockSocket.complete).toHaveBeenCalled();
  });

  it("should not throw if closeWebSocket is called without socket", () => {
    (service as any).socket = null;
    expect(() => service.closeWebSocket()).not.toThrow();
  });
});
