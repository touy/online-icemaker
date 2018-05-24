import { Component, Inject, OnInit, OnDestroy } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms"; // <<<< import it here
import { WebsocketDataServiceService } from "../websocket-data-service.service";
import { ChatService, Message } from "../chat.service";
import { WebsocketService } from "../websocket.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  providers: [WebsocketDataServiceService, ChatService, WebsocketService]
})
export class LoginComponent implements OnInit, OnDestroy {
  private _message: Message;
  private _newUser: any = {};
  private _userDetailsStr = "";
  private _server_event: any = [];
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

  /// WEBSOCKET LAUNCHING
  constructor(
    private websocketDataServiceService: WebsocketDataServiceService,
    private router: Router
  ) {
    this.loadClient();
    // if (this._client.logintoken) {
    //   router.navigate(["/all-menu"]);
    // }
    this._subs.push(
      this.websocketDataServiceService.clientSource.subscribe(client => {
        this.readClient(client);
      })
    );
    this._subs.push(
      this.websocketDataServiceService.newUserSource.subscribe(client => {
        this.readNewUser(client);
      })
    );
    this._subs.push(
      this.websocketDataServiceService.eventSource.subscribe(events => {
        this.readServerEvent(events);
      })
    );
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
    // tslint:disable-next-line:max-line-length
    // this.websocketDataServiceService.heartbeat_interval = setInterval(
    //   this.websocketDataServiceService.heartbeat.bind(
    //     this.websocketDataServiceService
    //   ),
    //   1000 * 60
    // );
  }
  //// END WEBSOCKET LAUNCHING
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
    this._newUser = JSON.parse(JSON.stringify(this._client));
    this._newUser.data = {};
    this._newUser.data.user = {};
    this._message = JSON.parse(JSON.stringify(this._client));
    this._currentUserdetail = {};
    this._userDetailsStr = "";
    this._otherMessage = {};
  }
  ngOnDestroy() {
    console.log("STOP SERVICE");
  }
  saveClient() {
    this.websocketDataServiceService.setClient(this._client);
    console.log(JSON.stringify(this._client));
  }
  loadClient() {
    sessionStorage.setItem("firstHandShake", "");
    sessionStorage.setItem("firstHeartBeat", "");
    //if (!this._client.gui || this._client.gui === undefined) {
      this._client = this.websocketDataServiceService.getClient();
      //this.websocketDataServiceService.refreshClient();
      console.log("client loaded");
    // } else {
    //   this.saveClient();
    // }
  }
  /// INIT FUNCTIONS

  /// *************RECEIVING  */
  readClient(c): any {
    // this._client
    try {
      if (c !== undefined) {
        this._client = c;
        switch (this._client.data["command"]) {
          case "heart-beat":
            if (
              this._client.data["message"].toLowerCase().indexOf("error") > -1
            ) {
              console.log(this._client.data["message"]);
            } else {
              console.log("heart beat ok");
            }
            break;
          case "ping":
            console.log("ping OK");
            break;
          case "login":
            if (
              this._client.data["message"].toLowerCase().indexOf("error") > -1
            ) {
              console.log(this._client.data["message"]);
            } else {
              this.saveClient();
              console.log("LOGIN OK");
              this.router.navigate(["/device-list"]);
            }
            break;
          case "get-client":
            if (
              this._client.data["message"].toLowerCase().indexOf("error") > -1
            ) {
              console.log(this._client.data["message"]);
            } else {
              console.log("get-client OK");
            }
            break;
          case "shake-hands":
            if (
              this._client.data["message"].toLowerCase().indexOf("error") > -1
            ) {
              console.log(this._client.data["message"]);
            } else {
              console.log("shake hands ok");
              console.log(this._client);
              this.saveClient();
            }
            break;
          default:
            break;
        }
      } else {
        console.log("data is empty");
      }
    } catch (error) {
      // alert(error);
    }
  }
  readNewUser(n): any {
    if (n !== undefined) {
      this._newUser.data = n.data;
    }
  }
  readServerEvent(event: any): any {
    const d = event;
    if (d !== undefined) {
      this._server_event.push(d);
      if (d["command"] !== undefined) {
        switch (d["command"]) {
          case "error-changed":
            console.log(d["client"]["data"]["message"]);
            break;
          case "login-changed":
            console.log(
              d["client"]["logintoken"] + "   -   " + d["client"]["logintime"]
            );
            break;
          default:
            break;
        }
      }
    }
  }
  readCurrentUserDetail(c: any): any {
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

  showNewMessage() {
    this._client.data.message = "changed from show message";
    this.websocketDataServiceService.changeMessage(this._client);
  }
  setOtherMessage() {
    const msg = {
      title: "",
      data: {},
      other: {}
    };
    this.websocketDataServiceService.setOtherMessage(msg);
  }
  shakeHands() {
    this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.shakeHands();
  }
  ping_test() {
    this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.ping_test();
    this._client.data.message += " HERE in app component";
    console.log(this._client);
  }

  login() {
    this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.login(this._loginUser);
  }

  goTo(com) {
    console.log(JSON.stringify(this._client));
    this.websocketDataServiceService.refreshClient();
    this.websocketDataServiceService.setClient(this._client);
    this.router
      .navigate([com])
      .then(res => {})
      .catch(err => {
        console.log(err);
      });
  }

  createTransaction() {
    let x;
    this._trans.push(
      (x = this.websocketDataServiceService.createTransaction())
    );
    return x;
  }

  /////////////// END SENDING
}
