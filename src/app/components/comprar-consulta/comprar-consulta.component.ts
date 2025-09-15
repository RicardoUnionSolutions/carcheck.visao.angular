import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VariableGlobal } from '../../service/variable.global.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'comprar-consulta',
    templateUrl: './comprar-consulta.component.html',
    styleUrls: ['./comprar-consulta.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class ComprarConsultaComponent implements OnInit {


  @Input() listaConsultaPrincipal: any[];
  @Input() listaConsultaNormal: any[];
  @Input() listaConsulta: any[];

  @Input() consultaSelecionada: any;
  //@Output() consultaSelecionadaChange = new EventEmitter();

  @Input() consultasSelecionadas: any[];
  @Output() consultasSelecionadasChange = new EventEmitter();

  @Input() loadingCompra: boolean = false;

  @Output() nextEvent = new EventEmitter();

  consultas: any;
  consulta: any;
  showConsulta: boolean = false;

  constructor(private variableGlobal: VariableGlobal) {
    this.consultas = this.variableGlobal.getProdutos();
  }

  ngOnInit() {
    this.compararInsumos();
    this.consulta = this.consultas.find(consulta => consulta.id === 3);
    
    // Mostrar o card após 1 segundo para melhor UX
    setTimeout(() => {
      this.showConsulta = true;
    }, 1000);
  }


  //  selecionarTipoConsulta(consultaSelecionada){
  //    this.consultaSelecionada = consultaSelecionada;
  //    this.consultaSelecionadaChange.emit(this.consultaSelecionada);
  //  }


  selecionarTipoConsulta(consultaSelecionada) {
    consultaSelecionada.quantidade = 1;
    if (this.consultasSelecionadas.length > 0) {
      this.consultasSelecionadas.pop();
      this.consultasSelecionadas.push(consultaSelecionada);
    } else {
      this.consultasSelecionadas.push(consultaSelecionada);
    }
    //this.consultasSelecionadas = consultasSelecionadas;
    this.consulta = this.consultas.find(consulta => consulta.id === this.consultasSelecionadas[0].composta.id);
    this.consultasSelecionadasChange.emit(this.consultasSelecionadas);
  }

  valorCentavos(preco) {
    let vr = parseFloat(preco).toFixed(2).split(".");
    return vr[1];
  }

  valorReais(preco) {
    let vr = parseFloat(preco).toFixed(2).split(".");
    return vr[0];
  }

  calculaDesconto(valorOriginal: number, valorConsulta: number): string {
    // Calcular o desconto
    const desconto = ((valorOriginal - valorConsulta) / valorOriginal) * 100;
    return Math.floor(desconto).toString();
  }

  calculaDiferenca(valorMaior: number, valorMenor: number): string {
    // Calcular a diferença
    const diferenca = valorMaior - valorMenor;

    // Arredondar para duas casas decimais e retornar como string
    return diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  validate(tipoConsulta) {
    /*let v = this.valorReais(this.valorConsulta[tipoConsulta]);
    v = parseInt(v);
    if(v>0){
      return true;
    }*/
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

  valorToUpSell() {
    var valorToUp;

    valorToUp = this.listaConsulta[0].valorConsulta - this.consultasSelecionadas[0].valorConsulta;

    return "R$"+valorToUp.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  onClickToUpSell(){
    this.selecionarTipoConsulta(this.listaConsulta[0]);
  }

  valorToString(preco) {
    return "R$" + preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

}
