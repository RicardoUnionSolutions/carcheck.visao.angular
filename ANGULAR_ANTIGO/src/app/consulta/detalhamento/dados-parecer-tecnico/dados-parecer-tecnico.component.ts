import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';

@Component({
  selector: 'dados-parecer-tecnico',
  templateUrl: './dados-parecer-tecnico.component.html',
  styleUrls: ['./dados-parecer-tecnico.component.scss']
})
export class DadosParecerTecnicoComponent implements OnInit {

  @Input() dadosDetalhamentoParecerTecnico: any;
 
  @Input() dadosObservable;
  consulta: any;

  statusConsulta = 0;
  statusReload = 0;
  temStatusParecer = false;

  statusParecer = null;

  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService) {
  }

  ngOnInit() {
    this.setStatusConsulta();
    this.setStatusParecer();
  }

  ngOnChanges() {
   
    this.setStatusConsulta();
  }


  setStatusParecer(){
    if(this.dadosDetalhamentoParecerTecnico !=null && this.dadosDetalhamentoParecerTecnico.parecerTecnico!=null && this.dadosDetalhamentoParecerTecnico.parecerTecnico.statusParecer!=null){
      
      this.temStatusParecer = true;
      this.statusParecer = this.dadosDetalhamentoParecerTecnico.parecerTecnico.statusParecer;
    }
  }


  setStatusConsulta() {
    if (this.dadosDetalhamentoParecerTecnico != null) {
      switch (this.dadosDetalhamentoParecerTecnico.codigoControle) {
        case "ERRO_FORNECEDOR":
          this.statusConsulta = 5;
          break;

        case "OK":
          if (this.dadosDetalhamentoParecerTecnico.parecerTecnico != null) {
            if (this.dadosDetalhamentoParecerTecnico.parecerTecnico.statusParecer != "") {
              this.statusConsulta = 2;
              this.temStatusParecer = true;
             
            } else {
              this.statusConsulta = 0;
              this.temStatusParecer = false;
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
    if (this.dadosDetalhamentoParecerTecnico != null) {
      this.statusReload = 1;


      this.dadosConsultaService
        .getRecarregarConsultaInterna(this.dadosDetalhamentoParecerTecnico.consultaInterna.idConsultaInterna)
        .subscribe((data: any) => {
          this.dadosDetalhamentoParecerTecnico = data;
          switch (this.dadosDetalhamentoParecerTecnico.codigoControle) {
            case "ERRO_FORNECEDOR":
              this.statusReload = 2;
              this.setStatusConsulta();
              break;
            case "OK":
            case "SEMREGISTRO_OK":
              this.statusReload = 0;
              this.setStatusConsulta();
              data.mudouStatus = true;
              this.consulta.parecerTecnico = data;
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
