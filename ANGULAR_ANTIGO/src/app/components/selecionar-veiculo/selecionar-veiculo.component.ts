import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilMasks } from '../../utils/util-masks';

@Component({
  selector: 'selecionar-veiculo',
  templateUrl: './selecionar-veiculo.component.html',
  styleUrls: ['./selecionar-veiculo.component.scss']
})
export class SelecionarVeiculoComponent implements OnInit {

  @Input() tipoPesquisa = 'placa';
  @Input() placa = '';
  @Input() chassi = '';

  @Output() placaChange = new EventEmitter();
  @Output() chassiChange = new EventEmitter();
  @Output() tipoPesquisaChange = new EventEmitter();
  masks:any;

  constructor() {
    this.masks = {
      placa: {mask: UtilMasks.placa, guide: false}
    }
  }

  ngOnInit() {
  }

  changePlaca(){
    this.change();
  }

  changeChassi(){
    this.change();
  }

  changeTipoConsulta(){
    this.change();
  }

  setTipoPesquisa(tipo){
    this.tipoPesquisa = tipo;
    this.change();
  }

  change(){
    this.placaChange.emit(this.placa);
    this.chassiChange.emit(this.chassi);
    this.tipoPesquisaChange.emit(this.tipoPesquisa);
  }


}
