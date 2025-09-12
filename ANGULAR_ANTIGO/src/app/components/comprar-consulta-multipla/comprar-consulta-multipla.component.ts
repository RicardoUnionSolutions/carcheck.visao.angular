import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'comprar-consulta-multipla',
  templateUrl: './comprar-consulta-multipla.component.html',
  styleUrls: ['./comprar-consulta-multipla.component.scss']
})
export class ComprarConsultaMultiplaComponent implements OnInit {

  @Input() consultas: any = [];
  @Input() pacote: any;
  @Input() valorTotal: Number = 0.00;
  @Output() valorTotalChange: any = new EventEmitter();

  valorTotalReais: any = 0;
  valorTotalCentavos: any = 0;
  hoverDesc: String = '';
  hoverLabel: String = '';

  constructor() { }

  ngOnInit() {
    if (!this.pacote) {
      for (let i = 0; i < this.consultas.length; i++) {
        let vr = parseFloat(this.consultas[i].valorConsulta).toFixed(2).split('.');
        this.consultas[i].valorReais = vr[0];

        this.consultas[i].valorCentavos = vr[1];
      }

      this.updateValorTotal();
    } else {
      this.valorTotal = this.pacote.valor_promocional;
      this.valorTotalChange.emit(this.valorTotal);
    }


  }

  setDesc(desc, label) {
    this.hoverDesc = desc;
    this.hoverLabel = label;
  }

  updateValorTotal() {
    let valorTotal = 0;
    for (let i = 0; i < this.consultas.length; i++) {
      valorTotal += this.consultas[i].valorConsulta * this.consultas[i].quantidade;
    }

    this.valorTotal = valorTotal;
    let vr = valorTotal.toFixed(2).split('.');
    this.valorTotalReais = vr[0];
    this.valorTotalCentavos = vr[1];

    this.valorTotalChange.emit(this.valorTotal);

    return this.valorTotal;
  }


}
