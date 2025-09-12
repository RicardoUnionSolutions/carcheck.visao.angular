import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGDirective } from '../../../directives/inline-svg.directive';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { ConsultaMsgComponent } from '../../consulta-msg/consulta-msg.component';

@Component({
    selector: 'dados-proprietarios',
    templateUrl: './dados-proprietarios.component.html',
    styleUrls: ['./dados-proprietarios.component.scss'],
    standalone: true,
    imports: [CommonModule, InlineSVGDirective, ConsultaMsgComponent]
})
export class DadosProprietariosComponent implements OnInit {

  @Input() proprietarios: any = [
    //   {tipoPessoa:1, cidade: 'Cariacica', uf: 'ES', periodo: '2010-2011'},
    //   {tipoPessoa:2, cidade: 'Cariacica', uf: 'ES', periodo: '2011-2013'},
    //   {tipoPessoa:1, cidade: 'Cariacica', uf: 'ES', periodo: '2013-2015'},
    //   {tipoPessoa:2, cidade: 'Serra', uf: 'SP', periodo: '2015-2018'}
  ]
  @Input() dadosDetalhamento: any;
  statusConsulta = 0;
  statusReload = 0;
  podeIncluir: any;

  listaProprietarioTela: any[];

  @Input() filtroProprietario: any = [];
  
  @Input() dadosObservable;
  consulta:any;

  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService) { 

  }

  ngOnInit() {
    this.setStatusConsulta();

    this.filtroProprietario = [];
    this.listaProprietarioTela = [];
    this.MontaProprietarios();
  }

  ngOnChanges() {
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
            this.consulta.proprietarios = data;
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



  MontaProprietarios() {
    
    let listaProprietario = [];
    
    this.dadosDetalhamento.item.forEach(item => {
      
      if(item.nomeProprietario != null){  
        if( listaProprietario.indexOf(item.nomeProprietario)==-1)
        listaProprietario.push( item.nomeProprietario );
      }
    });

    listaProprietario.forEach(proprietario => {
      let listaMenor = this.dadosDetalhamento.item.filter((valor)=>{
        return valor.nomeProprietario==proprietario;
      });

      let listaAno = [];
      listaMenor.forEach(element => {
        if(listaAno.indexOf(element.anoExercicio)==-1)
        listaAno.push( element.anoExercicio );
      });

      listaAno.sort();
      listaMenor[0].listaAno = listaAno.join(" - ");
      this.listaProprietarioTela.push( listaMenor[0] );

    });

  }

}
