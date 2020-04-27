import { element } from 'protractor';
import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  Input,
  IterableDiffers,
  DoCheck
} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <<<< import it here
import { WebsocketDataServiceService } from '../websocket-data-service.service';
import { ChatService, Message } from '../chat.service';
import { WebsocketService } from '../websocket.service';
import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';
import { BADFAMILY } from 'dns';

import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pay-bill',
  templateUrl: './pay-bill.component.html',
  styleUrls: ['./pay-bill.component.css'],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})
export class PayBillComponent {
  closeResult: string;
  @ViewChild('Alert_update_details', { static: true }) Alert_update_details: ElementRef;

  private _message: Message;
  public billDiscountCollection = [];
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
  private _otherSource: any = {};
  private _loginUser = { username: '', password: '' };
  private _currentUserdetail: any = {};
  private _otherMessage: any = {};
  private _subs: any = [];
  private _trans: any = [];
  public productionCollection = [];
  //// ICE-MAKER

  public _currentDevice: any;
  public _arrayDevices: any;
  public _currentSubUser: any;
  public _currentBill: any;
  public _arrayBills: any;
  public _arrayPayment: any;
  public _currentDiscountBill: any;
  public _currentPayment = {
    gui: '',
    sn: '',
    bills: [], // {imei:'',_id:'',gui:'',sn:'',workingtime:0,parking:0,problem:0,rate:0,totalvalue:0,effeciency:0,totalvalue:0,paidtime:''}
    totalvalue: 0,
    totaldiscount: 0,
    totalpaid: 0,
    preparedby: '',
    imei: '',
    invoicetime: '',
    description: '',
    paidby: '',
    username: '',
    paidtime: '',
    approvedtime: '',
    isapproved: false,
    approveby: ''
  };
  public _rep: any;
  /// WEBSOCKET LAUNCHING
  constructor(
    private modalService: NgbModal,
    private websocketDataServiceService: WebsocketDataServiceService,
    private router: Router,
    private differs: IterableDiffers
  ) {
    this._rep = {};
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
      this.websocketDataServiceService.currentPaymentSource.subscribe(m => {
        this.readPayment(m);
      })
    );
    this._currentDevice = [];
    console.log('load line chart');
  }
  //// END WEBSOCKET LAUNCHING

  PopUp_add_discout(add_discout) {
    this.modalService.open(add_discout, { centered: true });
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
    this._currentSubUser = [];
    this._message = JSON.parse(JSON.stringify(this._client));
    this._otherMessage = {};

    this.runInit();
  }
  runInit() {
    setTimeout(() => {
      // this.loadDevices();
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
    const pd = sessionStorage.getItem('PD');
    const cd = sessionStorage.getItem('CD');
    const rep = sessionStorage.getItem('rep');
    if (cd) {
      this._currentDevice = JSON.parse(cd);
    }

    if (!pd) {
      /// to other page
      return;
    }

    if (rep) {
      this._rep = JSON.parse(rep);
    }

    this.productionCollection = JSON.parse(pd);
    sessionStorage.setItem('PD', '');
    sessionStorage.setItem('firstHandShake', '');
    sessionStorage.setItem('firstHeartBeat', '');

    this._client = this.websocketDataServiceService.getClient();
    console.log('client loaded');
    this.getTotalValue();
  }
  /// INIT FUNCTIONS

  /// *************RECEIVING  */
  readPayment(m) {
    console.log('got ' + m);
    if (m) {
      this._currentPayment = m;
      console.log(m);
      alert('got payment');
      sessionStorage.setItem('PM', JSON.stringify(this._currentPayment));
      this.router.navigate(['/bill']);
    }
  }
  readClient(c): any {
    // this._client
    try {
      if (c !== undefined) {
        this._client = c;
        // this.saveClient();
        // console.log(c);
        switch (this._client.data['command']) {
          case 'ping':
            if (
              this._client.data['message'].toLowerCase().indexOf('error') > -1
            ) {
              console.log(this._client.data['message']);
            } else {
              console.log(this._client.data['message']);
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
  // ?????????????????????
  getColor(value) {
    if (value < 1) {
      return 'red';
    } else if (value < 1) {
      return 'white';
    } else {
      return '';
    }
  }
  //// ??????????????????????????????????
  makePayment() {
    let array = this.productionCollection;
    const bills = [];
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      bills.push({
        imei: element.imei,
        _id: element.id,
        gui: element.gui,
        sn: element.sn,
        working: element.productiontime.working,
        parking: element.productiontime.parking,
        problem: element.productiontime.problem,
        rate: element.rate,
        totalvalue: element.totalvalue,
        effeciency: element.effeciency,
        totaldiscount: element.totaldiscount,
        description: element.description,
        paidtime: ''
      });
    }
    array = this.billDiscountCollection;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      bills.push({
        imei: element.imei,
        _id: element.id,
        gui: element.gui,
        sn: element.sn,
        working: element.productiontime.working,
        parking: element.productiontime.parking,
        problem: element.productiontime.problem,
        rate: element.rate,
        totalvalue: -element.totalvalue,
        effeciency: element.effeciency,
        totaldiscount: -element.totaldiscount,
        description: element.description,
        paidtime: ''
      });
    }
    this._currentPayment.bills = bills;
    // alert(bills.length);
    // this.websocketDataServiceService.makePayment(this._currentPayment);

    if (confirm('making payment: ' + this._currentPayment.totalpaid)) {
      this.websocketDataServiceService.makePayment(this._currentPayment);
    }
  }
  /// ??????????
  getTotalDiscount() {
    let tt = 0;
    const array = this.billDiscountCollection;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      tt -= element.totalvalue;
    }
    this._currentPayment.totaldiscount = tt;
    return tt;
  }
  getTotalValue() {
    let tt = 0;
    tt = this.getTotalDiscount();
    let t = 0;
    const array = this.productionCollection;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      t += element.totalvalue;
    }
    tt += t;
    this._currentPayment.totalvalue = t;
    this._currentPayment.totalpaid = tt;
    return tt;
  }
  /// ?????????????????????
  saveDicountBill() {
    const array = this.billDiscountCollection;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (this._currentDiscountBill.sn === element.sn) {
        this.billDiscountCollection[index] = this._currentDiscountBill;
      }
    }
    this.getTotalValue();
  }

  // ?????????????????????????
  deleteDiscountBill(b) {
    const array = this.billDiscountCollection;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (b.sn === element.sn) {
        this.billDiscountCollection.splice(index, 1);
      }
    }
    this.getTotalValue();
  }
  // ?????????????????????????????????
  cancelAddDiscount() {
    if (this._currentDiscountBill) {
      if (this._currentDiscountBill['isnew'] === true) {
        this.billDiscountCollection.splice(
          this.billDiscountCollection.length - 1,
          1
        );
      }
      this._currentDiscountBill = {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        lasteststatus: [],
        productiondetails: [],
        productiontime: { working: 0, parking: 0, problem: 0 },
        temps: [],
        effeciency: 8,
        rate: 250,
        totalvalue: 0,
        imei: this.productionCollection[0].imei,
        sn:
          '_' +
          `${new Date().getDate()}${new Date().getMonth() +
          1}${new Date().getFullYear()}${new Date().getTime()}`,
        isdone: true,
        paidtime: '',
        description: '',
        paymentgui: '',
        paidby: '',
        generatedtime: '',
        gui: '',
        lastupdate: []
      };
      this.getTotalValue();
      console.log(this._currentDiscountBill);
    }
  }
  selectDiscount(b) {
    this._currentDiscountBill = b;
    this._currentDiscountBill.isnew = false;
  }
  ////// ????????????????????
  updateDiscountCalculation(e, i) {
    // this._currentDiscountBill.productiontime.working=this._currentDiscountBill.productiontime.working;
    // this._currentDiscountBill.effeciency=this._currentDiscountBill.effeciency;
    if (i === 1) {
      this._currentDiscountBill.productiontime.working = e;
    } else if (i === 2) {
      this._currentDiscountBill.effeciency = e;
    } else if (i === 3) {
      this._currentDiscountBill.rate = e;
    }
    this._currentDiscountBill.totalvalue =
      this._currentDiscountBill.rate *
      this._currentDiscountBill.effeciency *
      this._currentDiscountBill.productiontime.working;
    console.log(this._currentDiscountBill.effeciency);
    console.log(this._currentDiscountBill.productiontime.working);
    this.getTotalValue();
  }
  // ??????????????
  confirmPayment() { }
  // ?????????????????????????????????
  addDiscount() {
    if (this.productionCollection.length) {
      this._currentDiscountBill = {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        lasteststatus: [],
        productiondetails: [],
        productiontime: { working: 0, parking: 0, problem: 0 },
        temps: [],
        effeciency: 8,
        rate: 250,
        totalvalue: 0,
        imei: this.productionCollection[0].imei,
        sn:
          '_' +
          `${new Date().getDate()}${new Date().getMonth() +
          1}${new Date().getFullYear()}${new Date().getTime()}`,
        isdone: true,
        paidtime: '',
        description: '',
        paymentgui: '',
        paidby: '',
        generatedtime: '',
        gui: '',
        lastupdate: [],
        isnew: true
      };
      console.log(this._currentDiscountBill);
      this.billDiscountCollection.push(this._currentDiscountBill);
      this.getTotalDiscount();
    }
  }

  /// END RECEIVING

  //// SENDING

  /////////////// END SENDING
  /// ICEMAKER ----------------------------------------
}
