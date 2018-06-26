import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import * as Rx from 'rxjs';
import { Buffer } from 'buffer';
// import { share } from 'rxjs/Operators';
@Injectable()
export class WebsocketService {
  constructor() { }

  private subject: Rx.Subject<MessageEvent>;
  private ws: WebSocket;
  private url: string;
  public connect(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Successfully connected: ' + url);
    }
    return this.subject;
  }

  private create(url): Rx.Subject<MessageEvent> {
    this.ws = new WebSocket(url);
    this.url = url;
    this.ws.binaryType = 'arraybuffer';
    const observable =
      Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
        this.ws.onmessage = obs.next.bind(obs);
        this.ws.onerror = obs.error.bind(obs);
        this.ws.onclose = obs.complete.bind(obs);
        return this.ws.close.bind(this.ws);
      });
    const observer = {
      next: (data: Object) => {
        if (this.ws.readyState === WebSocket.OPEN) {
          console.log('state: ' + this.ws.readyState);
          // if (this.ws.readyState !== 1) {
          //   console.log('reconnecting ');
          //   this.create(this.url);
          // }
          // console.log(data);
          const buf = Buffer.from(Buffer.from(JSON.stringify(data)).toString('base64'));
          this.ws.send(buf);
        }
      }
    };
    return Rx.Subject.create(observer, observable);
  }
}
