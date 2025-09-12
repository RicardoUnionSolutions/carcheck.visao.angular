import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { ConsultaComponent } from '../../consulta.component';
import { ResumoComponent } from '../../resumo/resumo.component';
import { BehaviorSubject } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'dados-indicio-sinistro',
  templateUrl: './dados-indicio-sinistro.component.html',
  styleUrls: ['./dados-indicio-sinistro.component.scss']
})
export class DadosIndicioSinistroComponent implements OnInit {

  @Input() dadosDetalhamentoIndicio: any;
  @Input() dadosDetalhamentoPt: any;


  @Input() indicios: boolean;
  @Input() pt: boolean;
  statusConsulta = 0;
  statusReload = 0;

  temOcorrencia = false;
  temStatusParecer = false;
  statusParecer = null;


  @Input() dadosObservable;
  consulta: any;

  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService) {
  }

  ngOnInit() {
    this.indicios = this.dadosDetalhamentoIndicio > 0;
    //console.log("this.dadosDetalhamento = ",this.dadosDetalhamentoIndicio)
    this.setStatusConsulta();
    this.setStatusParecer();
  }

  ngOnChanges() {
    this.indicios = this.dadosDetalhamentoIndicio > 0;
    this.setStatusConsulta();
  }

  setStatusParecer(){
    if(this.dadosDetalhamentoIndicio !=null && this.dadosDetalhamentoIndicio.indicioSinistro!=null && this.dadosDetalhamentoIndicio.indicioSinistro.statusParecer!=null){
      this.temStatusParecer = true;
      this.statusParecer = this.dadosDetalhamentoIndicio.indicioSinistro.statusParecer;
    }
  }


  setStatusConsulta() {
    if (this.dadosDetalhamentoIndicio != null) {
      switch (this.dadosDetalhamentoIndicio.codigoControle) {
        case "ERRO_FORNECEDOR":
          this.statusConsulta = 5;
          break;

        case "OK":
          if (this.dadosDetalhamentoIndicio.indicioSinistro != null) {
            if (this.dadosDetalhamentoIndicio.indicioSinistro.temSinistro == true) {
              this.statusConsulta = 2;
              this.temOcorrencia = true;
            } else {
              this.statusConsulta = 0;
              this.temOcorrencia = false;
            }
          }


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


    if (this.dadosDetalhamentoPt != null && this.statusConsulta < 2) {


      switch (this.dadosDetalhamentoPt.codigoControle) {
        case "ERRO_FORNECEDOR":
          this.statusConsulta = 5;
          break;

        case "OK":

          if (this.dadosDetalhamentoPt != null) {
            if (this.dadosDetalhamentoPt.ptPositivo == true) {
              this.statusConsulta = 2;
              this.temOcorrencia = true;
            } else {
              this.statusConsulta = 0;
              this.temOcorrencia = false;
            }
          }

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



  }




  reload() {
    if (this.dadosDetalhamentoIndicio != null) {
      this.statusReload = 1;


      this.dadosConsultaService
        .getRecarregarConsultaInterna(this.dadosDetalhamentoIndicio.consultaInterna.idConsultaInterna)
        .subscribe((data: any) => {
          this.dadosDetalhamentoIndicio = data;
          switch (this.dadosDetalhamentoIndicio.codigoControle) {
            case "ERRO_FORNECEDOR":
              this.statusReload = 2;
              this.setStatusConsulta();
              break;
            case "OK":
            case "SEMREGISTRO_OK":
              this.statusReload = 0;
              this.setStatusConsulta();
              data.mudouStatus = true;
              this.consulta.sinistro = data;
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

    } else if (this.dadosDetalhamentoPt != null) {

      this.statusReload = 1;

      this.dadosConsultaService
        .getRecarregarConsultaInterna(this.dadosDetalhamentoPt.consultaInterna.idConsultaInterna)
        .subscribe((data: any) => {
          this.dadosDetalhamentoPt = data;
          switch (this.dadosDetalhamentoPt.codigoControle) {
            case "ERRO_FORNECEDOR":
              this.statusReload = 2;
              this.setStatusConsulta();
              break;
            case "OK":
            case "SEMREGISTRO_OK":
              this.statusReload = 0;
              this.setStatusConsulta();

              data.mudouStatus = true;
              this.consulta.pt = data;
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

}
