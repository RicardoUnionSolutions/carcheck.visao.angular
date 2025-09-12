import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'forma-pagamento-pix',
    templateUrl: './pix.component.html',
    styleUrls: ['./pix.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class PixComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
