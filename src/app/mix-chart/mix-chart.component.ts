import { element } from 'protractor';

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <<<< import it here
import { WebsocketDataServiceService } from '../websocket-data-service.service';
import { ChatService, Message } from '../chat.service';
import { WebsocketService } from '../websocket.service';
import { LineChartComponent } from '../line-chart/line-chart.component';

import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-mix-chart',
  templateUrl: './mix-chart.component.html',
  styleUrls: ['./mix-chart.component.css'],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})

export class MixChartComponent {

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
  public _otherSource: any = {};
  public _loginUser = { username: '', password: '' };
  public _currentUserdetail: any = {};
  public _otherMessage: any = {};
  public _subs: any = [];
  public _trans: any = [];
  //// ICE-MAKER


  private _arrayDevices: any;
  private _currentPayment: any;
  private _currentSubUser: any;
  private _currentBill: any;
  private _arrayBills: any;
  private _arrayPayment: any;



  /// WEBSOCKET LAUNCHING
  constructor(
    private modalService: NgbModal,
    private websocketDataServiceService: WebsocketDataServiceService,
  ) {

  }
  public productionCollection = [];
  public _selectedMonth = new Date().getMonth() + 1;
  public _selectedYear = new Date().getFullYear();
  public _currentDevice = {};
  onSendYear(e) {
    this._selectedYear = e;
    console.log(e);
    return e;
  }
  onSendMonth(e) {
    this._selectedMonth = e;
    console.log(e);
    return e;
  }

  onSelectCurrentDevice(e) {
    console.log('get new device at mx chart');
    this._currentDevice = e;
  }
  onSendProduction(e) {
    console.log('get new production');
    const array = this.productionCollection;
    if (!array.length) {
      this.productionCollection = [];
      this.productionCollection.push(e);
      return;
    }
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (this._selectedMonth !== element.month || this._selectedYear !== element.year || this._currentDevice['imei'] !== element.imei) {
        this.productionCollection = [];
        if (e) {
          this.productionCollection.push(e);
        }
        return;
      }
    }
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (e.day === element.day && e.month === element.month && e.year === element.year && element.imei === element.imei) {
        this.productionCollection[index] = e;
        return;
      }
    }
    this.productionCollection.push(e);
  }


}

