import { Component, OnInit } from '@angular/core';
import { CardsServicosComponent } from '../../components/cards-servicos/cards-servicos.component';

@Component({
    selector: 'card-servicos',
    templateUrl: './card-servicos.component.html',
    styleUrls: ['./card-servicos.component.scss'],
    standalone: true,
    imports: [CardsServicosComponent]
})
export class CardServicosComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
