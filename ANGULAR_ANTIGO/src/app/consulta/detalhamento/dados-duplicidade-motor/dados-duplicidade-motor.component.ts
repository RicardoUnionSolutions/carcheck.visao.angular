import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { ConsultaComponent } from '../../consulta.component';
import { ResumoComponent } from '../../resumo/resumo.component';
import { BehaviorSubject } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'dados-duplicidade-motor',
  templateUrl: './dados-duplicidade-motor.component.html',
  styleUrls: ['./dados-duplicidade-motor.component.scss']
})
export class DadosDuplicidadeMotorComponent implements OnInit {

  @Input() dadosDetalhamento: any;
  statusConsulta = 0;
  statusReload = 0;

  @Input() dadosObservable;
  consulta:any;

  /*@Input() duplicidadeMotor:any = [
    {placa: 'XYZ-1020',chassi: '123AB0123456789',motor: '132465789'},
    {placa: 'XYZ-1020',chassi: '123AB0123456789',motor: '132465789'},
    {placa: 'XYZ-1020',chassi: '123AB0123456789',motor: '132465789'},
  ];*/

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
            this.consulta.duplicidade = data;
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
