import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';

@Component({
  selector: 'dados-remarketing',
  templateUrl: './dados-remarketing.component.html',
  styleUrls: ['./dados-remarketing.component.scss']
})
export class DadosRemarketingComponent implements OnInit {

  @Input() remarketing: any = [
  ];

  @Input() dadosDetalhamento: any;
  statusConsulta = 0;
  statusReload = 0;

  @Input() dadosObservable;
  consulta:any;

  imgModal = '';
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
            this.consulta.remarketing = data;
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

  closeModal(){
    this.modalService.close('imgmodal');
  }

  openModal(){
    this.modalService.open('imgmodal');
  }

  openImgModal(img){
    this.imgModal = img; 
    this.openModal();
  }

 

}

