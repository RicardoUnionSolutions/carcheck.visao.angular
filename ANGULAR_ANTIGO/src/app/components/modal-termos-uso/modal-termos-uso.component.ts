import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalService } from '../../service/modal.service';

@Component({
  selector: 'app-modal-termos-uso',
  templateUrl: './modal-termos-uso.component.html',
  styleUrls: ['./modal-termos-uso.component.scss']
})
export class ModalTermosUsoComponent {
  @Output() fechar = new EventEmitter<boolean>();
  @Input() visible: boolean = false;

  constructor(private modalService: ModalService) {}

  ngOnChanges(changes: any) {
    if (changes.visible && this.visible) {
      this.modalService.open('modaltermosuso');
    }
  }

  closeModalTermosUso(aceitou: boolean) {
    this.fechar.emit(aceitou);
    this.modalService.close('modaltermosuso');
  }

}
