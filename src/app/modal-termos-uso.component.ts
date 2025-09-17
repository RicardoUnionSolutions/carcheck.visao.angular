import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { CkModalComponent } from "./components/ck-modal/ck-modal.component";
import { ModalService } from "./service/modal.service";

@Component({
  selector: "app-modal-termos-uso",
  standalone: true,
  imports: [CommonModule, CkModalComponent],
  templateUrl: "./modal-termos-uso.component.html",
  styleUrls: ["./modal-termos-uso.component.scss"],
})
export class ModalTermosUsoComponent implements OnChanges {
  @Input() visible = false;
  @Output() fechar = new EventEmitter<boolean>();

  constructor(private modalService: ModalService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["visible"]) {
      return;
    }

    if (changes["visible"].currentValue) {
      this.modalService.open("modaltermosuso");
    } else {
      this.modalService.close("modaltermosuso");
    }
  }

  closeModalTermosUso(aceitou: boolean): void {
    this.modalService.close("modaltermosuso");
    this.fechar.emit(aceitou);
  }
}
