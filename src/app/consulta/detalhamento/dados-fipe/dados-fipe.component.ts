import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';

@Component({
    selector: 'dados-fipe',
    templateUrl: './dados-fipe.component.html',
    styleUrls: ['./dados-fipe.component.scss'],
    standalone: true
})
export class DadosFipeComponent implements OnInit {



  // @Input() tabelaFipe:any = [
  //   {modelo: 'Celta File LS 1.0 MBFI 8V FlexPower ultra 5p', fabricante: 'GM - Chevrolet', ano: '2010', combustivel: 'Gasolina', precoFipe: '15.999,00', precoMedio: '16.578,00', cod: '004687-123588'},
  //   {modelo: 'Celta File LS 1.4 MBFI 8V FlexPower ultra 5p', fabricante: 'GM - Chevrolet', ano: '2010', combustivel: 'Gasolina/alcool', precoFipe: '99.999,00', precoMedio: '99.578,00', cod: '004687-123588'},
  // ]

  @Input() dadosDetalhamento: any;
  statusConsulta = 0;
  statusReload = 0;

  @Input() dadosObservable;
  consulta:any;

  first = true;
  
  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService) { 
  }

  ngOnInit() {
    this.setStatusConsulta();
    
  }

  ngChanges() {

    this.setStatusConsulta();
  }

  setStatusConsulta() {
    // if(this.first){
    //   this.dadosDetalhamento.codigoControle = "ERRO_FORNECEDOR";
    //   this.first = false;
    // }
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

    //console.log('idConsultaInterna',this.dadosDetalhamento.consultaInterna.idConsultaInterna);

    this.dadosConsultaService
      .getRecarregarConsultaInterna(this.dadosDetalhamento.consultaInterna.idConsultaInterna)
      .subscribe((data: any) => {
        this.dadosDetalhamento = data;
        //console.log(this.dadosDetalhamento);
        switch (this.dadosDetalhamento.codigoControle) {
          case "ERRO_FORNECEDOR":
            this.statusReload = 2;
            this.setStatusConsulta();
            
            break;
          case "OK":
          case "SEMREGISTRO":
            this.statusReload = 0;
            this.setStatusConsulta();
            //console.log(data);
            data.mudouStatus = true;
            this.consulta.precificador = data;
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
