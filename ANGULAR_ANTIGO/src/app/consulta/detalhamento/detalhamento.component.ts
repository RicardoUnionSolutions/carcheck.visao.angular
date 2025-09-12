import { Component, OnInit, Input } from '@angular/core';
import { dadosConsultaService } from '../../service/dados-consulta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from '../../../../node_modules/rxjs';
import { ConsultaDuasEtapasService } from '../../service/consulta-duas-etapas.service';

@Component({
  selector: 'consulta-detalhamento',
  templateUrl: './detalhamento.component.html',
  styleUrls: ['./detalhamento.component.scss']
})
export class DetalhamentoComponent implements OnInit {
  
 
  @Input() info: any;
  tokenConsulta: String;
  @Input() dadosConsulta: any;
  dadosConsultaService: any;

  @Input() dadosObservable:any;

  consultaExemplo = false;

  private subscriptionConsultaDuasEtapas = null;

  constructor( private route: ActivatedRoute, private consultaDuasEtapas: ConsultaDuasEtapasService) {
    this.dadosObservable = new BehaviorSubject(null);    
  }

  carregarInformacoes() {

    this.dadosConsultaService
      .getConsultaVeiculo(this.tokenConsulta)
      .subscribe((data: any) => {
      
        this.dadosConsulta = data;
        //console.log("DADOS CONSULTA = ",this.dadosConsulta)
      },
        error => () => {
          console.log("erro")
        },
        () => {
          console.log("Dados carregados com sucesso!");

        });
      }

  ngOnInit() {    

    this.route.params.subscribe(params => {
      this.tokenConsulta = params['tokenConsulta'];
    });
    this.verificaExemplo(this.tokenConsulta);
    
  }

  verificaExemplo(token){
    if(token.match(/exemplo/)){
      return this.consultaExemplo = true;
    }else{
      return this.consultaExemplo = false;
    }
  }


 

}
