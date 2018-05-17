import {Component, ViewEncapsulation} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { ElementRef,ViewChild} from '@angular/core';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})

  export class DeviceListComponent {
    closeResult: string;
    @ViewChild('Alert_update_details') Alert_update_details: ElementRef;
    constructor(private modalService: NgbModal) {}
  
  
    openVerticallyCentered(content) {
      this.modalService.open(content, { centered: true });
    }
    Show_update_details(Alert_update_details){
      this.modalService.open(Alert_update_details,{ centered: true }); 
      // alert(content);   
    } 
  }
  
