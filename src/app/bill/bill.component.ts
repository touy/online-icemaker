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
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css'],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]   
})
export class BillComponent implements OnInit {

  closeResult: string;
  @ViewChild('Alert_update_details') Alert_update_details: ElementRef;
  
private _message: Message;
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
private _subs: any = [];
private _trans: any = [];
//// ICE-MAKER
private _arrayPayment: any;
private _currentDevice:any;
private _currentPayment = {
  gui: '',
  sn: '',
  bills: [],//{imei:'',_id:'',gui:'',sn:'',workingtime:0,parking:0,problem:0,rate:0,totalvalue:0,effeciency:0,totalvalue:0,paidtime:''}
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
}
private _reports:any;
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
  this._subs.push(
    this.websocketDataServiceService.currentPaymentSource.subscribe(m => {
      this.readPayment(m);
    })
  );

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
      u[key] = "";
    }
  }
}

//// END OTHER FUNCTIONS
/// INIT FUNCTIONS
// tslint:disable-next-line:use-life-cycle-interface
ngOnInit() {

  this._message = JSON.parse(JSON.stringify(this._client));;

  
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
  let pd=sessionStorage.getItem('PM');
  let cd=sessionStorage.getItem('CD');
  let rep=sessionStorage.getItem('rep');
  if(rep){
    this._reports=JSON.parse(rep);
  }
  
  if(cd){
    this._currentDevice=JSON.parse(cd);
  }
  if(!pd){
    /// to other page
    return;
  }
  this._currentPayment=JSON.parse(pd);
  sessionStorage.setItem('PM','');
  sessionStorage.setItem("firstHandShake", "");
  sessionStorage.setItem("firstHeartBeat", "");

  this._client = this.websocketDataServiceService.getClient();
  console.log("client loaded");
  this.makePayment();
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

  readPayment(m){
    if(m){
      this._currentPayment=m;
      alert('Payment OK');
    }
  }
  ////??????????????????????????????????
  makePayment(){

    // this.websocketDataServiceService.makePayment(this._currentPayment);
  }

}
