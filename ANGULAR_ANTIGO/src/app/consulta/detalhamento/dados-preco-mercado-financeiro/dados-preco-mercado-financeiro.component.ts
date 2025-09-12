import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';

@Component({
  selector: 'dados-preco-mercado-financeiro',
  templateUrl: './dados-preco-mercado-financeiro.component.html',
  styleUrls: ['./dados-preco-mercado-financeiro.component.scss']
})


export class DadosPrecoMercadoFinanceiroComponent implements OnInit {

  @Input() dadosDetalhamento: any;
  statusConsulta = 0;
  statusReload = 0;

  @Input() dadosObservable;
  consulta:any;

  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService) { }

  ngOnInit() {
    this.setStatusConsulta();
  }

  ngChanges() {
    this.setStatusConsulta();
  }



  setStatusConsulta() {

    this.statusConsulta = this.dadosDetalhamento.codigoControle == "ERRO_FORNECEDOR" ? 5 : 0;
    
  
    switch (this.dadosDetalhamento.codigoControle) {
      case "OK":
      
        return 0;

      case "ERRO_FORNECEDOR":
      case "SEMREGISTRO":
        return 5;

      case "PENDENTE":
        return 1;

      default:
        return -1;
    };

  }

}
