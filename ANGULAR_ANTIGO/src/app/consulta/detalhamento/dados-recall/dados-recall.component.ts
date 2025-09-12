import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { ConsultaComponent } from '../../consulta.component';
import { ResumoComponent } from '../../resumo/resumo.component';
import { BehaviorSubject } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'dados-recall',
  templateUrl: './dados-recall.component.html',
  styleUrls: ['./dados-recall.component.scss']
})
export class DadosRecallComponent implements OnInit {



  @Input() recall: any = [
  ];

  @Input() dadosDetalhamento: any;
  statusConsulta = 0;
  statusReload = 0;

  @Input() dadosObservable;
  consulta:any;

  // @Input() list:any[] = [
  //   {mensagem: "Existe recuperação de Sinistro", tipo: "Recuperação de Sinistro", informacoes: "Outras informações", data: "10/10/2018"},
  //   {mensagem: "Existe recuperação de Sinistro", tipo: "Recuperação de Sinistro", informacoes: "Outras informações", data: "10/10/2018"},
  // ];

  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService) { 
  }

  ngOnInit() {
    this.setStatusConsulta();
  }

  ngOnChanges() {
    this.setStatusConsulta();
  }

  setStatusConsulta() {

    switch (this.dadosDetalhamento.codigoControle) {
      case "ERRO_FORNECEDOR":
      this.statusConsulta =  5;
      break;

      case "OK":
      this.statusConsulta =  1;
      break;
      case "SEMREGISTRO":
      this.statusConsulta =  0;
      break;

      case "PENDENTE":
      this.statusConsulta =  1;
      break;

      default:
      this.statusConsulta =  -1;
      break;
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
            this.consulta.recall = data;
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
