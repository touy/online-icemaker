import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms"; // <<<< import it here
import { WebsocketDataServiceService } from "../websocket-data-service.service";
import { ChatService, Message } from "../chat.service";
import { WebsocketService } from "../websocket.service";

import { ElementRef,ViewChild} from '@angular/core';

@Component({
  selector: 'app-device-select-list',
  templateUrl: './device-select-list.component.html',
  styleUrls: ['./device-select-list.component.css','../months/months.component.css'],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})

export class DeviceSelectListComponent {
  refreshYear(): any {
    this.websocketDataServiceService.refreshYear();
  }
  refreshMonth(): any {
    this.websocketDataServiceService.refreshMonth();
  }
  closeResult: string;
  @ViewChild('Alert_update_details') Alert_update_details: ElementRef;
  
private _message: Message;
private _deviceInfo: any [] ;
private _selectedDevice:any;
private _server_event: Array<any> = [];
private _client: Message = {
  gui: "",
  username: "",
  logintoken: "",
  logintime: "",
  loginip: "",
  data: {}
};
private _otherSource: any = {};
private _loginUser = { username: "", password: "" };
private _currentUserdetail: any = {};
private _otherMessage: any = {};
private _subs: any = [];
private _trans: any = [];
private productioncollection:any [];
//// ICE-MAKER

private _currentDevice: any;
private _arrayDevices: any;
private _currentPayment: any;
private _currentSubUser: any;
private _currentBill: any;
private _arrayBills: any;
private _arrayPayment: any;


private _selectedMonth=new Date().getMonth()+1;
private _selectedYear=new Date().getFullYear();
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

  // this._subs.push(this.websocketDataServiceService.eventSource.subscribe(events => {
  //   this._server_event = events;
  //   this.readServerEvent(events);
  // }));
  this._subs.push(
    this.websocketDataServiceService.currentDeviceSource.subscribe(msg => {
      this.readDevice(msg);
    })
  );
  this._subs.push(
    this.websocketDataServiceService.currentBillSource.subscribe(msg => {
      console.log('from sub current bills');
      this.readBill(msg);
    })
  );

  this._subs.push(
    this.websocketDataServiceService.monthSource.subscribe(msg => {
      this._selectedMonth=msg;
    })
  );
  this._subs.push(
    this.websocketDataServiceService.yearSource.subscribe(msg => {
      this._selectedYear=msg;
    })
  );
 this._currentDevice=[];

}
//// END WEBSOCKET LAUNCHING


openVerticallyCentered(content) {
  this.modalService.open(content, { centered: true });
}
Show_update_details(Alert_update_details,d){
  this._selectedDevice=d;
  this.modalService.open(Alert_update_details,{ centered: true }); 
  // alert(content);   
} 


/// OTHER FUNCTIONS
private clearJSONValue(u) {
  for (const key in u) {
    if (u.hasOwnProperty(key)) {
      u[key] = "";
    }
  }
}

//// END OTHER FUNCTIONS
/// INIT FUNCTIONS
// tslint:disable-next-line:use-life-cycle-interface
ngOnInit() {
  this._currentSubUser=[];
  this._message = JSON.parse(JSON.stringify(this._client));;
  this._otherMessage = {};
  
  this.runInit();
}
runInit(){
  setTimeout(() => {
    this.loadDevices();
  }, 1000);
}
ngOnDestroy() {
  console.log("STOP SERVICE");
}
saveClient() {
  // this.websocketDataServiceService.refreshClient();
  this.websocketDataServiceService.setClient(this._client);
}
loadClient() {
  sessionStorage.setItem("firstHandShake", "");
  sessionStorage.setItem("firstHeartBeat", "");
  // if (!this._client.gui || this._client.gui === undefined) {
  this._client = this.websocketDataServiceService.getClient();
  console.log("client loaded");
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
        switch (this._client.data["command"]) {
          case "get-device-info":
            if (
              this._client.data["message"].toLowerCase().indexOf("error") > -1
            ) {
              console.log(this._client.data["message"]);
            } else {
              alert("Get-device-info is working");
            }
            break;
            case "get-devices":
            if (
              this._client.data["message"].toLowerCase().indexOf("error") > -1
            ) {
              console.log(this._client.data["message"]);
            } else {
              console.log("Get-devices is working");
              this.readDevice(this._client.data.deviceinfo);
            }
            break;
            case "get-production-time":
            if (
              this._client.data["message"].toLowerCase().indexOf("error") > -1
            ) {
              console.log(this._client.data["message"]);
            } else {
              console.log("Get-production-time is working");
              this.readBill(this._client.data.icemakerbill);
            }
            break;
          default:
            break;

        }
      } else {
        // alert('data empty');
        console.log("data is empty");
      }
    } catch (error) {
      console.log(error);
    }
 
  }

readDevice(m: any) {
  if (m !== undefined) {
    console.log('current device length')
    console.log(m.length);
    this._currentDevice = m;
  }
}
readBill(m: any) {
  if (m !== undefined) {
    console.log('current bill length')
    console.log(m);
    this._currentBill = m;
    //this.collectProduction(m);
  }
}

/// END RECEIVING

//// SENDING

shakeHands() {
  // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
  // this.websocketDataServiceService.refreshClient();
  this.websocketDataServiceService.shakeHands();
  this.saveClient();
}
ping_test() {
  // this._client.data.transaction = this.createTransaction(); // NEED TO BE DONE BEOFORE SEND MESSAGE
  // this.websocketDataServiceService.refreshClient();
  this._client.data.message += " HERE in app component";
  // console.log(this._client);
  this.websocketDataServiceService.ping_test();
}
/////////////// END SENDING
/// ICEMAKER ----------------------------------------


loadDevices(){
  console.log('loading devices');
 this.websocketDataServiceService.getDevices();
  }
  
  getToday(){
    return new Date().getDate();
  }
  getYears(){
    let items: number[] = [];
    for(var i =new Date().getFullYear()-2; i <= new Date().getFullYear()+1; i++){
      items.push(i);
    }
    return items;
  }
  getMonths(){
    let items: number[] = [];
    for(var i = 1; i <= 12; i++){
      items.push(i);
    }
    return items;
  }
  selectYear(y){
    this._selectedYear=y;
    this.websocketDataServiceService.selectYear(y);
    this.refreshYear();
  }

  selectMonth(m){
    if(m===undefined) return;
    this._selectedDevice.
    this._selectedMonth=m;
    this.websocketDataServiceService.selectMonth(m);
    this.refreshMonth();
  }
  selectDevice(d){
    this._selectedDevice=d;
   // this.productioncollection=[];
   this.websocketDataServiceService.getProductionTime(this._selectedDevice);
  }

}

