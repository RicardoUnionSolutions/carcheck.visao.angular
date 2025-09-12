import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'preco-item-veiculo',
  templateUrl: './item-veiculo.component.html',
  styleUrls: ['./item-veiculo.component.scss']
})
export class ItemVeiculoComponent implements OnInit {

  @Input() label:String = '';
  @Input() legenda:String = '';

  se:boolean = false;
  nd:boolean = false;
  op:boolean = false;

  constructor() { }

  ngOnInit() {
    this.se = (this.legenda == 'Série de fábrica');
    this.nd = (this.legenda == 'Não disponível de fábrica');
    this.op = (this.legenda == 'Opcional de fábrica');
  }

}
