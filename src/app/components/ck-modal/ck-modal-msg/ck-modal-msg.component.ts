import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { CommonModule } from '@angular/common';
import { InlineSVGDirective } from '../../../directives/inline-svg.directive';
import { CkModalComponent } from '../ck-modal.component';

@Component({
    selector: 'ck-modal-msg',
    templateUrl: './ck-modal-msg.component.html',
    styleUrls: ['./ck-modal-msg.component.scss'],
    standalone: true,
    imports: [CommonModule, InlineSVGDirective, CkModalComponent]
})
export class CkModalMsgComponent implements OnInit {
  modal:any = {
    status:'', 
    title:'', 
    text:'',
    html: false, 
    cancel:{ 
      text:'Fechar',
      status: null,
      event: null,
      show: true
    },
    ok:{ 
      text:'Confirmar',
      status: null,
      event: null,
      show: true
    }
  }

  constructor(private modalService: ModalService) { 
    this.modalService.getMsg().subscribe(v => {
      this.modal = v;
    });
  }

  ngOnInit() {
  }

  cancelEvent(){
    let event = this.modal.cancel.event; 
    this.modalService.closeModalMsg();
    if(event!=null) event();
  }

  
  okEvent(){
    let event = this.modal.ok.event; 
    this.modalService.closeModalMsg();
    if(event!=null) event();
  }

}
