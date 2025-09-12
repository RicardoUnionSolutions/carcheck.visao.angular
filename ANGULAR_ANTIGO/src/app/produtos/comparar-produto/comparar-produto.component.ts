import { Component, Input, OnInit } from '@angular/core';
import { VariableGlobal } from '../../service/variable.global.service';

@Component({
  selector: 'app-comparar-produto',
  templateUrl: './comparar-produto.component.html',
  styleUrls: ['./comparar-produto.component.scss']
})
export class CompararProdutoComponent implements OnInit {

  @Input() consultaComparada:any;

  consultas;

  constructor(private variableGlobal: VariableGlobal) {
    this.consultas = this.variableGlobal.getProdutos();

  }

  ngOnInit() {
    this.compararInsumos();
    this.consultas[0].recomendada = false;
    for(var consulta in this.consultas){
      if(this.consultas[consulta].id == this.consultaComparada){
        this.consultas[consulta].recomendada = true;
      }
    }
  }

  compararInsumos(): void {
    const insumosPrimeiraConsulta = this.consultas[0].lista_de_insumos;

    this.consultas.slice(1).forEach((consulta, index) => {
      insumosPrimeiraConsulta.forEach(insumo => {
        if (!consulta.lista_de_insumos.includes(insumo)) {
          consulta.lista_de_insumos_negados.push(insumo);
        }
      });
    });
  }


}
