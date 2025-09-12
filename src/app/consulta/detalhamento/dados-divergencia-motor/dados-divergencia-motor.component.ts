import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGDirective } from '../../../directives/inline-svg.directive';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { ConsultaMsgComponent } from '../../consulta-msg/consulta-msg.component';


@Component({
    selector: 'dados-divergencia-motor',
    templateUrl: './dados-divergencia-motor.component.html',
    styleUrls: ['./dados-divergencia-motor.component.scss'],
    standalone: true,
    imports: [CommonModule, InlineSVGDirective, ConsultaMsgComponent]
})
export class DadosDivergenciaMotorComponent implements OnInit {

  @Input() dadosDetalhamento: any;
  statusConsulta = 0;
  statusReload = 0;
  nrMotorReferencia: String;

  @Input() dadosObservable;
  consulta: any;

  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService) {
  }

  ngOnInit() {
    this.setStatusConsulta();
    //this.preencheListaOcorrenciaMotor();
  }

  ngChanges() {
    //this.preencheListaOcorrenciaMotor();
    this.setStatusConsulta();
  }

  setStatusConsulta() {
    this.statusConsulta = this.dadosDetalhamento.codigoControle == "ERRO_FORNECEDOR" ? 5 : 0;
    switch (this.dadosDetalhamento.codigoControle) {
      case "ERRO_FORNECEDOR":
        return 5;

      case "OK":
      case "SEMREGISTRO":
        return 0;

      case "PENDENTE":
        return 1;

      default:
        return -1;
    };

  }

  getOutrosNumeros(){
    return this.dadosDetalhamento.listaOutrasNumeracoes.map(outroMotor=>outroMotor.motor).join(' / ')
  }

  reload() {
    this.statusReload = 1;

    //console.log(this.consultadivergenciamotorBinEstadual);
    //console.log('idConsultaInterna',this.consultadivergenciamotorBinEstadual.consultaInterna.idConsultaInterna);

 
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
              this.consulta.consultadivergenciamotor = data;
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