import {Component, ViewEncapsulation} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.css']
})


  export class DeviceInfoComponent {
    closeResult: string;
  
    constructor(private modalService: NgbModal) {}
  
    openVerticallyCentered(content) {
      this.modalService.open(content, { centered: true });
    }
  
  }
  
  