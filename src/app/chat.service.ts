import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable, Subject } from 'rxjs';
import { DOCUMENT } from '@angular/platform-browser';
import { WebsocketService } from './websocket.service';
import { map } from "rxjs/operators";
let CHAT_URL = 'ws://nonav.ent:6688/'; // user web service
export interface Message {
  gui: string;
  username: string;
  logintoken: string;
  logintime: string;
  loginip: string;
  data: any;
}

@Injectable()
export class ChatService {
  public messages: Subject<Message>;
  constructor(wsService: WebsocketService) {
    // CHAT_URL = 'ws://' + document.location.hostname + ':6688';
    this.messages = <Subject<Message>>wsService
      .connect(CHAT_URL).pipe(
      map((response: MessageEvent): Message => {
        // const buf = JSON.stringify(response.data);
        // console.log(response.data);
        let d;
        // console.log();
        if (typeof (response.data) !== 'string') {
          d = this.ab2str(response.data);
        } else {
          d = response.data;
          // console.log('here string');
        }
        // console.log(d+'+++ AB');
        const data = JSON.parse(d);
        return data;
      }));
  }
  seturl(url) {
    CHAT_URL = url;
  }
  ab2str(arrayBuffer) {
    let
      binaryString = '';
    const
      bytes = new Uint8Array(arrayBuffer),
      length = bytes.length;
    for (let i = 0; i < length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return binaryString;
  }
}