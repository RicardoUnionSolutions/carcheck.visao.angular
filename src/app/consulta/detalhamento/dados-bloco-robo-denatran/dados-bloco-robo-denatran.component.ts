import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { ConsultaDuasEtapasService } from '../../../service/consulta-duas-etapas.service';

@Component({
    selector: 'dados-bloco-robo-denatran',
    templateUrl: './dados-bloco-robo-denatran.component.html',
    styleUrls: ['./dados-bloco-robo-denatran.component.scss'],
    standalone: true
})
export class DadosBlocoRoboDenatranComponent implements OnInit {

  @Input() dadosDetalhamento: any;
  statusConsulta = 0;
  statusReload = 0;

  @Input() dadosObservable;
  consulta: any;

  temComunicacaoVenda = false;
  temRenajud: any;
  temRenainf: any;
  statusComunicacaoVenda = 0;

  private subscriptionConsultaDuasEtapas = null;

  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService, private consultaDuasEtapas: ConsultaDuasEtapasService) {

    this.subscriptionConsultaDuasEtapas = this.consultaDuasEtapas.atualizacoesConsultaDuasEtapas().subscribe((data: any) => {
      console.log(data);
      this.dadosDetalhamento = data;
    });

  }

  ngOnDestroy() {
    this.subscriptionConsultaDuasEtapas.unsubscribe();
  }

  ngOnInit() {
    this.setStatusConsulta();
  }

  setStatusConsulta() {
    this.statusConsulta = this.dadosDetalhamento.codigoControle == "ERRO_FORNECEDOR" ? 5 : 0;
    switch (this.dadosDetalhamento.codigoControle) {
      case "ERRO_FORNECEDOR":
        return 5;

      case "OK":
        if (this.dadosDetalhamento != null && this.dadosDetalhamento.temComunicacaoVenda != null) {
          this.temComunicacaoVenda = true;
          this.statusComunicacaoVenda = 1;
        } else {
          this.statusComunicacaoVenda = 2;
        }
        return 2;
      case "SEMREGISTRO":
        return 0;

      case "PENDENTE":
        return 1;

      default:
        return -1;
    };
  }


  reload() {

    this.statusReload = 1;
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
            if (this.dadosDetalhamento != null && this.dadosDetalhamento.temComunicacaoVenda != null) {
              this.temComunicacaoVenda = true;
            }
            this.setStatusConsulta();
          case "SEMREGISTRO":
            this.statusReload = 0;
            this.setStatusConsulta();

            data.mudouStatus = true;
            this.consulta.denatran = data;
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





