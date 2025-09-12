import { createWebSocket } from "./web-socket-wrapper";

describe("web-socket-wrapper", () => {
  it("should create a WebSocketSubject", () => {
    const url = "ws://example";
    const result = createWebSocket(url);
    expect(result).toBeTruthy();
  });
});
