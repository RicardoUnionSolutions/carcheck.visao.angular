import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGDirective } from '../../../directives/inline-svg.directive';


@Component({
    selector: 'forma-pagamento-debito',
    templateUrl: './debito.component.html',
    styleUrls: ['./debito.component.scss'],
    standalone: true,
    imports: [CommonModule, InlineSVGDirective]
})
export class DebitoComponent implements OnInit {
  @Input() pagamento: any;
  @Input() activeItem = '';
  @Output() activeItemChange = new EventEmitter();
  @Input() bandeiras = [];

  debito: any;

  constructor() { }

  ngOnInit() {}

  selectItem(item:any){
    if(item.nome == "Banco Itaú"){
      this.pagamento.nomeBanco = "itau";
    }else if(item.nome == "Banco do Brasil"){
      this.pagamento.nomeBanco = "bancodobrasil"
    }else if(item.nome == "Banco Banrisul"){
      this.pagamento.nomeBanco = "banrisul" 
    }else if(item.nome == "Banco Bradesco"){
      this.pagamento.nomeBanco = "bradesco";
    }else if(item.nome == "Banco HSBC"){
      this.pagamento.nomeBanco = "hsbc"
    }
    
    this.activeItem = item;
    this.activeItemChange.emit(this.activeItem);

  }

}
