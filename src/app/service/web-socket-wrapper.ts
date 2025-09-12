import { webSocket, WebSocketSubject } from "rxjs/webSocket";

export function createWebSocket<T>(url: string): WebSocketSubject<T> {
  return webSocket<T>(url);
}
