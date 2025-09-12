import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { CommonModule } from '@angular/common';
import { InlineSVGDirective } from '../../../directives/inline-svg.directive';

@Component({
    selector: 'dados-leilao',
    templateUrl: './dados-leilao.component.html',
    styleUrls: ['./dados-leilao.component.scss'],
    standalone: true,
    imports: [CommonModule, InlineSVGDirective]
})
export class DadosLeilaoComponent implements OnInit {

  @Input() dadosDetalhamento: any;
  statusConsulta = 0;
  statusReload = 0;

  @Input() dadosObservable;
  consulta:any;

  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService) { 
  }

  ngOnInit() {
    this.setStatusConsulta();
  }

  ngChanges() {
    this.setStatusConsulta();
  }

  setStatusConsulta() {

  
    switch (this.dadosDetalhamento.codigoControle) {
      case "ERRO_FORNECEDOR":
      this.statusConsulta = 5;
      break;

      case "OK":
      this.statusConsulta = 2;
      break;
      case "SEMREGISTRO":
      this.statusConsulta = 0;
      break;

      case "PENDENTE":
      this.statusConsulta = 1;
      break;

      default:
      this.statusConsulta = -1;
      break;
    };

  }

  reload() {
    this.statusReload = 1;


    //console.log(this.dadosDetalhamento);
    //console.log('idConsultaInterna',this.dadosDetalhamento.consultaInterna.idConsultaInterna);

    this.dadosConsultaService
      .getRecarregarConsultaInterna(this.dadosDetalhamento.consultaInterna.idConsultaInterna)
      .subscribe((data: any) => {
        this.dadosDetalhamento = data;
        switch (this.dadosDetalhamento.codigoControle) {
          case "ERRO_FORNECEDOR":
            this.statusReload = 2;
            this.setStatusConsulta();
            break;
          case "OK":
          case "SEMREGISTRO":
            this.statusReload = 0;            
            this.setStatusConsulta();
            data.mudouStatus = true;
            this.consulta.leilao = data;
            this.dadosObservable.next();
            break;
        }
      },
        error => {
          this.modalService.closeLoading();
          this.setStatusConsulta();
          this.statusReload = 2;
        },
        () => {
          this.modalService.closeLoading();
          this.setStatusConsulta();
          this.statusReload = 2;
        });

       
  }

}
