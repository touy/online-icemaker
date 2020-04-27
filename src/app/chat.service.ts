import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
// import { DOCUMENT } from '@angular/platform-browser';
import { map, share } from 'rxjs/Operators';
import { Buffer } from 'buffer';
// let CHAT_URL = 'ws://192.168.0.228:6698//'; // ice-maker web service
// let CHAT_URL = 'ws://localhost:6698/';
let CHAT_URL = 'ws://laoapps.com:6698/'; // ice-maker web service
// let CHAT_URL = 'ws://laoapps.com:6688/'; // user-mananagement web service
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
      .connect(CHAT_URL).pipe(map((response: MessageEvent): Message => {
        // const buf = JSON.stringify(response.data);
        // console.log(response.data);
        let d;
        let data;
        // console.log();
        if (typeof (response.data) !== 'string') {
          // console.log(response.data);
          d = this.ab2str(response.data);
          try {
            data = JSON.parse(Buffer.from(d, 'base64').toString());
          } catch (error) {
            try {
              data = JSON.parse(d);
            } catch (error) {
              console.log(error);
            }

          }
        } else {
          d = response.data;
          console.log(d);
          data = d;
          // console.log('here string');
        }
        // console.log(d+'+++ AB');

        // const data = JSON.parse(response.data.tostring('utf8'));
        // console.log('return data');
        // console.log(data);
        return data;
      })).pipe(share());
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
