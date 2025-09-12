import { Injectable } from "@angular/core";
import { WebSocketSubject } from "rxjs/webSocket";
import { environment } from "../../environments/environment";
import { createWebSocket } from "./web-socket-wrapper";

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private socket: WebSocketSubject<any> | null = null;

  protected create(url: string) {
    return createWebSocket(url);
  }

  openWebSocket(): void {
    if (!this.socket) {
      this.socket = this.create(environment.webSocketUrl);
    }
  }

  sendMessage(msg: any): void {
    this.socket?.next(msg);
  }

  getMessages() {
    return this.socket?.asObservable();
  }

  closeWebSocket(): void {
    this.socket?.complete();
    this.socket = null;
  }
}
