import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-display-produto-pagamento',
  templateUrl: './display-produto-pagamento.component.html',
  styleUrls: ['./display-produto-pagamento.component.scss']
})
export class DisplayProdutoPagamentoComponent implements OnInit {

  @Input() consultasSelecionadas = [];
  @Input() dadosVeiculo;
  constructor() { }

  ngOnInit(): void {
  }

}
