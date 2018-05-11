import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import * as Rx from 'rxjs';
import {Buffer} from 'buffer';

@Injectable()
export class WebsocketService {
  constructor() { }

  private subject: Rx.Subject<MessageEvent>;

  public connect(url): Rx.Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log('Successfully connected: ' + url);
    }
    return this.subject;
  }

  private create(url): Rx.Subject<MessageEvent> {
    const ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';
    const observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    }).share();
    const observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          console.log(data);
          const buf = Buffer.from(JSON.stringify(data));
          ws.send(buf);
        }
      }
    };
    return Rx.Subject.create(observer, observable);
  }
}