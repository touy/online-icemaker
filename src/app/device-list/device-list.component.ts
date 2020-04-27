import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <<<< import it here
import { WebsocketDataServiceService } from '../websocket-data-service.service';
import { ChatService, Message } from '../chat.service';
import { WebsocketService } from '../websocket.service';

import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css'],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})

export class DeviceListComponent {
  closeResult: string;
  @ViewChild('Alert_update_details', { static: true }) Alert_update_details: ElementRef;

  private _message: Message;
  private _newUser: any = {};
  private _newDevice: any = {};
  private _deviceInfo: any[];
  private _userDetailsStr = '';
  private _selectedSubUsers: any;

  private _server_event: Array<any> = [];
  private _client: Message = {
    gui: '',
    username: '',
    logintoken: '',
    logintime: '',
    loginip: '',
    data: {}
  };
  private _otherSource: any = {};
  private _loginUser = { username: '', password: '' };
  private _currentUserdetail: any = {};
  private _otherMessage: any = {};
  private _subs: any = [];
  private _trans: any = [];

  //// ICE-MAKER
  public _selectedDevice: any;
  public _currentDevice: any;
  public _arrayDevices: any;
  public _currentPayment: any;
  public _currentSubUser: any;
  public _currentBill: any;
  public _arrayBills: any;
  public _arrayPayment: any;

  /// WEBSOCKET LAUNCHING
  constructor(
    private modalService: NgbModal,
    private websocketDataServiceService: WebsocketDataServiceService,
    private router: Router
  ) {
    this.loadClient();
    // if (this._client.logintoken) {
    //     router.navigate(["/main-menu"]);
    //   }
    this._subs.push(
      this.websocketDataServiceService.clientSource.subscribe(client => {
        this.readClient(client);
      })
    );
    this._subs.push(
      this.websocketDataServiceService.newUserSource.subscribe(client => {
        this._newUser = client;
        this.readNewUser(client);
      })
    );
    // this._subs.push(this.websocketDataServiceService.eventSource.subscribe(events => {
    //   this._server_event = events;
    //   this.readServerEvent(events);
    // }));
    this._subs.push(
      this.websocketDataServiceService.currentUserSource.subscribe(user => {
        this.readCurrentUserDetail(user);
      })
    );

    this._subs.push(
      this.websocketDataServiceService.otherSource.subscribe(msg => {
        this.readOtherMessage(msg);
      })
    );
    this._subs.push(
      this.websocketDataServiceService.currentBillSource.subscribe(msg => {
        this.readBill(msg);
      })
    );
    this._subs.push(
      this.websocketDataServiceService.currentDeviceSource.subscribe(msg => {
        this.readDevice(msg);
      })
    );
    this._subs.push(
      this.websocketDataServiceService.currentPaymentSource.subscribe(msg => {
        this.readPayment(msg);
      })
    );
    this._subs.push(
      this.websocketDataServiceService.currentSubUserSource.subscribe(msg => {
        this.readSubUser(msg);
      })
    );
    this._subs.push(
      this.websocketDataServiceService.currentDeviceSource.subscribe(msg => {
        this.readDevice(msg);
      })
    );
    this._newDevice = {};

    // this.websocketDataServiceService.heartbeat_interval = setInterval(
    //   this.websocketDataServiceService.heartbeat.bind(
    //     this.websocketDataServiceService
    //   ),
    //   1000 * 60
    // );
  }
  //// END WEBSOCKET LAUNCHING


  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }
  Show_update_details(Alert_update_details, d) {
    this._selectedDevice = d;
    this.modalService.open(Alert_update_details, { centered: true });
    // alert(content);
  }


  /// OTHER FUNCTIONS
  private clearJSONValue(u) {
    for (const key in u) {
      if (u.hasOwnProperty(key)) {
        u[key] = '';
      }
    }
  }

  //// END OTHER FUNCTIONS
  /// INIT FUNCTIONS
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this._newUser = JSON.parse(JSON.stringify(this._client));
    this._newUser.data = {};
    this._newUser.data.user = {};
    this._currentSubUser = [];
    this._message = JSON.parse(JSON.stringify(this._client));
    this._currentUserdetail = {};
    this._userDetailsStr = '';
    this._otherMessage = {};
    this.runInit();
  }
  runInit() {
    setTimeout(() => {
      this.getDevicesOwner();
    }, 1000);
  }
  ngOnDestroy() {
    console.log('STOP SERVICE');
  }
  saveClient() {
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.setClient(this._client);
  }
  loadClient() {
    sessionStorage.setItem('firstHandShake', '');
    sessionStorage.setItem('firstHeartBeat', '');
    // if (!this._client.gui || this._client.gui === undefined) {
    this._client = this.websocketDataServiceService.getClient();
    console.log('client loaded');
    // } else {
    // this.saveClient();
    // }
  }
  /// INIT FUNCTIONS

  /// *************RECEIVING  */
  ab2str(arrayBuffer) {
    let binaryString = '';
    const bytes = new Uint8Array(arrayBuffer),
      length = bytes.length;
    for (let i = 0; i < length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return binaryString;
  }

  str2ab(str) {
    const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  readClient(c): any {
    // this._client
    try {
      if (c !== undefined) {
        this._client = c;
        // this.saveClient();
        // console.log(c);
        switch (this._client.data['command']) {
          case 'heart-beat':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              console.log(this._client.data['message']);
            } else {
              // this._client.data['user'] = u;
              console.log('heart beat ok');
            }
            break;
          case 'ping':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              console.log(this._client.data['message']);
            } else {
              console.log(this._client.data['message']);
            }
            break;
          case 'get-client':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              console.log(this._client.data['message']);
            } else {
              console.log('get-client OK');
            }
            break;
          case 'shake-hands':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              // // console.log(this._client);
              console.log(this._client.data['message']);
            } else {
              console.log('shake hands ok');
              // alert("will you get device ?");
              this.getDevicesOwner();
              // this.getDevices();
              // alert("get device don't work any more");
            }
            break;
          case 'get-transaction':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              console.log(this._client.data['message']);
            } else {
              // // alert('change password OK');
              console.log('get transaction id ok');
            }
            break;
          case 'check-transaction':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              console.log(this._client.data['message']);
            } else {
              // // alert('change password OK');
              console.log('check transaction id ok');
            }
            break;
          case 'get-all-paymnet':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              console.log(this._client.data['message']);
            } else {
              alert('Get-all-paymnet is working');
            }
            break;
          case 'get-device-info':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              console.log(this._client.data['message']);
            } else {
              alert('Get-device-info is working');
            }
            break;
          case 'get-devices':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              console.log(this._client.data['message']);
            } else {
              console.log('Get-devices is working');
              this.readDevice(this._client.data.deviceinfo);
            }
            break;
          case 'register-new-user':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              console.log(this._client.data['message']);
            } else {
              alert('Success to add new user');
            }
            break;
          case 'get-sub-users':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              console.log(this._client.data['message']);
            } else {
              console.log(this._client.data.message);
            }
            break;
          default:
            break;

        }
      } else {
        // alert('data empty');
        console.log('data is empty');
      }
    } catch (error) {
      console.log(error);
    }

  }
  readNewUser(n): any {
    // this._newUser;
    if (n !== undefined) {
      this._newUser.data = n.data;
    }
  }
  readCurrentUserDetail(c: any): any {
    // this._currentUserDetail
    if (c !== undefined) {
      this._currentUserdetail = c;
    }
  }
  readOtherMessage(m: any): any {
    // this._message
    if (m !== undefined) {
      this._message = m;
    }
  }
  readBill(m: any) {
    if (m !== undefined) {
      if (Array.isArray(m)) {
        this._currentBill = m;
      } else {
        this._arrayBills = m;
      }
    }
  }
  readSubUser(m: any) {
    console.log('read sub user list');
    console.log(m);
    if (m !== undefined) {
      this._currentSubUser = m;
    }
  }
  readDevice(m: any) {
    if (m !== undefined) {
      console.log(m.length);
      this._currentDevice = m;
    }
  }
  readPayment(m: any) {
    if (m !== undefined) {
      if (Array.isArray(m)) {
        this._currentPayment = m;
      } else {
        this._arrayPayment = m;
      }
    }
  }

  /// END RECEIVING

  //// SENDING
  showNewMessage() {
    this._client.data.message = 'changed from show message';
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.changeMessage(this._client);
  }
  setOtherMessage() {
    const msg = {
      title: '',
      data: {},
      other: {} // ...
    };
    // msg.data['transaction'] = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    this.websocketDataServiceService.setOtherMessage(msg);
  }
  shakeHands() {
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.shakeHands();
    this.saveClient();
  }
  ping_test() {
    // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
    // this.websocketDataServiceService.refreshClient();
    this._client.data.message += ' HERE in app component';
    // console.log(this._client);
    this.websocketDataServiceService.ping_test();
  }
  /////////////// END SENDING
  /// ICEMAKER ----------------------------------------

  registerNewUser() {
    const u = this._newUser.data.user;
    this.websocketDataServiceService.registerNewUser(u);
  }

  registerSaleUser() {
    const u = this._newUser.data.user;
    this.websocketDataServiceService.registerSaleUser(u);
  }
  registerFinanceUser() {
    const u = this._newUser.data.user;
    this.websocketDataServiceService.registerFinacneUser(u);
  }
  getSubUsers() {
    console.log('get subusers');
    this.websocketDataServiceService.getSubUsers();
  }
  updateSubUserinfo() {
    const u = this._selectedSubUsers;
    this.websocketDataServiceService.updateSubUserinfo(u);
  }
  resetPasswordSubUser() {
    const u = this._selectedSubUsers;
    this.websocketDataServiceService.resetPasswordSubUser(u);
  }
  addDevice() {
    const d = this._newDevice;
    this.websocketDataServiceService.updateDevice(d);
  }
  updateDevice() {
    const d = this._selectedDevice;
    this.websocketDataServiceService.updateDevice(d);
  }
  updateDeviceOwners() {
    const d = this._selectedDevice;
    this.websocketDataServiceService.updateDeviceOwners(d);
  }
  getDeviceInfo() {
    const d = this._selectedDevice;
    this.websocketDataServiceService.getDeviceInfo(d);
  }
  getDevicesOwner() {
    console.log('get user list');
    const u = { username: this._client.username };
    this.websocketDataServiceService.getDevicesOwner(u);
  }
}
