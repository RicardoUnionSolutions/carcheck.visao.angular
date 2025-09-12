import { Component, OnInit, Input } from '@angular/core';
import { dadosConsultaService } from '../../service/dados-consulta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaDuasEtapasService } from '../../service/consulta-duas-etapas.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import components used in template
import { DadosNacionaisComponent } from './dados-nacionais/dados-nacionais.component';
import { DadosMotorComponent } from './dados-motor/dados-motor.component';
import { DadosLeilaoComponent } from './dados-leilao/dados-leilao.component';
import { DadosRemarketingComponent } from './dados-remarketing/dados-remarketing.component';
import { DadosGravamesComponent } from './dados-gravames/dados-gravames.component';
import { DadosProprietariosComponent } from './dados-proprietarios/dados-proprietarios.component';
import { DadosDecodificacaoChassiComponent } from './dados-decodificacao-chassi/dados-decodificacao-chassi.component';
import { DadosFipeComponent } from './dados-fipe/dados-fipe.component';
import { DadosPrecoMercadoFinanceiroComponent } from './dados-preco-mercado-financeiro/dados-preco-mercado-financeiro.component';
import { DadosDuplicidadeMotorComponent } from './dados-duplicidade-motor/dados-duplicidade-motor.component';
import { DadosRecallComponent } from './dados-recall/dados-recall.component';
import { DadosIndicioSinistroComponent } from './dados-indicio-sinistro/dados-indicio-sinistro.component';
import { DadosParecerTecnicoComponent } from './dados-parecer-tecnico/dados-parecer-tecnico.component';
import { DadosDesvalorizacaoComponent } from './dados-desvalorizacao/dados-desvalorizacao.component';
import { DadosConsultaDenatranComponent } from './dados-consulta-denatran/dados-consulta-denatran.component';
import { DadosBlocoRoboDenatranComponent } from './dados-bloco-robo-denatran/dados-bloco-robo-denatran.component';
import { DadosBlocoHistoricoRouboFurtoComponent } from './dados-bloco-historico-roubo-furto/dados-bloco-historico-roubo-furto.component';
import { DadosBlocoDetranComponent } from './dados-bloco-detran/dados-bloco-detran.component';
import { DadosBlocoMultaComponent } from './dados-bloco-multa/dados-bloco-multa.component';

@Component({
    selector: 'consulta-detalhamento',
    templateUrl: './detalhamento.component.html',
    styleUrls: ['./detalhamento.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        DadosNacionaisComponent,
        DadosMotorComponent,
        DadosLeilaoComponent,
        DadosRemarketingComponent,
        DadosGravamesComponent,
        DadosProprietariosComponent,
        DadosDecodificacaoChassiComponent,
        DadosFipeComponent,
        DadosPrecoMercadoFinanceiroComponent,
        DadosDuplicidadeMotorComponent,
        DadosRecallComponent,
        DadosIndicioSinistroComponent,
        DadosParecerTecnicoComponent,
        DadosDesvalorizacaoComponent,
        DadosConsultaDenatranComponent,
        DadosBlocoRoboDenatranComponent,
        DadosBlocoHistoricoRouboFurtoComponent,
        DadosBlocoDetranComponent,
        DadosBlocoMultaComponent
    ]
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
