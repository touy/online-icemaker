import { Component, Inject, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <<<< import it here
import { WebsocketDataServiceService } from '../websocket-data-service.service';
import { ChatService, Message } from '../chat.service';
import { WebsocketService } from '../websocket.service';

import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-device-select-list',
  templateUrl: './device-select-list.component.html',
  styleUrls: ['./device-select-list.component.css', '../months/months.component.css'],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})

export class DeviceSelectListComponent implements OnDestroy, OnInit {

  @Input() str: string;
  @Output() sendDevice = new EventEmitter<any>();
  @Output() sendProduction = new EventEmitter<any>();
  @Output() sendYear = new EventEmitter<any>();
  @Output() sendMonth = new EventEmitter<any>();
  @ViewChild('Alert_update_details') Alert_update_details: ElementRef;

  private _currentBill: any;
  private _deviceInfo: any[];
  private _selectedDevice: any;
  private _server_event: Array<any> = [];
  private _client: Message = {
    gui: '',
    username: '',
    logintoken: '',
    logintime: '',
    loginip: '',
    data: {}
  };
  private _subs = [];

  //// ICE-MAKER

  private _currentDevice: any;
  private _arrayDevices: any;



  private _selectedMonth = new Date().getMonth() + 1;
  private _selectedYear = new Date().getFullYear();
  private _lastreportcollection: any[] = [];
  geolocationPosition: Position;



  /// WEBSOCKET LAUNCHING
  constructor(
    private modalService: NgbModal,
    private websocketDataServiceService: WebsocketDataServiceService,
    private router: Router
  ) {
    this.loadClient();
    // if (this._client.logintoken) {
    //     router.navigate(['/main-menu']);
    //   }
    this._subs.push(
      this.websocketDataServiceService.clientSource.subscribe(client => {
        this.readClient(client);
      })
    );

    this._subs.push(
      this.websocketDataServiceService.currentDeviceSource.subscribe(msg => {
        console.log('sub');
        this.readDevice(msg);
      })
    );

    this._subs.push(
      this.websocketDataServiceService.currentBillSource.subscribe(client => {
        this.readBill(client);
      })
    );
    this._subs.push(
      this.websocketDataServiceService.monthSource.subscribe(msg => {
        this._selectedMonth = msg;
      })
    );
    this._subs.push(
      this.websocketDataServiceService.currentLastreportSource.subscribe(msg => {
        this.addLastReport(msg);
      })
    );
    this.websocketDataServiceService.yearSource.subscribe(msg => {
      console.log('get new select device year');
      this._selectedYear = msg;
    });

    this._currentDevice = [];
    this._selectedMonth = new Date().getMonth() + 1;
    this._selectedYear = new Date().getFullYear();

    setInterval(() => {
      // check if there is no any new data from server
      this.getLatestWorkingStatus();
    }, 1000 * 60 * 5);

    // setTimeout(() => {
    //   this.getLatestWorkingStatus();
    // }, 1000 * 5);
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

    this.runInit();
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          this.geolocationPosition = position,
          console.log('GPS location');
            console.log(position);
        },
        error => {
          switch (error.code) {
            case 1:
              console.log('Permission Denied');
              break;
            case 2:
              console.log('Position Unavailable');
              break;
            case 3:
              console.log('Timeout');
              break;
          }
        }
      );
    };
  }
  runInit() {
    setTimeout(() => {
      this.loadDevices();
    }, 3000);
  }
  ngOnDestroy() {
    console.log('STOP SERVICE');
  }
  saveClient() {
    // this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.setClient(this._client);
  }
  addLastReport(msg: any): any {
    console.log(msg);
    if (!msg) { return; }
    console.log('adding last report');
    const array = this._lastreportcollection;
    if (!array.length) {
      this._lastreportcollection.push(msg);
    }
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.data && msg.data) {
        if (element.data.lastreport && msg.data.lastreport) {
          if (element.data.lastreport.imei === msg.data.lastreport.imei) {
            this._lastreportcollection[index] = msg;
            console.log('last update ', msg.data.lastreport.servertime, msg.data.lastreport.acc);
            return;
          } else {
            if (index + 1 >= array.length) {
              this._lastreportcollection.push(msg);
            }
          }
        }
      }
    }

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

  readClient(c): any {
    // this._client
    try {
      if (c !== undefined) {
        this._client = c;
        // this.saveClient();
        // console.log(c);
        switch (this._client.data['command']) {
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
          case 'get-production-time':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              console.log(this._client.data['message']);
            } else {
              console.log('Get-production is working');
              // this.read(this._client.data.deviceinfo);
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

  readDevice(m: any) {
    if (m !== undefined) {
      console.log('current device length');
      console.log(m.length);
      this._currentDevice = m;
      this.getLatestWorkingStatus();
    }
  }
  readBill(m: any) {
    if (m !== undefined) {
      console.log('current bill length');
      console.log(m);
      this._currentBill = m;
      this.sendProduction.emit(this._currentBill);
    }
  }


  /// END RECEIVING

  //// SENDING


  /////////////// END SENDING
  /// ICEMAKER ----------------------------------------


  loadDevices() {
    console.log('loading devices');
    this.websocketDataServiceService.getDevices();
  }

  getToday() {
    return new Date().getDate();
  }
  getYears() {
    const items: number[] = [];
    for (let i = new Date().getFullYear() - 2; i <= new Date().getFullYear() + 1; i++) {
      items.push(i);
    }
    return items;
  }
  getMonths() {
    const items: number[] = [];
    for (let i = 1; i <= 12; i++) {
      items.push(i);
    }
    return items;
  }
  selectYear(y) {
    if (y === undefined) { return; }
    this.websocketDataServiceService.setCancelSending();
    this._selectedYear = y;
    this.websocketDataServiceService.selectYear(y);
    console.log('select year ' + y);
    this.sendYear.emit(this._selectedYear);
  }

  selectMonth(m) {
    if (m === undefined) { return; }
    this.websocketDataServiceService.setCancelSending();
    this._selectedMonth = m;
    this.websocketDataServiceService.selectMonth(m);
    console.log('select month ' + m);
    this.sendMonth.emit(this._selectedMonth);
  }
  selectDevice(d) {
    this.websocketDataServiceService.setCancelSending();
    this._selectedDevice = d;
    this.sendDevice.emit(this._selectedDevice);
    if(this.isAdmin()){
      this.websocketDataServiceService.getProductionTime(this._selectedDevice);
    }else{
      this.websocketDataServiceService.getProductionBill(this._selectedDevice);
    }
    
  }
  getSelectedDevice(d) {
    if (d && this._selectedDevice) {
      if (this._selectedDevice.imei === d.imei) {
        return true;
      }
    }
    return false;
  }
  checkDeviceStatus(imei) {
    const array = this._lastreportcollection;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.data) {
        if (element.data.lastreport) {
          if (imei === element.data.lastreport.imei) {
            const localtime = new Date();
            const lastreporttime = new Date(element.data.lastreport.servertime);
            if (localtime.getTime() - lastreporttime.getTime() > 1000 * 60 * 5) {
              return 'Offline_Status';
            }
            if (element.data.lastreport.acc === '1') {
              return 'Working_Status';
            } else {
              return 'fas fa-parking size-icon-device-select-watting mr-1';
            }
          }
        }
      }


    }
  }
  getDeviceStatus(imei) {
    const array = this._lastreportcollection;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.data) {
        if (element.data.lastreport) {
          if (imei === element.data.lastreport.imei) {
            const localtime = new Date();
            const lastreporttime = new Date(element.data.lastreport.servertime);
            if (localtime.getTime() - lastreporttime.getTime() >= 1000 * 60 * 5) {
              return '../../assets/photo/offline-icon-red.png';
            }
            if (element.data.lastreport.acc === '1') {
              return '../../assets/photo/snowflake-icon-green.png';
            } else {
              return '../../assets/photo/sleep-icon-orange.png';
            }
          }
        }
      }


    }
  }
  isToday(d){
    let today=new Date();
    let other=new Date(d);
    return other.getDate()===today.getDate()&&other.getMonth()===today.getMonth()&&other.getFullYear()===today.getFullYear();
  }
  getLocalLastReport(imei) {
    const array = this._lastreportcollection;
    let currentreport = {};
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.data) {
        if (element.data.lastreport) {
          if (imei === element.data.lastreport.imei) {
            return currentreport = element.data;
          }
        }
      }
    }
    return currentreport;
  }
  getLatestWorkingStatus() {
    const array = this._currentDevice;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      setTimeout(() => {
        this.websocketDataServiceService.getLatestWorkingStatus(element);
      }, 1000 * index);
    }

  }
  isAdmin(){
    return this._client.username==='ice-maker-admin';
  }

}

