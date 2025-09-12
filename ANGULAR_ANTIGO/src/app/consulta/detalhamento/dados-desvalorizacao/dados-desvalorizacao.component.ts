import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { ConsultaComponent } from '../../consulta.component';
import { ResumoComponent } from '../../resumo/resumo.component';
import { BehaviorSubject } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'dados-desvalorizacao',
  templateUrl: './dados-desvalorizacao.component.html',
  styleUrls: ['./dados-desvalorizacao.component.scss']
})
export class DadosDesvalorizacaoComponent implements OnInit {

  /*@Input() precos: any = [
    { ano: 2015, preco: 35000, desvalorizacaoAnual: 0, desvalorizacaoProgressiva: 0 },
    { ano: 2016, preco: 30000, desvalorizacaoAnual: -14.286, desvalorizacaoProgressiva: -14.286},
    { ano: 2017, preco: 31000, desvalorizacaoAnual: 3.333, desvalorizacaoProgressiva: -11.429},
    { ano: 2018, preco: 27000, desvalorizacaoAnual: -12.903, desvalorizacaoProgressiva: -22.857},
    { ano: 2019, preco: 25000, desvalorizacaoAnual: -7.407, desvalorizacaoProgressiva: -28.571},
    { ano: 2016, preco: 30000, desvalorizacaoAnual: -14.286, desvalorizacaoProgressiva: -14.286},
    { ano: 2017, preco: 31000, desvalorizacaoAnual: 3.333, desvalorizacaoProgressiva: -11.429},
    { ano: 2018, preco: 27000, desvalorizacaoAnual: -12.903, desvalorizacaoProgressiva: -22.857},
    { ano: 2019, preco: 25000, desvalorizacaoAnual: -7.407, desvalorizacaoProgressiva: -28.571},
    { ano: 2016, preco: 30000, desvalorizacaoAnual: -14.286, desvalorizacaoProgressiva: -14.286},
    { ano: 2017, preco: 31000, desvalorizacaoAnual: 3.333, desvalorizacaoProgressiva: -11.429},
    { ano: 2018, preco: 27000, desvalorizacaoAnual: -12.903, desvalorizacaoProgressiva: -22.857},
    { ano: 2019, preco: 25000, desvalorizacaoAnual: -7.407, desvalorizacaoProgressiva: -28.571},
    { ano: 2016, preco: 30000, desvalorizacaoAnual: -14.286, desvalorizacaoProgressiva: -14.286},
    { ano: 2017, preco: 31000, desvalorizacaoAnual: 3.333, desvalorizacaoProgressiva: -11.429},
    { ano: 2018, preco: 27000, desvalorizacaoAnual: -12.903, desvalorizacaoProgressiva: -22.857},
    { ano: 2019, preco: 25000, desvalorizacaoAnual: -7.407, desvalorizacaoProgressiva: -28.571},
    { ano: 2016, preco: 30000, desvalorizacaoAnual: -14.286, desvalorizacaoProgressiva: -14.286},
    { ano: 2017, preco: 31000, desvalorizacaoAnual: 3.333, desvalorizacaoProgressiva: -11.429},
    { ano: 2018, preco: 27000, desvalorizacaoAnual: -12.903, desvalorizacaoProgressiva: -22.857},
    { ano: 2019, preco: 25000, desvalorizacaoAnual: -7.407, desvalorizacaoProgressiva: -28.571},
    
  ];*/

  
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
            this.consulta.desvalorizacao = data;
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
