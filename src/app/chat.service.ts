import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { DOCUMENT } from '@angular/platform-browser';
import {map, share} from 'rxjs/Operators';
// let CHAT_URL = 'ws://localhost:6698/';
let CHAT_URL = 'ws://192.168.0.228:6698//'; // ice-maker web service
// let CHAT_URL = 'ws://nonav.net:6698/'; 
// let CHAT_URL = 'ws://nonav.net:6688/'; // user-mananagement web service

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
  private wsservice:WebsocketService;
  constructor(wsService: WebsocketService) {
    // CHAT_URL = 'ws://' + document.location.hostname + ':6688';
    this.wsservice=this.wsservice;
    this.messages = <Subject<Message>>wsService
      .connect(CHAT_URL).pipe(map((response: MessageEvent): Message => {
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
        // console.log('return data');
        // console.log(data);
        return data;
      })).pipe(share());
  }
  getWSState(){
    let state=this.wsservice.getWSstate();
    console.log('ws satate'+state);
    return state;
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
