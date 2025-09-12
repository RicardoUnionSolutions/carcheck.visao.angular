import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGDirective } from '../../../directives/inline-svg.directive';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { ConsultaMsgComponent } from '../../consulta-msg/consulta-msg.component';

@Component({
    selector: 'dados-dpvat',
    templateUrl: './dados-dpvat.component.html',
    styleUrls: ['./dados-dpvat.component.scss'],
    standalone: true,
    imports: [CommonModule, InlineSVGDirective, ConsultaMsgComponent]
})
export class DadosDpvatComponent implements OnInit {

  @Input() dpvat:any = [
    {ano:'2019', status: 1, data: '20/10/2019'},
    {ano:'2018', status: 0, data: '20/10/2018'},
    {ano:'2017', status: 0, data: '20/10/2017'},
    {ano:'2016', status: 0, data: '20/10/2016'},
  ];

  @Input() dpvatEmAberto = false;
  
  @Input() dadosDetalhamento;

  statusConsulta = 0;
  statusReload = 0;

  @Input() dadosObservable;
  consulta:any;

  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService) { 
  }

  ngOnInit() {
    for(let i = 0; i < this.dpvat.length; i++){
      if(this.dpvat[i].status>0){
        this.dpvatEmAberto = true;
        return;
      } 
    }
      this.setStatusConsulta();
  
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
            this.consulta.dpvat = data;
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
