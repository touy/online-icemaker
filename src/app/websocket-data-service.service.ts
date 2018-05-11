import { Injectable, OnInit } from '@angular/core';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BehaviorSubject } from 'rxjs'
import { Observable } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { ChatService, Message } from './chat.service';
import { v4 as uuid } from 'uuid';
import { Moment } from 'moment';
import * as moment from 'moment-timezone';
import * as $PouchDB from 'pouchdb';
const PouchDB = $PouchDB['default'];
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable()
export class WebsocketDataServiceService implements OnInit {

  private _title = 'Websocket test';
  private _url: string;
  private _message: any;
  private _newUser: any;
  private _loginUser = { usrname: '', password: '' };
  private _currentUserdetail: any;
  private _server_event: any = [];
  private _moment: Moment;
  private _pouch: PouchDB.Database;
  private _client: Message = {
    gui: '',
    username: '',
    logintoken: '',
    logintime: '',
    loginip: '',
    data: {}
  };
  private _otherMessage: any;

  public clientSource = new BehaviorSubject<Message>(this._client);
  public newUserSource = new BehaviorSubject<Message>(this._newUser);
  public currentUserSource = new BehaviorSubject<any>(this._currentUserdetail);
  public eventSource = new BehaviorSubject<any>(this._server_event);
  public otherSource = new BehaviorSubject<any>(this._otherMessage);
  // private currentMessage = this.clientSource.asObservable();
  // private serverEvent = this.eventSource.asObservable();
  heartbeat_interval = setInterval(() => {
    console.log(this._client);
    if (!this._client.gui) {
      console.log('ERROR no shake hands');
      return;
    }
    const firstHeartBeat = sessionStorage.getItem('firstHeartBeat');
    // if (this.heartbeat_interval === undefined) {
    //   return;
    // }
    // console.log('first heart beat' + firstHeartBeat);
    if (firstHeartBeat !== this.heartbeat_interval + '' && firstHeartBeat) {
      this.stopService();
      return;
    }
    // console.log('heartbeat ' + this.heartbeat_interval);
    sessionStorage.setItem('firstHeartBeat', this.heartbeat_interval + '');
    // // alert(sessionStorage.getItem('firstThread') + ' heartbeat');
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data = {};
    this._message.data['user'] = {};
    this._message.data['command'] = 'heart-beat';
    this._message.data['command2'] = 'interval ' + this.heartbeat_interval;
    this.sendMsg();
  }, 1000 * 60);
  timeOut_runner = setTimeout(() => {
    this.shakeHands();
  }, 1000 * 1);

  public refreshNewUserMessage() {

    this.newUserSource.next(this._newUser);
  }
  public refreshOtherMessage() {
    this.otherSource.next(this._otherMessage);
  }
  public refreshClient() {
    this.clientSource.next(this._client);
  }
  public refreshServerEvent() {
    this.eventSource.next(this._server_event);
  }
  public refreshUserDetails() {
    this.currentUserSource.next(this._currentUserdetail);
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    // console.log('init');
    if (!this._client.data['user'] || this._client.data['user'] === undefined) {
      this._client.data['user'] = {};
    }
    this._message = JSON.parse(JSON.stringify(this._client));
  }
  constructor(private chatService: ChatService, private sanitizer: DomSanitizer) {
    this._pouch = new PouchDB('_client');
    chatService.messages.subscribe(msg => {
      const d = msg;
      // // alert(d);
      if (d !== undefined) {
        if (d['command'] !== undefined) {
          console.log('changed from server');
          // console.log(d['command'] + d['command2']);
          this._server_event.push(d);
          this.refreshServerEvent();
          // console.log(d);
          switch (d['command']) {
            case 'notification-changed':
              console.log(d);
              if (d['client']['data']['command'] === 'send-sms') {
                console.log(d['client'].data.message);
              }
              if (d['client']['data']['command'] === 'received-sms') {
                console.log(d['client'].data.message);
                if (d['client']['data']['sms'] !== undefined) {
                  console.log('SMS');
                  console.log(d['client']['data']['res'].resultDesc);
                  console.log(d['client']['data']['res'].msisdn);
                }
              }
              if (d['client']['data']['command'] === 'send-topup') {
                console.log(d['client'].data.message);
              }
              if (d['client']['data']['command'] === 'received-topup') {
                console.log(d['client'].data.message);
                if (d['client']['data']['topup'] !== undefined) {
                  console.log('topup');
                  console.log(d['client']['data']['res'].resultDesc);
                  console.log(d['client']['data']['res'].msisdn);
                }
              }
              if (d['client']['data']['command'] === 'send-check-balance') {
                console.log(d['client'].data.message);
              }
              if (d['client']['data']['command'] === 'received-check-balance') {
                console.log(d['client'].data.message);
                if (d['client']['data']['checkbalance'] !== undefined) {
                  console.log('topup');
                  console.log(d['client']['data']['res'].resultDesc);
                  console.log(d['client']['data']['res'].msisdn);
                }
              }
              break;
            case 'error-changed':
              console.log(d);
              break;
            case 'msg-changed':
              console.log(d['msg']);
              break;
            case 'login-changed':
              console.log(d);
              break;
            case 'message-changed':
              // console.log(d['client']['data']['message']);
              break;
            case 'forgot-changed':
              console.log(d);
              break;
            case 'phone-changed':
              console.log(d);
              break;
            case 'secret-changed':
              console.log(d);
              break;
            case 'online-changed':
              console.log(d);
              break;

            default:
              break;
          }
          // // console.log(msg);
        } else {
          this._client = msg;
          this.refreshClient();
          // console.log('return from server');
          console.log(msg);
          // console.log(this._client.data['command'] + this._client.data['command2']);
          switch (this._client.data['command']) {
            case 'heart-beat':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // this._client.data['user'] = u;
                this.setClient(this._client);
              }
              break;
            case 'ping':
              // console.log('ping');
              // // alert(this._client.data['message']);
              break;
            case 'login':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // console.log('LOGIN OK');
                this.setClient(this._client);
              }
              break;
            case 'get-client':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // console.log('get-client OK');
                this.setClient(this._client);
              }
              break;
            case 'shake-hands':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // // console.log(this._client);
                // console.log(this._client.data['message']);
              } else {
                // console.log('shake hands ok');
                this.setClient(this._client);
              }
              break;
            case 'logout':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // console.log('LOGOUT OK');
                this.setClient(this._client);
              }
              break;
            case 'get-profile':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // // console.log(this._client.data['user']);
                const u = JSON.parse(JSON.stringify(msg.data['user']));
                this._currentUserdetail = u;
                // console.log('refesh user details');
                this.refreshUserDetails();
              }
              break;
            case 'change-password':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // // alert('change password OK');
              }
              break;
            case 'get-transaction':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // // alert('change password OK');
              }
              break;
            case 'check-transaction':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // // alert('change password OK');
              }
              break;
            case 'check-forgot':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // // alert(this._client.data['message']);
              }
              break;
            case 'reset-forgot':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // // alert(this._client.data['message']);
              }
              break;
            case 'submit-forgot':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // // alert(this._client.data['message']);
                this._currentUserdetail = this._client.data['user'];
                this.refreshUserDetails();
              }
              break;
            case 'get-user-gui':
              // console.log('here get user gui ');
              // // console.log(this._client);
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // // alert(this._client.data['user'].gui);
              }
              break;
            case 'check-phonenumber':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                // // alert(this._client.data['user'].gui);
                this._newUser.data = this._client.data;
                this.refreshNewUserMessage();
              }
              break;
            case 'check-username':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                this._newUser.data = this._client.data;
                this.refreshNewUserMessage();
              }
              break;
            case 'check-secret':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                this._newUser.data = this._client.data;
                this.refreshNewUserMessage();
              }
              break;
            case 'get-secret':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                this._newUser.data = this._client.data;
                this.refreshNewUserMessage();
              }
              break;
            case 'register':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                this._newUser.data = this._client.data;
                this.refreshNewUserMessage();
              }
              break;
            case 'send-confirm-phone-sms':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                this._currentUserdetail = this._client.data['user'];
                this.refreshUserDetails();
              }
              break;
            case 'check-confirm-phone-sms':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                this._currentUserdetail = this._client.data['user'];
                this.refreshUserDetails();
              }
              break;
            case 'update-confirm-phone-sms':
              if (this._client.data['message'].toLowerCase().indexOf('error') > -1) {
                // console.log(this._client.data['message']);
              } else {
                console.log(this._client.data['message']);
              }
              break;
            default:
              break;
          }
          // console.log(this.heartbeat_interval);
          // console.log(this._client);
          // if (evt.data != '.') $('#output').append('<p>'+evt.data+'</p>');
        }
      } else {
        // alert('data empty');
      }
      // // console.log('current client');
    });
  }
  changeMessage(message: Message) {
    // console.log(message.data.message);
    this.clientSource.next(message);
  }
  setOtherMessage(msg: any) {
    this.otherSource.next(msg);
  }
  sendMsg() {
    // this._message.data['command'] = 'ping';
    // console.log(JSON.stringify(this._message));
    // console.log('new message from client to websocket: ', JSON.stringify(this._message.data['command']));
    if (this._message['gui'] || this._message.data['command'] === 'shake-hands' || this._message.data['command'] === 'ping') {
      this.chatService.messages.next(this._message);
    }
  }
  getClient(): Message {
    const c = JSON.parse(sessionStorage.getItem('client'));
    if (c) {
      this._client = c;
    }
    this.refreshClient();
    return this._client;
  }
  setClient(c): void {
    if (c) {
      this._client = c;
    }
    sessionStorage.setItem('client', JSON.stringify(this._client));
  }
  ping_test() {
    // this._client.data = {};
    // this._client.data['user'] = {};
    // console.log('test ping');
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data['user'] = {};
    this._message.data['command'] = 'ping';
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
  }
  get_user_gui() {
    this._message = JSON.parse(JSON.stringify(this._client));
    // if (this._message.logintoken) {
    this._message.data = {};
    this._message.data['user'] = {};
    this._message.data['command'] = 'get-user-gui';
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
    // } else { return // alert('login first'); }
  }
  stopService() {
    clearInterval(this.heartbeat_interval);
    // delete this.heartbeat_interval;
  }
  shakeHands() {
    if (!this._client.gui || this._client.gui === undefined) {
      this.getClient();
    }
    const firstHandShake = sessionStorage.getItem('firstHandShake');
    // // alert(sessionStorage.getItem('firstThread') + ' heartbeat');
    if (firstHandShake) {
      // this.stopService();
      return;
    }
    sessionStorage.setItem('firstHandShake', '1');
    // console.log('before shakehands' + JSON.stringify(this._client));
    if (!this._client.gui || this._client.gui === undefined) {
      this._message = JSON.parse(JSON.stringify(this._client));
      this._message.data['command'] = 'shake-hands';
      this._message.data.transaction = this.createTransaction();
      this.sendMsg();
    }
    // // alert('shake handds');
  }

  login(loginuser) {
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data['command'] = 'login';
    this._message.data.user = loginuser;
    // // alert(JSON.stringify(this._message));
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
  }

  logout() {
    this._message = JSON.parse(JSON.stringify(this._client));
    // if (this._message.logintoken) {
    this._message.data['user'] = {};
    this._message.data['command'] = 'logout';
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
    // } else { return // alert('login first'); }
  }

  getUserDetails(data) {
    this._message = JSON.parse(JSON.stringify(this._client));
    // if (this._message.logintoken) {
    this._message.data = data;
    this._message.data['user'] = {};
    this._message.data['command'] = 'get-profile';
    console.log(this._message);
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
    // } else { return // alert('login first'); }
  }

  updateUserDetails(updateUserDetails) {
    this._message = JSON.parse(JSON.stringify(this._client));
    // if (this._message.logintoken) {
    this._message.data = {};
    this._message.data['user'] = updateUserDetails;
    this._message.data['command'] = 'edit-profile';
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
    // } else { return // alert('login first'); }
  }

  changePassword(u) {
    // this._client.data['user'] = {};
    // this.refreshClient();
    this._message = JSON.parse(JSON.stringify(this._client));
    // // alert('before change==> ' + JSON.stringify(u));
    // if (this._message.logintoken) {
    this._message.data['command'] = 'change-password';
    this._message.data['user'] = u;
    this._message.data['user'].username = this._message.username;
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
    // } else { return // alert('login first'); }
  }

  register(newuser) {
    this._message = JSON.parse(JSON.stringify(this._client));
    // // console.log('before sending register');
    this._message.data = {};
    this._message.data = newuser.data;
    this._message.data['command'] = 'register';
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
  }

  checkUsername(newuser) {
    this._newUser = newuser;
    // this._client.data['command'] = 'check-username';
    // this._client.data['user'].username = $("#username").val();
    if (this._newUser.data['user'] !== undefined) {
      this._newUser.data['command'] = 'check-username';
      // // alert(JSON.stringify(this._client));
      this._message = JSON.parse(JSON.stringify(this._client));
      this._message.data = this._newUser.data;
      this._message.data.transaction = this.createTransaction();
      this.sendMsg();
    } else { return ('User is undefined'); }
  }

  checkPhoneNumber(newuser) {
    this._newUser = newuser;
    // this._client.data['command'] = 'check-username';
    // this._client.data['user'].username = $("#username").val();
    if (this._newUser.data['user'] !== undefined) {
      this._newUser.data['command'] = 'check-phonenumber';
      // // alert(JSON.stringify(this._client));
      this._message = JSON.parse(JSON.stringify(this._client));
      this._message.data = this._newUser.data;
      this._message.data.transaction = this.createTransaction();
      this.sendMsg();
    } else { return ('User is undefined'); }
  }

  getSecret(newuser) {
    this._newUser = newuser;
    if (this._newUser.data['user'] !== undefined) {
      const phonesize = this._newUser.data.user.phonenumber.length;
      const LTC = this._newUser.data.user.phonenumber.indexOf('205');
      const UNI = this._newUser.data.user.phonenumber.indexOf('209');
      if (phonesize < 10 || phonesize > 10) {
        return ('phone must start with 205 or 209 and 10 digit in total');
      }
      if (LTC < 0 && UNI < 0) {
        return ('we support only LAOTEL and UNITEL number only');
      }
      this._newUser.data['command'] = 'get-secret';
      // this._client.data = this._newUser.data;
      // // alert(JSON.stringify(this._newUser));
      this._message = JSON.parse(JSON.stringify(this._client));
      this._message.data = this._newUser.data;
      this._message.data.transaction = this.createTransaction();
      this.sendMsg();
    } else { return ('User is undefined'); }
  }
  checkSecret(newuser) {
    this._newUser = newuser;
    if (this._newUser.data['user'] !== undefined) {
      this._newUser.data['command'] = 'check-secret';
      // // alert(JSON.stringify(this._client));
      this._message = JSON.parse(JSON.stringify(this._client));
      this._message.data = this._newUser.data;
      this._message.data.transaction = this.createTransaction();
      this.sendMsg();
    } else { return ('User is undefined'); }
  }

  send_confirm_phone_sms(user) {
    const phonesize = user.phonenumber.length;
    // console.log(user.phonenumber.indexOf('205'));
    const LTC = user.phonenumber.indexOf('205');
    const UNI = user.phonenumber.indexOf('209');
    if (phonesize < 10 || phonesize > 10) {
      return ('phone must start with 205 or 209 and 10 digit in total');
    }
    if (LTC < 0 && UNI < 0) {
      return ('we support only LAOTEL and UNITEL number only');
    }
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data['command'] = 'send-confirm-phone-sms';
    this._message.data['user'] = user;
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
  }

  check_confirm_phone_sms(data) {
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data = data;
    this._message.data['command'] = 'check-confirm-phone-sms';
    // this._client.data['user'].phonenumber=phone;
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
  }
  update_confirm_phone(data) {
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data = data;
    this._message.data['command'] = 'update-confirm-phone-sms';
    // this._client.data['user'].phonenumber=phone;
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
  }

  resetPassword(cu) {
    this._message = JSON.parse(JSON.stringify(this._client));
    cu.data['command'] = 'reset-forgot';
    this._message.data = cu.data;
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
  }
  checkForgot(cu) {
    this._message = JSON.parse(JSON.stringify(this._client));
    cu.data['command'] = 'check-forgot';
    this._message.data = cu.data;
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
  }
  getForgotKeys(cu) {
    this._message = JSON.parse(JSON.stringify(this._client));
    cu.data['command'] = 'submit-forgot';
    const phone = cu.data['user'].phonenumber;
    const phonesize = phone.length;
    // console.log(phone.indexOf('205'));
    const LTC = phone.indexOf('205');
    const UNI = phone.indexOf('209');
    if (phonesize < 10 || phonesize > 10) {
      return ('phone must start with 205 or 209 and 10 digit in total');
    }
    if (LTC < 0 && UNI < 0) {
      return ('we support only LAOTEL and UNITEL number only');
    }
    cu.data['command'] = 'submit-forgot';
    this._message.data = cu.data;
    this._message.data.transaction = this.createTransaction();
    this.sendMsg();
  }
  getTransaction(data) {
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data = data;
    this._message.data.command = 'get-transaction';
    this.sendMsg();
  }
  checkTransaction(data) {
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data = data;
    this._message.data.transaction = this.createTransaction();
    this._message.data.command = 'check-transaction';
    this.sendMsg();
  }

  createTransaction() {
    return { transactionid: uuid(), transactiontime: new Date() };
  }
  convertTZ(fromTZ) {
    // let m= moment().;
    // moment.tz('Asia/Vientiane').format();
    // return this._moment.tz(fromTZ, 'Asia/Vientiane').format();
  }
  binary2imageurl(bin) {
    const l = bin.length;
    const urlCreator = window.URL;
    const array = new Uint8Array(l);
    for (let i = 0; i < l; i++) {
      array[i] = bin.charCodeAt(i);
    }
    const blob = new Blob([array], { type: 'image/jpeg' });
    return this.sanitizer.bypassSecurityTrustUrl(
      urlCreator.createObjectURL(blob));

  }
  createSafeURL(url) {
    const urlCreator = window.URL;
    // console.log(url);
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  file2imageurl(f: File) {
    const urlCreator = window.URL;
    // const blob = new Blob([ab]);
    return this.sanitizer.bypassSecurityTrustUrl(
      urlCreator.createObjectURL(f));
  }
  arraybuffer2imageurl(ab: ArrayBuffer, type: string) {
    const urlCreator = window.URL;
    // const blob = new Blob([ab]);
    const file = new Blob([ab], {
      type: type
    });
    console.log(file);
    return this.sanitizer.bypassSecurityTrustUrl(
      urlCreator.createObjectURL(file));
  }
  upload(data) {
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data = data;
    this._message.data.transaction = this.createTransaction();
    this._message.data.command = 'upload';
    this.sendMsg();
  }
  getUpLoad(data) {
    this._message = JSON.parse(JSON.stringify(this._client));
    this._message.data = {};
    this._message.data.transaction = this.createTransaction();
    this._message.data.command = 'get-upload';
    this._message.data.user = data;
    this.sendMsg();
  }
  //  uploadPhoto() {
  //   this._client.data = {};
  //   this._client.data['user'] = {};
  //   var socketServerUrl = 'ws://localhost:6688/';
  //   var files = [];
  //   $('input[type=file]').change( (event) {
  //     files = event.target.files;
  //     if (files.length == 0) {
  //       // alert('select files first !');
  //       return false;
  //     }
  //     for (var i = 0; i < files.length; i++) {
  //       var $transfer = $('<div />').addClass('transfer');
  //       var $progress = $('<div />').addClass('progress')
  //       var $progressBar = $('<div />').addClass('progressBar');
  //       $progressBar.append($progress);
  //       $transfer.append($progressBar);
  //       $('#progresses').append($transfer);
  //       // Creates the transfer
  //       var transfer = new WebSocketFileTransfer({
  //         url: socketServerUrl,
  //         file: files[i],
  //         blockSize: 1024,
  //         type: WebSocketFileTransfer.binarySupported() ? 'binary' : 'base64',
  //         $progress: $progress,
  //         progress:  (event) {
  //           this.$progress.css('width', event.percentage + '%');
  //         },
  //         success:  (event) {
  //           this.$progress.addClass('finished');
  //         }
  //       });
  //       // Starts the transfer
  //       transfer.start();
  //     }
  //     return false;
  //   });
  // }
}