import { element } from 'protractor';
import { Component, Inject, OnInit, OnDestroy, Input ,IterableDiffers, DoCheck } from "@angular/core";
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
  selector: 'app-pay-bill',
  templateUrl: './pay-bill.component.html',
  styleUrls: ['./pay-bill.component.css'],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})

export class PayBillComponent {

 
  closeResult: string;
  @ViewChild('Alert_update_details') Alert_update_details: ElementRef;
  
private _message: Message;
private billDiscountCollection=[];
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
private productionCollection=[];
//// ICE-MAKER

private _currentDevice: any;
private _arrayDevices: any;
private _currentPayment: any;
private _currentSubUser: any;
private _currentBill: any;
private _arrayBills: any;
private _arrayPayment: any;
private _currentDiscountBill:any;


/// WEBSOCKET LAUNCHING
constructor(
  private modalService: NgbModal,
  private websocketDataServiceService: WebsocketDataServiceService,
  private router: Router,
  private differs: IterableDiffers
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

 this._currentDevice=[];
console.log('load line chart');
}
//// END WEBSOCKET LAUNCHING


PopUp_add_discout(add_discout) {
  this.addDiscount();
  this.modalService.open(add_discout, { centered: true });

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
  let pd=sessionStorage.getItem('PD');
  if(!pd){
    /// to other page
    return;
  }
  this.productionCollection=JSON.parse(pd);
  sessionStorage.setItem('PD','');
  sessionStorage.setItem("firstHandShake", "");
  sessionStorage.setItem("firstHeartBeat", "");

  this._client = this.websocketDataServiceService.getClient();
  console.log("client loaded");

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
  //??????????????????????????/
  popUp(){

  }
  ////??????????????????????????????????
  makePayment(){

    //this.websocketDataServiceService.makePayment(this._currentPayment);
  }
  ///??????????
  getTotalDiscount(){
    let tt=0;
    let array=this.billDiscountCollection;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      tt+=element.totalvalue;
    }
    return -1*tt;
  }
  getTotalValue(){
    let tt=0;
    tt=this.getTotalDiscount();
    
    let array=this.productionCollection;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      tt+=element.totalvalue;
    }
  return tt;
  }
  ///?????????????????????
  saveDicountBill(){
    let array=this.billDiscountCollection;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(this._currentDiscountBill.sn===element.sn){
        this.billDiscountCollection[index]=this._currentDiscountBill;
      }
    }
  }
  //?????????????????????????
  deleteDiscountBill(b){
    let array=this.billDiscountCollection;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if(b.sn===element.sn){
        this.billDiscountCollection.splice(index,1);
      }
    }
  }
  //?????????????????????????????????
  cancelAddDiscount(){
    if(this._currentDiscountBill){
      this.billDiscountCollection.splice(this.billDiscountCollection.length-1,1);
    this._currentDiscountBill={
      day: new Date().getDate(),
      month: new Date().getMonth()+1,
      year: new Date().getFullYear(),
      lasteststatus: [],
      productiondetails:[],
      productiontime: {working:0,parking:0,problem:0},
      temps: [],
      effeciency: 8,
      rate: 250,
      totalvalue: 0,
      imei: this.productionCollection[0].imei,
      sn: '_'+`${new Date().getDate()}${new Date().getMonth()+1}${new Date().getFullYear()}${new Date().getTime()}`,
      isdone: true,
      paidtime: '',
      description: '',
      paymentgui: '',
      paidby: '',
      generatedtime: '',
      gui: '',
      lastupdate: [],
  };
console.log(this._currentDiscountBill);
    }
    
  }
  selectDiscount(b){
    this._currentDiscountBill=b;
    this.popUp();
  }
  ////// ????????????????????
  updateDiscountCalculation(e,i){
    // this._currentDiscountBill.productiontime.working=this._currentDiscountBill.productiontime.working;
    // this._currentDiscountBill.effeciency=this._currentDiscountBill.effeciency;
    if(i===1){
      this._currentDiscountBill.productiontime.working=e;
    }else if(i===2){
      this._currentDiscountBill.effeciency=e;
    }else if(i===3){
      this._currentDiscountBill.rate=e;
    }
    this._currentDiscountBill.totalvalue= this._currentDiscountBill.rate*this._currentDiscountBill.effeciency*this._currentDiscountBill.productiontime.working;
    console.log(this._currentDiscountBill.effeciency);
    console.log(this._currentDiscountBill.productiontime.working);
  }
  //?????????????????????????????????
  addDiscount(){
    if(this.productionCollection.length){
      this._currentDiscountBill={
        day: new Date().getDate(),
        month: new Date().getMonth()+1,
        year: new Date().getFullYear(),
        lasteststatus: [],
        productiondetails:[],
        productiontime: {working:0,parking:0,problem:0},
        temps: [],
        effeciency: 8,
        rate: 250,
        totalvalue: 0,
        imei: this.productionCollection[0].imei,
        sn: '_'+`${new Date().getDate()}${new Date().getMonth()+1}${new Date().getFullYear()}${new Date().getTime()}`,
        isdone: true,
        paidtime: '',
        description: '',
        paymentgui: '',
        paidby: '',
        generatedtime: '',
        gui: '',
        lastupdate: [],
    };
    console.log(this._currentDiscountBill);
      this.billDiscountCollection.push(this._currentDiscountBill);
    }
    
  }

/// END RECEIVING

//// SENDING

/////////////// END SENDING
/// ICEMAKER ----------------------------------------
}
