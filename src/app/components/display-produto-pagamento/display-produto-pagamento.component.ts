import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-display-produto-pagamento',
    templateUrl: './display-produto-pagamento.component.html',
    styleUrls: ['./display-produto-pagamento.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class DisplayProdutoPagamentoComponent implements OnInit {

  @Input() consultasSelecionadas = [];
  @Input() dadosVeiculo;
  constructor() { }

  ngOnInit(): void {
  }

}
