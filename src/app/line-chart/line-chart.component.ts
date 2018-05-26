import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms"; // <<<< import it here
import { WebsocketDataServiceService } from "../websocket-data-service.service";
import { ChatService, Message } from "../chat.service";
import { WebsocketService } from "../websocket.service";
import { BOOL_TYPE } from "@angular/compiler/src/output/output_ast";
import { BADFAMILY } from "dns";

import { ElementRef,ViewChild} from '@angular/core';

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.css"],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})
export class LineChartComponent {
  public lineChartData: Array<any> = [
    { data: [10, 20, 16, 18, 15, 16, 17, 18, 16, 20], label: "Working hours" },
    { data: [15, 24, 15, 15, 15, 15, 15, 16, 16, 16], label: "Resting hours" },
    { data: [12, 10, 1, 0, 0, 16, 5, 4, 4, 4, 4, 4, 4], label: "Problem hours" }
  ];
  private productioncollection:any[];
  private month = 1;
  private day = 1;
  private year=1;
  sortProduction(){
    this.productioncollection.sort(function(a, b){return a.day - b.day});
  }
  collectProduction(icemakerbill){
    let array=this.productioncollection;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(element.day==icemakerbill.day&&element.month==icemakerbill.month&&element.year==icemakerbill.year){
        this.productioncollection[index]=icemakerbill;
      }else{
        this.productioncollection.push(icemakerbill);
      }
    }
    this._currentBill=this.productioncollection;

   this.bindLineChart();
  }
  bindLineChart(){
    this.sortProduction();
    this.lineChartData=[];
    let w={data:[],label:'Working hours'};
    let p={data:[],label:'Resting hours'};
    let pr={data:[],label:'Problem hours'};
    for (let index = 0; index < this.productioncollection.length; index++) {
      const element = this.productioncollection[index];
      if(element.productiontime){
        w.data.push(element.productiontime.working);
        p.data.push(element.productiontime.parking);
        pr.data.push(element.productiontime.problem);
      }
    }
    this.lineChartData.push([w,p,pr]);
  }
  daysInMonth(month, year): any[] {
    let d = new Date(year, month, 0).getDate();
    let arr = [];
    for (let index = 0; index < d; index++) {
      arr.push(index + 1);
    }
    return arr;
  }
  setLInChartLabels(m, y) {
    this.lineChartLabels = this.daysInMonth(m, y);
  }
  public lineChartLabels: Array<any> = this.daysInMonth(
    new Date().getMonth() + 1,
    new Date().getFullYear()
  );
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    {
      // green
      backgroundColor: "rgba(140, 247, 0, 0.253)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    },
    {
      // blue
      backgroundColor: "rgba(1, 48, 255, 0.63)",
      borderColor: "rgba(77,83,96,1)",
      pointBackgroundColor: "rgba(77,83,96,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(77,83,96,1)"
    },
    {
      // red
      backgroundColor: "rgba(255, 0, 0, 0.2)",
      borderColor: "rgba(148,159,177,1)",
      pointBackgroundColor: "rgba(148,159,177,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = "line";

  public randomize(): void {
    let _lineChartData: Array<any> = new Array(this.lineChartData.length);
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
    this.websocketDataServiceService.currentBillSource.subscribe(msg => {
      console.log('from device select bills');
      this.readBill(msg);
    })
  );
  this._subs.push(
    this.websocketDataServiceService.monthSource.subscribe(msg => {
      this.month=msg;
      console.log('new month '+this.month);
      console.log('clear productioncollectoin');
      this.productioncollection=[];
    })
  );
  this._subs.push(
    this.websocketDataServiceService.yearSource.subscribe(msg => {
      this.year=msg;
      console.log('new year '+this.year);
      console.log('clear productioncollectoin');
      this.productioncollection=[];
    })
  );

 this._currentDevice=[];
console.log('load line chart');
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
    //this.loadDevices();
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
          case "ping":
            if (
              this._client.data["message"].toLowerCase().indexOf("error") > -1
            ) {
              console.log(this._client.data["message"]);
            } else {
              console.log(this._client.data["message"]);
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

  readBill(m: any) {
  if (m !== undefined) {
    console.log('current bill length')
    console.log(m);
    //this._currentBill = m;
    console.log(m);
    this._currentBill=m;
    //this.productioncollection=this._currentBill;
    this.collectProduction(m);
    
  }
}

/// END RECEIVING

//// SENDING

/////////////// END SENDING
/// ICEMAKER ----------------------------------------
}
