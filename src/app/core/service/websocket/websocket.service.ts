import { Injectable } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { delayWhen, retryWhen, tap } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { L1Update } from '../../../shared/interface/realtime-update.interface';
 

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private wsUrl = 'wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=';
  private socket$?: WebSocketSubject<any>;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectDelay = 2000;

  private messageSubject = new Subject<L1Update>();
  public messages$ = this.messageSubject.asObservable();
  private manualDisconnect = false;

  connect(token: string): void {
    this.manualDisconnect = false;
    if (this.socket$) {
      this.disconnect();
    }
    this.socket$ = webSocket({
      url: `${this.wsUrl}${token}`,
      openObserver: { next: () => { this.reconnectAttempts = 0; } },
      closeObserver: { next: () => {
        if (!this.manualDisconnect) {
          this.handleReconnect(token);
        }
      } }
    });

    this.socket$.pipe(
      retryWhen(errors =>
        errors.pipe(
          tap(() => this.reconnectAttempts++),
          delayWhen(() => timer(this.reconnectDelay * this.reconnectAttempts)),
          tap(() => {
            if (this.reconnectAttempts > this.maxReconnectAttempts) {
              throw new Error('Max reconnect attempts reached');
            }
          })
        )
      )
    ).subscribe({
      next: msg => this.messageSubject.next(msg),
      error: err => this.messageSubject.error(err)
    });
  }

  disconnect(): void {
    this.manualDisconnect = true;
    this.socket$?.complete();
    this.socket$ = undefined;
  }

  send(data: any): void {
    this.socket$?.next(data);
  }

  public isConnected(): boolean {
    return !!this.socket$;
  }

  private handleReconnect(token: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.connect(token);
    }
  }
  
  transformL1UpdateToChartData(update: L1Update): any | null {
    if (update.last) {
      return {
        t: update.last.timestamp,
        o: update.last.price,  
        h: update.last.price,
        l: update.last.price,
        c: update.last.price,
        v: update.last.volume
      };
    }
    
    return null;
  }
}
