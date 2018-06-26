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
  selector: "app-list-product",
  templateUrl: "./list-product.component.html",
  styleUrls: ["./list-product.component.css"],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})
  export class ListProductComponent implements DoCheck {

    ngDoCheck() {
      const changes = this.differ.diff(this.productionCollection);
      if (changes) {
        console.log(changes);
        console.log('line chart get new device'+this.productionCollection.length);
        this.getAverageProduction();
        this.bindLineChart();
      }
    }
  
    @Input() productionCollection:any[];
    @Input() differ: any;
    @Input() _selectedMonth=new Date().getMonth()+1;
    @Input() _selectedYear=new Date().getFullYear();
    
    public lineChartData: Array<any> = [
      { data: [10, 20, 16, 18, 15, 16, 17, 18, 16, 20], label: "Working hours" },
      { data: [15, 24, 15, 15, 15, 15, 15, 16, 16, 16], label: "Resting hours" },
      { data: [12, 10, 1, 0, 0, 16, 5, 4, 4, 4, 4, 4, 4], label: "Problem hours" }
    ];
   
    private month = 1;
    private day = 1;
    private year=1;
    sortProduction(){
      this.productionCollection.sort(function(a, b){return a.day - b.day});
    }
  
    bindLineChart(){
      this.sortProduction();
      this.lineChartData=[];
      let w=[];
      let p=[];
      let pr=[];
      for (let index = 0; index < this.productionCollection.length; index++) {
        const element = this.productionCollection[index];
        if(element.productiontime){
          w.push(element.productiontime.working);
          p.push(element.productiontime.parking);
          pr.push(element.productiontime.problem);
        }
       // console.log([w,p,pr]);
      }
      //this.lineChartData.push([w,p,pr]);
      this.lineChartData=[
        { data: w, label: "Working hours" },
        { data: p, label: "Resting hours" },
        { data: pr, label: "Problem hours" }
      ];
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
  
  private _arrayDevices: any;
  private _currentPayment: any;
  private _currentSubUser: any;
  private _currentBill: any;
  private _arrayBills: any;
  private _arrayPayment: any;
  private _averageCollection:any={};
  
  
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

    //???????????????
    getColor(value) {
      if(value<1){
        return '#ccd2d3';
      }
      else if(value<1){
        return 'white';
      }
      else{
        return '';
      }
    }
    selectAll(){
      let array=this.productionCollection;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        //console.log(element.isinvoice);
        if(element.isinvoice===undefined){
          element.isinvoice=false;
        }
        if(!element.isdone){
          element.isinvoice=!element.isinvoice;
        }
        
      }
    }
    gotopay(){
      let collection=[];
      let array=this.productionCollection;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        console.log(element.isinvoice);
        if(element.isinvoice===true){
          collection.push(element);
        }
      }
      if(!collection.length)
        {
          alert('Please select one');
          return;
        }
      sessionStorage.setItem('PD',JSON.stringify(collection));
      sessionStorage.setItem('CD',JSON.stringify(this._currentDevice));
      sessionStorage.setItem('rep',JSON.stringify(this.getAverageProductionBySelected(collection)));
      //this.router.navigate(['/pay-bill'],);
      window.open( "pay-bill" );
    }
    getAverageProductionBySelected(array){
      let tt=0;
      let rates=0;
      let eff=0;
      let max=0;
      let min=24;
      let mintime=[];
      let maxtime=[];
      console.log(array);
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        // console.log(element[0]);
        tt+=element.productiontime.working;
        eff+=element.effeciency;
        rates+=element.rate;
        if(max<=element.productiontime.working){
          max=element.productiontime.working;
          
        }
        if(min>=element.productiontime.working){
          min=element.productiontime.working;
          
        }
      }
      
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if(max===element.productiontime.working){
          maxtime.push(`${element.day}.${element.month}.${element.year}`);
        }
        if(min===element.productiontime.working){
          mintime.push(`${element.day}.${element.month}.${element.year}`);
        }
      }
      let av=tt/array.length;
      rates=rates/array.length;
      eff=eff/array.length;
      
      let str='';
      let js:any={};
      if(array.length){
        str=`TT: ${tt} H/ ${tt*rates*eff} KG <br>
      av:${av} H / ${av*eff} KG <br>
      max:${max} H /${max*rates*eff} KG  ==> (${maxtime})<br>
      min: ${min} H /${min*rates*eff} KG ==> (${mintime})` ;
        js.tt=tt;
        js.ttkg=tt*eff;
        js.av=av;
        js.avkg=av*eff;
        js.max=max;
        js.maxkg=max*eff;
        js.min=min;
        js.minkg=min*eff;
        js.maxtime=maxtime;
        js.mintime=mintime;
      }
      return js;
    }
    getAverageProduction(){
      let array=this.productionCollection;
      let tt=0;
      let rates=0;
      let eff=0;
      let max=0;
      let min=24;
      let mintime=[];
      let maxtime=[];
      console.log(array);
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        // console.log(element[0]);
        tt+=element.productiontime.working;
        eff+=element.effeciency;
        rates+=element.rate;
        if(max<=element.productiontime.working){
          max=element.productiontime.working;
          
        }
        if(min>=element.productiontime.working){
          min=element.productiontime.working;
          
        }
      }
      
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if(max===element.productiontime.working){
          maxtime.push(`${element.day}.${element.month}.${element.year}`);
        }
        if(min===element.productiontime.working){
          mintime.push(`${element.day}.${element.month}.${element.year}`);
        }
      }
      let av=tt/array.length;
      rates=rates/array.length;
      eff=eff/array.length;
      
      let str='';
      let js:any={};
      if(array.length){
        str=`TT: ${tt} H/ ${tt*rates*eff} KG <br>
      av:${av} H / ${av*eff} KG <br>
      max:${max} H /${max*rates*eff} KG  ==> (${maxtime})<br>
      min: ${min} H /${min*rates*eff} KG ==> (${mintime})` ;
        js.tt=tt;
        js.ttkg=tt*eff;
        js.av=av;
        js.avkg=av*eff;
        js.max=max;
        js.maxkg=max*eff;
        js.min=min;
        js.minkg=min*eff;
        js.maxtime=maxtime;
        js.mintime=mintime;
      }
      
    this._averageCollection=js;
      return js;
    }

    @Input()  _currentDevice: any;
  /// END RECEIVING
  
  //// SENDING
  
  /////////////// END SENDING
  /// ICEMAKER ----------------------------------------
  isAdmin(){
    return this._client.username==='ice-maker-admin';
  }
  }
  