import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'forma-pagamento-boleto',
    templateUrl: './boleto.component.html',
    styleUrls: ['./boleto.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class BoletoComponent implements OnInit {

  constructor() { }

  ngOnInit() { 
  }

}
