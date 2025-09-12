import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { UtilMasks } from '../../../utils/util-masks';
import { ConsultaDuasEtapasService } from '../../../service/consulta-duas-etapas.service';


@Component({
  selector: 'dados-consulta-denatran',
  templateUrl: './dados-consulta-denatran.component.html',
  styleUrls: ['./dados-consulta-denatran.component.scss']
})
export class DadosConsultaDenatranComponent implements OnInit {

  @Input() dadosDetalhamento: any;
  statusGravame: any;
  statusDenatran = 4;
  abrindoConsulta: any;
  idConsultaInterna: any;
  formMask: any;
  renavan: string = '';
  documento: string = '';
  placa: string = '';
  maskDocumentoCpf = { mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/], guide: false };


  @Input() dadosObservable;

  consulta: any;
  nuncaConstou: any = false;

  private subscriptionConsultaDuasEtapas = null;

  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService, private consultaDuasEtapas: ConsultaDuasEtapasService) {
    this.subscriptionConsultaDuasEtapas = this.consultaDuasEtapas.atualizacoesConsultaDuasEtapas().subscribe((data: any) => {
      this.dadosDetalhamento = data;
    });
  }

  ngOnDestroy() {
    this.subscriptionConsultaDuasEtapas.unsubscribe();
  }

  ngOnInit() {
    this.setStatusDenatran();
    this.formMask = {
      cpf: { mask: UtilMasks.cpf, guide: false },
    }

    this.abrindoConsulta = 0;
    this.idConsultaInterna = this.dadosDetalhamento.denatran?.consultaInterna.idConsultaInterna!=null ? this.dadosDetalhamento.denatran?.consultaInterna.idConsultaInterna : 0;
    this.placa = this.dadosDetalhamento.veiculo.placa!=null ? this.dadosDetalhamento.veiculo.placa : 0;
  }


  ngChanges() {
    this.setStatusDenatran();
  }

  setStatusDenatran() {
    if(this.dadosDetalhamento.denatran != undefined) {
      this.statusDenatran = this.dadosDetalhamento.denatran.codigoControle == "DUAS_ETAPAS" ? 4 : 1;
      this.consulta = this.dadosDetalhamento.composta.nome;
      switch (this.dadosDetalhamento.denatran.codigoControle) {
        case "OK":
          this.statusDenatran = 1;
          return 1;
        case "DUAS_ETAPAS":
          this.statusDenatran = 4;
          return 4;

        default:
          this.statusDenatran = -1;
          return -1;
      };
    }else {
      this.statusDenatran = -1;
      return -1;
    }
  }

  setStatus() {
    if(this.dadosDetalhamento != undefined) {
      this.statusDenatran = this.dadosDetalhamento.codigoControle == "DUAS_ETAPAS" ? 4 : 1;
      switch (this.dadosDetalhamento.codigoControle) {
        case "OK":
          this.statusDenatran = 1;
          return 1;
        case "DUAS_ETAPAS":
          this.statusDenatran = 4;
          return 4;

        default:
          this.statusDenatran = -1;
          return -1;
      };
    }else {
      this.statusDenatran = -1;
      return -1;
    }
  }

  reload() {
    this.modalService.openLoading({ title: 'Efetuando consulta Denatran', text: 'Aguarde, sua consulta está sendo realizada.' });
    this.dadosConsultaService
      .getRecarregarConsultaDenatran(this.idConsultaInterna,
        this.placa,
        this.renavan,
        this.documento.replace('.', '').replace('-', ''))
      .subscribe((data: any) => {

        this.modalService.closeLoading();
        this.dadosDetalhamento = data;

        this.consultaDuasEtapas.publicarAtualizacaoConsultaDuasEtapas(data);
        this.abrindoConsulta = 1;
        this.setStatus();
      },
        error => {
          this.modalService.closeLoading();
          this.setStatus();
          this.abrindoConsulta = 1;
        },
        () => {
          this.modalService.closeLoading();
          this.setStatus();
          this.abrindoConsulta = 1;
        });
  }

}
