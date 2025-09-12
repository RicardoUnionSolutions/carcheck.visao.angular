import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGDirective } from '../../../directives/inline-svg.directive';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { ConsultaMsgComponent } from '../../consulta-msg/consulta-msg.component';

@Component({
    selector: 'dados-gravames',
    templateUrl: './dados-gravames.component.html',
    styleUrls: ['./dados-gravames.component.scss'],
    standalone: true,
    imports: [CommonModule, InlineSVGDirective, ConsultaMsgComponent]
})
export class DadosGravamesComponent implements OnInit {

  // @Input() gravames:any=[
  //   {tipoPessoa:0, cidade:'Vila Velha', uf:'ES', ufPlaca: 'ES', ufLicenciamento:'ES', financiado:'BRADESCO ADM DE CONSORCIOS LTDA', 
  //   infoStatus: 'Status do veículo teve gravame baixado pelo agente financeiro.', status: 0, dataRegistro:'20/10/2016'},
  //   {tipoPessoa:0, cidade:'Vila Velha', uf:'ES', ufPlaca: 'ES', ufLicenciamento:'ES', financiado:'BRADESCO ADM DE CONSORCIOS LTDA', 
  //   infoStatus: 'Status do veículo teve gravame baixado pelo agente financeiro.', status: 1, dataRegistro:'20/10/2016'},
  //   {tipoPessoa:0, cidade:'Vila Velha', uf:'ES', ufPlaca: 'ES', ufLicenciamento:'ES', financiado:'BRADESCO ADM DE CONSORCIOS LTDA', 
  //   infoStatus: 'Status do veículo teve gravame baixado pelo agente financeiro.', status: 1, dataRegistro:'20/10/2016'},
  // ];

  @Input() dadosDetalhamento: any;
  statusConsulta = 0;
  statusReload = 0;


  @Input() dadosObservable;

  consulta: any;
  nuncaConstou: any = false;

  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService) {
    //  this.dadosObservable = new BehaviorSubject(null);
  }

  ngOnInit() {
    this.setStatusConsulta();
    this.verificaGravameNuncaConstou();
    // this.dadosObservable.asObservable().subscribe(v => {
    //   console.log('consulta gravame:', v);
    //   this.consulta = v;
    // });

    console.log(this.statusConsulta);

  }


  verificaGravameBaixado(dadosGravame: String) {
    
    if (dadosGravame != null) {
      if ((dadosGravame.indexOf("BAIXADO") >= 0) || (dadosGravame.indexOf("baixado") >= 0)) {
        return true;
      }
      return false;
    }
  }

  verificaGravameNuncaConstou() {
    for (let i = 0; i < this.dadosDetalhamento.dadosGravame.length; i++) {

      if (this.dadosDetalhamento.dadosGravame[i].descricaoStatus != null) {
        if ((this.dadosDetalhamento.dadosGravame[i].descricaoStatus.indexOf("NUNCA CONSTOU") >= 0)) {
          this.nuncaConstou = true;
          return true;
        } else {
          this.nuncaConstou = false;
          return false;
        }
      }

    }

  }

  ngChanges() {
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

  reload() {
    this.statusReload = 1;

    //console.log('idConsultaInterna', this.dadosDetalhamento.consultaInterna.idConsultaInterna);

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
            this.consulta.gravame = data;
            // this.dadosObservable.next();

            break;
        }
        this.dadosObservable.next();
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
