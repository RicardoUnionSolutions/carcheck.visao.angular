import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-consulta-placa-veiculo',
  templateUrl: './consulta-placa-veiculo.component.html',
  styleUrls: ['./consulta-placa-veiculo.component.scss']
})
export class ConsultaPlacaVeiculoComponent implements OnInit {

  constructor(private title: Title, private meta: Meta) { }

  ngOnInit() {
    this.title.setTitle('Consulta pela Placa do Veículo - CarCheck');
    this.meta.updateTag({
      name: 'description',
      content: 'Digite a placa do veículo e obtenha um relatório completo com histórico, restrições e informações detalhadas.'
    });
  }

}
