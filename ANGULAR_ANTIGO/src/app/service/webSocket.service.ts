import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: WebSocketSubject<any>;

  constructor() {
  }

  public openWebSocket () {
    this.socket = webSocket(environment.webSocketUrl);
  }

  public sendMessage(message: any): void {
    this.socket.next(message);
  }

  public getMessages(): Observable<any> {
    return this.socket.asObservable();
  }

  closeWebSocket() {
    if (this.socket) {
     this.socket.complete();
    }
  }
}
