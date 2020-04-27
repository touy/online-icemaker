import { Component, Inject, OnInit, OnDestroy, Input, IterableDiffers, DoCheck, SimpleChanges } from '@angular/core';
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
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})
export class LineChartComponent implements DoCheck {
  title = 'graph';
  @Input() public productionCollection: any[];
  @Input() public differ: any;
  @Input() public _selectedMonth = new Date().getMonth() + 1;
  @Input() public _selectedYear = new Date().getFullYear();
  private month = 1;
  private day = 1;
  private year = 1;
  closeResult: string;
  @ViewChild('Alert_update_details', { static: true }) Alert_update_details: ElementRef;

  private _message: Message;
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

  //// ICE-MAKER

  private _currentDevice: any;
  private _arrayDevices: any;
  private _currentPayment: any;
  private _currentSubUser: any;
  private _currentBill: any;
  private _arrayBills: any;
  private _arrayPayment: any;



  private month_c = new Date().getMonth() + 1;
  public lineChartData: any[] = [
    { data: [], label: 'Working hours' },
    { data: [], label: 'Resting hours' },
    { data: [], label: 'Problem hours' }
  ];
  public lineChartLabels: any[] = this.setLInChartLabels(
    new Date().getMonth() + 1,
    new Date().getFullYear()
  );
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    {
      // green
      backgroundColor: 'rgba(140, 247, 0, 0.253)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      // blue
      backgroundColor: 'rgba(1, 48, 255, 0.63)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    {
      // red
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  ngDoCheck() {
    const changes = this.differ.diff(this.productionCollection);
    if (changes) {
      console.log(changes);
      // console.log('line chart get new device'+this.productionCollection.length);
      // console.log('new Month year '+this._selectedMonth+' new year '+this._selectedYear);

      this.bindLineChart();
    }
    // console.log('do changes'+`${this._selectedMonth} ${this._selectedYear}`);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {

      if (changes._selectedMonth) {
        this._selectedMonth = changes._selectedMonth.currentValue;
      }
      if (changes._selectedYear) {
        this._selectedYear = changes._selectedYear.currentValue;
      }

      this.setLInChartLabels(this._selectedMonth, this._selectedYear);
    }

    // console.log('changes');
  }






  sortProduction() {
    this.productionCollection.sort(function (a, b) { return a.day - b.day; });
  }

  bindLineChart() {
    this.sortProduction();
    this.lineChartData = [];
    const w = [];
    const p = [];
    const pr = [];
    for (let index = 0; index < this.productionCollection.length; index++) {
      const element = this.productionCollection[index];
      if (element.productiontime) {
        w.push(element.productiontime.working);
        p.push(element.productiontime.parking);
        pr.push(element.productiontime.problem);
      }
      // console.log([w,p,pr]);
    }
    // this.lineChartData.push([w,p,pr]);
    this.lineChartData = [
      { data: w, label: 'Working hours' },
      { data: p, label: 'Resting hours' },
      { data: pr, label: 'Problem hours' }
    ];
  }
  daysInMonth(month, year): any[] {
    const d = new Date(year, month, 0).getDate();
    const arr = [];
    for (let index = 0; index < d; index++) {
      arr.push(index + 1);
    }
    // console.log('days in month');
    // console.log(arr);
    return arr;
  }


  changeDays(c) {
    this._selectedMonth = c;
    this.month_c = c;
    this.setLInChartLabels(this._selectedMonth, this._selectedYear);
  }



  setLInChartLabels(m, y) {
    return this.lineChartLabels = this.daysInMonth(m, y);
  }

  public randomize(): void {
    const _lineChartData: Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = {
        data: new Array(this.lineChartData[i].data.length),
        label: this.lineChartData[i].label
      };
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor(Math.random() * 100 + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }


  /// WEBSOCKET LAUNCHING
  constructor(
    private modalService: NgbModal,
    private websocketDataServiceService: WebsocketDataServiceService,
    private router: Router,
    private differs: IterableDiffers
  ) {
    this.differ = differs.find([]).create(null);
    this.loadClient();
    // if (this._client.logintoken) {
    //     router.navigate(["/main-menu"]);
    //   }
    this._subs.push(
      this.websocketDataServiceService.clientSource.subscribe(client => {
        this.readClient(client);
      })
    );

    this._currentDevice = [];
    console.log('load line chart');
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


  /// END RECEIVING

  //// SENDING

  /////////////// END SENDING
  /// ICEMAKER ----------------------------------------
}
