import {Component, ViewEncapsulation} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { ElementRef,ViewChild} from '@angular/core';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent {
  closeResult: string;

  constructor(private modalService: NgbModal) {}


  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  Show_update_details(Alert_update_details){
    this.modalService.open(Alert_update_details,{ centered: true }); 
    // alert(content);   
  } 
}

