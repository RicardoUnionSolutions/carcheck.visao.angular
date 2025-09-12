import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { dadosConsultaService } from '../../service/dados-consulta.service';

@Component({
  selector: 'consultas-disponiveis',
  templateUrl: './consultas-disponiveis.component.html',
  styleUrls: ['./consultas-disponiveis.component.scss']
})
export class ConsultasDisponiveisComponent implements OnInit {

  consultas: any[];
  qtdConsultas: number = 0;
  constructor(private consultasService: dadosConsultaService) {
    this.consultasService.getCreditoConsulta().subscribe(v => {
      this.consultas = v;

      this.qtdConsultas = 0;

      this.consultas.forEach(c => {

        this.qtdConsultas += c.quantidade;

        //console.log('quantidade consultas, ',c.quantidade, this.qtdConsultas, c);

        switch (c.nome.toLowerCase()) {
          case 'leilão':
          case 'leilao':
            c.img = 'leilao';
            break;

          case 'completa':
            c.img = 'completa';
            break;

          case 'gravame':
            c.img = 'gravame';
            break;

          case 'segura':
            c.img = 'segura';
            break;

          case 'decodificador':
            c.img = 'decodificador';
            break;

          default:
            c.img = c.nome.toLowerCase();
        }
      });

    });
  }

  ngOnInit() { }

}
