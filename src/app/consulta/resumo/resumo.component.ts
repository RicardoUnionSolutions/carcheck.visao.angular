import { Component, OnInit, Input } from '@angular/core';
import { dadosConsultaService } from '../../service/dados-consulta.service';
import { ActivatedRoute } from '@angular/router';
import { ConsultaDuasEtapasService } from '../../service/consulta-duas-etapas.service';
import { CommonModule } from '@angular/common';
import { InlineSVGDirective } from '../../directives/inline-svg.directive';

@Component({
    selector: 'consulta-resumo',
    templateUrl: './resumo.component.html',
    styleUrls: ['./resumo.component.scss'],
    standalone: true,
    imports: [CommonModule, InlineSVGDirective]
})
export class ResumoComponent implements OnInit {

  step: number = 0;
  tokenConsulta: string;
  dadosConsulta: any = {};
  ano: any;
  cidades: String[];

  statusRestricoes: any;
  respostaRestricoes: any;
  qtdeCampos = 0;

  vprecoFipeString: string;
  vprecoFipeDouble: any;
  vprecoMedioBr: string;
  vprecoMolicar: string;
  vprecoMedioUf: string;
  urlFotoVeiculo: string;
  ufMolicar: string;
  DesvalorizacaoAtual: string;

  //analiseMercado: boolean = false;



  @Input() resumoEstrutural: any = [
    // { pergunta: 'Chassi remarcado?', status: 0, resposta: 'Sim' },
    // { pergunta: 'Uso pessoal?', status: 1, resposta: 'Não' },
    // { pergunta: 'Verificação correta?', status: 0, resposta: 'Sim' },
    // { pergunta: 'Pagamento contínuo?', status: 0, resposta: 'Sim' },
    // { pergunta: 'Já foi de seguradora?', status: 2, resposta: 'Sim' },
    // { pergunta: 'Registro no Renajud?', status: 0, resposta: 'Sim' },
    // { pergunta: 'Possui recall?', status: 1, resposta: 'Sim' },
    // { pergunta: 'Sinistro encontrado?', status: 0, resposta: 'Não' },
    // { pergunta: 'Leilão encontrado?', status: 0, resposta: 'Não' },
  ];

  @Input() resumoLegal: any = [
    // {pergunta: 'Consta como roubado?', status: 0, resposta:'Não'},
    // {pergunta: 'Veículo financiado?', status: 0, resposta:'Não'},
    // {pergunta: 'Veículo em circulação?', status: 0, resposta:'Sim'},
    // {pergunta: 'Possui multas ESTADUAIS?', status: 0, resposta:'Não'},
    // {pergunta: 'Possui débitos ESTADUAIS?', status: 2, resposta:'Sim'},
    // {pergunta: 'DPVAT atual pago?', status: 2, resposta:'Não'},
    // {pergunta: 'Motor duplicado na BIN?', status: 0, resposta:'Não'},
    // {pergunta: 'Possui restrições?', status: 2, resposta: 'Sim'},
  ];

  @Input() dados: any = [];

  consulta: any;
  @Input() dadosObservable;

  private subscriptionConsultaDuasEtapas = null;

  constructor(private dadosConsultaService: dadosConsultaService, private route: ActivatedRoute, private consultaDuasEtapas: ConsultaDuasEtapasService) {
    this.cidades = [];

    this.subscriptionConsultaDuasEtapas = this.consultaDuasEtapas.atualizacoesConsultaDuasEtapas().subscribe((data: any) => {
      this.dadosConsulta.denatran = data;
      this.carregarInformacoes();
    });

  }

  ngOnInit() {
    this.resumoEstrutural = [];
    this.resumoLegal = [];

    this.route.params.subscribe(params => {
      this.tokenConsulta = params['tokenConsulta'];
      this.carregarInformacoes();
    });

    this.dadosObservable.asObservable().subscribe(() => {

      this.carregarInformacoes();
    });

  }

  ngOnChanges() {
  }

  carregarInformacoes() {

    this.dadosConsultaService
      .getConsultaVeiculo(this.tokenConsulta)
      .subscribe(
        data => {
          this.dadosConsulta = data;
          this.resumoLegal = [];
          this.resumoEstrutural = [];
          this.criaResumoEstrutural();
          this.criaResumoLegal();

          this.getValoresMercado();

          this.dados = {
            municipioOrigem: this.getMunicipioOrigem(),
            ufOrigem: this.getUfOrigem(),
            passouPor: this.getJaPassouPor(),
            numeroProprietarios: this.getNumeroProprietarios(),
            idadeVeiculo: this.getIdadeVeiculo(),
            quilometragem: this.getQuilometragem(),//this.numberToReal(
            precoFipe: this.getPrecoMedioFipe(),
            precoMercado: this.getPrecoMedioMercado(),

            vprecoFipe: this.vprecoFipeString,
            vprecoBr: this.vprecoMedioBr,
            vprecoMolica: this.vprecoMolicar,
            vprecoUf: this.vprecoMedioUf,
            fotoVeiculo: this.getFotoVeiculo(),
            modeloWebMotors: this.getModeloWebMotors(),
            marcaWebMotors: this.getMarcaWebMotors(),
            ufMolicar: this.getUFMolicar(),
            completa: (this.dadosConsulta.composta.nome == "Garage" || this.dadosConsulta.composta.nome == "PrecoMercadoFinanceiro" || this.dadosConsulta.composta.nome == "Completa"),//this.dadosConsulta.composta.nome == "Completa" ||
            exemplo: this.dadosConsulta.tokenConsulta.toString().indexOf("exemplo"),
            restricaoTributaria : this.getRestricaoTributaria(),
            restricaoJudicial : this.getRestricaoJudicial(),
            restricaoPenhor : this.getRestricaoPenhor(),
            restricaoAdministrativa : this.getRestricaoAdministrativa(),
            circulacao : this.getCirculacao(),
            alienacao : this.getAlienacao(),
            roubo : this.getRouboFurto(),
            historicoRoubo : this.getHistoricoRoubo(),
            reserva : this.getReservaDominio(),
            comunicacaoVenda : this.getComunicacaoVenda(),
            reservaDominio :'N',

          };

          if (this.dadosConsulta.veiculo != null) {
            this.qtdeCampos = this.qtdeCamposObjeto(this.dadosConsulta.veiculo);
          }
        },
        error => {
          console.log("erro", error)
        }
      );
  }

  montaListaProprietario() {

  }



  getAlienacao() {

    if (this.dadosConsulta.denatran != null && this.dadosConsulta.denatran.restricoesDenatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("ALIENAÇÃO") != -1 || this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("ALIENACAO") != -1) {
          return "S";
        }
      }

    }

    if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.restricoes != null) {
      for (let i = 0; i < this.dadosConsulta.binrf.restricoes.length; i++) {
        if (this.dadosConsulta.binrf.restricoes[i].descricao.indexOf("ALIENAÇÃO") != -1 || this.dadosConsulta.binrf.restricoes[i].descricao.indexOf("ALIENACAO") != -1) {
          return "S";
        }
      }
    }

    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.restricoes != null) {
      for (let i = 0; i < this.dadosConsulta.binestadual.restricoes.length; i++) {
        if (this.dadosConsulta.binestadual.restricoes[i].descricao.indexOf("ALIENAÇÃO") != -1 || this.dadosConsulta.binestadual.restricoes[i].descricao.indexOf("ALIENACAO") != -1) {
          return "S";
        }
      }
    }

    if(this.dadosConsulta.denatran != null || this.dadosConsulta.binrf!=null){
      return "N";
    }
  }


  getArrendamentoMercantil() {
    if (this.dadosConsulta.denatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("ARRENDAMENTO") > -1) {
          return "S";
        }
      }
    }
    if (this.dadosConsulta.binrf != null) {
      for (let i = 0; i < this.dadosConsulta.binrf.restricoes.length; i++) {
        if (this.dadosConsulta.binrf.restricoes[i].descricao.indexOf("ARRENDAMENTO") > -1) {
          return "S";
        }
      }
    }
    if (this.dadosConsulta.binestadual != null) {
      for (let i = 0; i < this.dadosConsulta.binestadual.restricoes.length; i++) {
        if (this.dadosConsulta.binestadual.restricoes[i].descricao.indexOf("ARRENDAMENTO") > -1) {
          return "S";
        }
      }
    }
    if(this.dadosConsulta.denatran != null || this.dadosConsulta.binrf != null || this.dadosConsulta.binestadual != null){
      return "N";
    }
  }

  getRouboFurto() {
    if (this.dadosConsulta.binrf != null) {
      if(this.dadosConsulta.binrf.restricoes!=null){
        for(let i = 0; i < this.dadosConsulta.binrf.restricoes.lenght; i++){
            if(this.dadosConsulta.binrf.restricoes[i].descricao.toUpperCase.indexOf("ROUBO") > -1){
              return "S";
            }
        }
      }
      if(this.dadosConsulta.binrf.rf!=null){
        if ( !(this.dadosConsulta.binrf.rf.length%3==0)) {
          return "S";
        }
      return "N";
    }

    }
  }

  getHistoricoRoubo(){
    if (this.dadosConsulta.binrf != null) {
      if(this.dadosConsulta.binrf.rf!=null){
        if ( (this.dadosConsulta.binrf.rf.length>0)) {
          return "Sim";
        }
      return "Não";
    }

    }

  }

  getRestricaoTributaria() {
    if (this.dadosConsulta.denatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("TRIBUTARIA") != -1) {
          return "S";
        }
      }
    }

    if (this.dadosConsulta.binrf != null) {
      for (let i = 0; i < this.dadosConsulta.binrf.restricoes.length; i++) {
        if (this.dadosConsulta.binrf.restricoes[i].descricao.indexOf("TRIBUTARIA") != -1) {
          return "S";
        }
      }
    }

    if (this.dadosConsulta.binestadual != null) {
      for (let i = 0; i < this.dadosConsulta.binestadual.restricoes.length; i++) {
        if (this.dadosConsulta.binestadual.restricoes[i].descricao.indexOf("TRIBUTARIA") != -1) {
          return "S";
        }
      }
    }

    if(this.dadosConsulta.denatran != null || this.dadosConsulta.binrf !=null){
      return "N";
    }
  }

  getRestricaoJudicial() {
    if (this.dadosConsulta.denatran != null && this.dadosConsulta.denatran.restricoesDenatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("JUDICIAL") != -1) {
          return "S";
        }
      }
    }
    if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.restricoes != null) {
      for (let i = 0; i < this.dadosConsulta.binrf.restricoes.length; i++) {
        if (this.dadosConsulta.binrf.restricoes[i].descricao.indexOf("JUDICIAL") != -1) {
          return "S";
        }
      }
    }
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.restricoes != null) {
      for (let i = 0; i < this.dadosConsulta.binestadual.restricoes.length; i++) {
        if (this.dadosConsulta.binestadual.restricoes[i].descricao.indexOf("JUDICIAL") != -1) {
          return "S";
        }
      }
    }

    if(this.dadosConsulta.denatran != null || this.dadosConsulta.binrf != null){
      return "N";
    }

  }

  getRestricaoPenhor() {
    if (this.dadosConsulta.denatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("PENHOR") != -1) {
          return "S";
        }
      }
    }

    if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.restricoes != null ) {
      for (let i = 0; i < this.dadosConsulta.binrf.restricoes.length; i++) {
        if (this.dadosConsulta.binrf.restricoes[i].descricao.indexOf("PENHOR") != -1) {
          return "S";
        }
      }
    }

    if(this.dadosConsulta.denatran !=null || this.dadosConsulta.binrf!=null){
      return "N";
    }
  }

  getComunicacaoVenda(){
    if(this.dadosConsulta.denatran != null){
      if(this.dadosConsulta.denatran.comunicacaoVenda != null){
        return "S";
      }
      return "N";
    }
  }

  getRestricaoAdministrativa() {
    if (this.dadosConsulta.denatran != null && this.dadosConsulta.denatran.restricoesDenatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("ADMINISTRATIVA") != -1) {
          return "S";
        }
      }
    }

    if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.restricoes != null) {
      for (let i = 0; i < this.dadosConsulta.binrf.restricoes.length; i++) {
        if (this.dadosConsulta.binrf.restricoes[i].descricao.indexOf("ADMINISTRATIVA") != -1) {
          return "S";
        }
      }
    }
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.restricoes != null) {
      for (let i = 0; i < this.dadosConsulta.binestadual.restricoes.length; i++) {
        if (this.dadosConsulta.binestadual.restricoes[i].descricao.indexOf("ADMINISTRATIVA") != -1) {
          return "S";
        }
      }
    }
    if(this.dadosConsulta.denatran != null || this.dadosConsulta.binrf != null){
      return "N";
    }
  }

  getCirculacao() {

    if (this.dadosConsulta.denatran != null && this.dadosConsulta.denatran.veiculoDenatran != null && this.dadosConsulta.denatran.veiculoDenatran.situacao !=null && this.dadosConsulta.denatran.veiculoDenatran.situacao == 'CIRCULACAO') {
      return "S";
    }
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.situacao !=null && this.dadosConsulta.binestadual.dadosveiculo.situacao == 'CIRCULACAO') {
      return "S";
    }
    if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.situacao !=null && this.dadosConsulta.binrf.dadosveiculo.situacao == 'CIRCULACAO') {
      return "S";
    }
    else {
      return "N";
    }

  }


  getReservaDominio() {
    if (this.dadosConsulta.denatran != null && this.dadosConsulta.denatran.restricoesDenatran!=null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("RESERVA") != -1) {
          return "S";
        }
      }
    }
    if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.restricoes!= null) {
      for (let i = 0; i < this.dadosConsulta.binrf.restricoes.length; i++) {
        if (this.dadosConsulta.binrf.restricoes[i].descricao.indexOf("RESERVA") != -1) {
          return "S";
        }
      }
    }
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.restricoes!= null) {
      for (let i = 0; i < this.dadosConsulta.binestadual.restricoes.length; i++) {
        if (this.dadosConsulta.binestadual.restricoes[i].descricao.indexOf("RESERVA") != -1) {
          return "S";
        }
      }
    }
    if(this.dadosConsulta.denatran != null || this.dadosConsulta.binrf != null || this.dadosConsulta.binestadual != null){
      return "N";
    }
  }

  getDesvalorizacaoAtual() {
    if (this.dadosConsulta.desvalorizacao != null &&
      this.dadosConsulta.desvalorizacao.dadosDesvalorizacao.length > 0) {
      for (let i = 0; i < this.dadosConsulta.desvalorizacao.dadosDesvalorizacao.length; i++) {
        if (i == this.dadosConsulta.desvalorizacao.dadosDesvalorizacao.length - 1) {
          return this.dadosConsulta.desvalorizacao.dadosDesvalorizacao[i].valorAno;
        }
      }
    } else {
      return "0";
    }

  }

  getUFMolicar() {

    if (this.dadosConsulta.veiculo != null) {

      if (this.dadosConsulta.veiculo.ufOriginal != null) {
        return this.dadosConsulta.veiculo.ufOriginal;
      } else {
        return '';
      }

    } else {
      return '';
    }
  }

  getModeloWebMotors() {
    if (this.dadosConsulta.consultaprecowebmotors != null) {
      if (this.dadosConsulta.consultaprecowebmotors.codigoControle != 'SEMREGISTRO' && this.dadosConsulta.consultaprecowebmotors.codigoControle != 'PENDENTE' && this.dadosConsulta.consultaprecowebmotors.codigoControle != 'ERRO_FORNECEDOR') {

        if (this.dadosConsulta.consultaprecowebmotors.PrecoWebMotors.marca != null) {
          return this.dadosConsulta.consultaprecowebmotors.PrecoWebMotors.modelo;
        } else {
          return '----';
        }
      } else if (this.dadosConsulta.decodificador != null &&
        this.dadosConsulta.decodificador.dadosveiculo.modelo !=
        null) {
        return this.dadosConsulta.decodificador.dadosveiculo.modelo;
      } else {
        return '----';
      }
    } if (this.dadosConsulta.decodificador != null &&
      this.dadosConsulta.decodificador.dadosveiculo.modelo !=
      null) {
      return this.dadosConsulta.decodificador.dadosveiculo.modelo;
    } else {
      return '----';
    }
  }
  getMarcaWebMotors() {

    if (this.dadosConsulta.consultaprecowebmotors != null) {
      if (this.dadosConsulta.consultaprecowebmotors.codigoControle != 'SEMREGISTRO' && this.dadosConsulta.consultaprecowebmotors.codigoControle != 'PENDENTE' && this.dadosConsulta.consultaprecowebmotors.codigoControle != 'ERRO_FORNECEDOR') {

        if (this.dadosConsulta.consultaprecowebmotors.PrecoWebMotors.marca != null) {
          return this.dadosConsulta.consultaprecowebmotors.PrecoWebMotors.marca;
        } else {
          return '----';
        }
      } else if (this.dadosConsulta.decodificador != null &&
        this.dadosConsulta.decodificador.dadosveiculo.marca !=
        null) {
        return this.dadosConsulta.decodificador.dadosveiculo.marca;
      } else {
        return '----';
      }
    } if (this.dadosConsulta.decodificador != null &&
      this.dadosConsulta.decodificador.dadosveiculo.marca !=
      null) {
      return this.dadosConsulta.decodificador.dadosveiculo.marca;
    } else {
      return '----';
    }
  }

  getFotoVeiculo() {
    if (this.dadosConsulta.consultaprecokbb != null) {
      if (this.dadosConsulta.consultaprecokbb.codigoControle != 'SEMREGISTRO' && this.dadosConsulta.consultaprecokbb.codigoControle != 'PENDENTE' && this.dadosConsulta.consultaprecokbb.codigoControle != 'ERRO_FORNECEDOR') {

        if (this.dadosConsulta.dadosResumo.fotoVersao != null) {
          return this.dadosConsulta.dadosResumo.fotoVersao;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }


  getMunicipioOrigem() {

    if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosFaturamento != null && this.dadosConsulta.snva.dadosFaturamento.cidade) {
      return this.dadosConsulta.snva.dadosFaturamento.cidade;
    }
    else {
      return "----";
    }
  }


  getUfOrigem() {

    if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosFaturamento != null && this.dadosConsulta.snva.dadosFaturamento.uf) {
      return this.dadosConsulta.snva.dadosFaturamento.uf;
    }
    else {
      return "----";
    }
  }

  getMunicipio() {

    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.municipio) {
      return this.dadosConsulta.binestadual.dadosveiculo.municipio;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.municipio) {
      return this.dadosConsulta.binfederal.dadosveiculo.municipio;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.municipio) {
      return this.dadosConsulta.binrf.dadosveiculo.municipio;
    } if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.municipio) {
      return this.dadosConsulta.snva.dadosveiculo.municipio;
    } else {
      return "----";
    }

  }


  getNumeroRestricoes() {
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.restricoes != null) {
      return this.dadosConsulta.binestadual.restricoes.length;
    } else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.restricoes != null) {
      return this.dadosConsulta.binfederal.restricoes.length;
    } else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.restricoes != null) {
      return this.dadosConsulta.binrf.restricoes.length;
    }
  }

  getIdadeVeiculo() {
    this.ano = new Date;
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo.anoFabricacao != null) {
      return this.ano.getFullYear() - this.dadosConsulta.binestadual.dadosveiculo.anoFabricacao;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo.anoFabricacao != null) {
      return this.ano.getFullYear() - this.dadosConsulta.binfederal.dadosveiculo.anoFabricacao;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo.anoFabricacao != null) {
      return this.ano.getFullYear() - this.dadosConsulta.binrf.dadosveiculo.anoFabricacao;

    } else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.anoFabricacao != null) {
      return this.ano.getFullYear() - this.dadosConsulta.snva.dadosveiculo.anoFabricacao;

    } else if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.anoFabricacao != null) {

      return this.ano.getFullYear() - this.dadosConsulta.veiculo.anoFabricacao;
    } else {
      return "----";
    }
  }

  calculaIdade(anoFabricacao) {

    if (anoFabricacao == null) {
      return null;
    } else {
      let anoatual;
      let hoje = new Date();
      anoatual = hoje.getFullYear();

      return anoatual - anoFabricacao;
    }

  }

  calculaKMRodados(idade) {

    let media = 1000; //mes
    let km: any;
    let kmRodados: String = "0";
    km = 0;
    if (idade == null || idade == 0) {
      return "0";
    } else {
      try {
        let id = idade;
        if (id == 0) {

          let hj = new Date();
          let time = hj.getTime();
          let data = time.toString().substring(0, 10);
          let mes: any;
          mes = data.substring(5, 7);
          let mesInt = mes;
          km = mesInt * media;



          //km rodados
          kmRodados = km;

          if (kmRodados.length == 4) {
            kmRodados = kmRodados.substring(0, 1) + "." + kmRodados.substring(1, kmRodados.length);
          } else if (kmRodados.length == 5) {
            kmRodados = kmRodados.substring(0, 2) + "." + kmRodados.substring(2, kmRodados.length);
          }
          else if (kmRodados.length == 6) {
            kmRodados = kmRodados.substring(0, 3) + "." + kmRodados.substring(3, kmRodados.length);
          }

        }
        else {
          km = id * 12 * media + (6 * media);

          //km rodados
          kmRodados = km;

          if (kmRodados.length == 4) {
            kmRodados = kmRodados.substring(0, 1) + "." + kmRodados.substring(1, kmRodados.length);
          } else if (kmRodados.length == 5) {
            kmRodados = kmRodados.substring(0, 2) + "." + kmRodados.substring(2, kmRodados.length);
          }
          else if (kmRodados.length == 6) {
            kmRodados = kmRodados.substring(0, 3) + "." + kmRodados.substring(3, kmRodados.length);
          }

          //return km;
        }
      } catch (error) {
        kmRodados = "0";
      }

    }

    return kmRodados;



  }

  getQuilometragem() {
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.anoFabricacao) {

      let idade = this.calculaIdade(this.dadosConsulta.binestadual.dadosveiculo.anoFabricacao);
      return this.calculaKMRodados(idade);
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.anoFabricacao) {

      let idade = this.calculaIdade(this.dadosConsulta.binfederal.dadosveiculo.anoFabricacao);
      return this.calculaKMRodados(idade);
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.anoFabricacao) {

      let idade = this.calculaIdade(this.dadosConsulta.binrf.dadosveiculo.anoFabricacao);
      return this.calculaKMRodados(idade);
    } else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.anoFabricacao != null) {

      let idade = this.calculaIdade(this.dadosConsulta.snva.dadosveiculo.anoFabricacao);
      return this.calculaKMRodados(idade);
    } else if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.anoFabricacao != null) {

      let idade = this.calculaIdade(this.dadosConsulta.veiculo.anoFabricacao);
      return this.calculaKMRodados(idade);
    } else {
      return "----";
    }

  }

  getJaPassouPor() {

    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.municipio) {
      if (this.cidades.indexOf(this.dadosConsulta.binestadual.dadosveiculo.municipio) == -1) {
        this.cidades.push(this.dadosConsulta.binestadual.dadosveiculo.municipio);
      }
    }
    if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.municipio) {
      if (this.cidades.indexOf(this.dadosConsulta.binfederal.dadosveiculo.municipio) == -1) {
        this.cidades.push(this.dadosConsulta.binfederal.dadosveiculo.municipio);
      }
    }
    if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.municipio) {
      if (this.cidades.indexOf(this.dadosConsulta.binrf.dadosveiculo.municipio) == -1) {
        this.cidades.push(this.dadosConsulta.binrf.dadosveiculo.municipio);
      }
    }
    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.municipio != null) {
      if (this.cidades.indexOf(this.dadosConsulta.veiculo.municipio) == -1) {
        this.cidades.push(this.dadosConsulta.veiculo.municipio);
      }
    }
    if (this.cidades.length > 0) {
      return this.cidades;
    } else {
      return "----";
    }

  }

  getPrecoMedioFipe() {
    if (this.dadosConsulta.precificador != null && this.dadosConsulta.precificador.ocorrencia != null) {
      for (let i = 0; i < this.dadosConsulta.precificador.ocorrencia.length; i++) {
        return this.dadosConsulta.precificador.ocorrencia[0].precoFipe;
      }
    } else {
      return "----";
    }
  }


  getPrecoMedioMercado() {
    if (this.dadosConsulta.precificador != null && this.dadosConsulta.precificador.ocorrencia != null) {
      for (let i = 0; i < this.dadosConsulta.precificador.ocorrencia.length; i++) {
        return this.dadosConsulta.precificador.ocorrencia[0].precoMedio;
      }
    } else {
      return "----";
    }
  }

  getNumeroProprietarios() {
    if (this.dadosConsulta.proprietarios != null && this.dadosConsulta.proprietarios.item != null) {
      //return this.dadosConsulta.proprietarios.item.length;
      //Carrega numero proprietarios,
      return this.carregaNumeroProprietario();
    }

  }

  carregaNumeroProprietario() {

    let listaProprietario = [];
    let lista = [];
    this.dadosConsulta.proprietarios.item.forEach(item => {
      if (item.nomeProprietario != null) {
        if (listaProprietario.indexOf(item.nomeProprietario) == -1)
          listaProprietario.push(item.nomeProprietario);
      }
    });

    listaProprietario.forEach(proprietario => {
      let listaMenor = this.dadosConsulta.proprietarios.item.filter((valor) => {
        return valor.nomeProprietario == proprietario;
      });

      let listaAno = [];
      listaMenor.forEach(element => {
        listaAno.push(element.anoExercicio);
      });

      listaAno.sort();
      listaMenor[0].listaAno = listaAno.join(" - ");

      lista.push(listaMenor[0]);

    });
    return lista.length;

  }

  criaResumoEstrutural() {

    let statusChassi: number = this.getStatusChassiRemarcado();
    let respostaChassi: String = this.getRespostaChassiRemarcado();

    let chassi = {
      pergunta: 'Chassi remarcado?', status: statusChassi, resposta: respostaChassi,
      mostrar: this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    };
    if (chassi.mostrar == 'S')
      this.resumoEstrutural.push(chassi);

    let statusPessoal: number = this.getStatusUsoPessoal();
    let respostaPessoal: String = this.getRespostaUsoPessoal();

    // let pessoal = {
    //   pergunta: 'Uso pessoal?', status: statusPessoal, resposta: respostaPessoal,
    //   mostrar: ((this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.codigoControle != "ERRO_FORNECEDOR") || (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.codigoControle != "ERRO_FORNECEDOR") || (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.codigoControle != "ERRO_FORNECEDOR")) ? 'S' : 'N'
    // };
    // if (pessoal.mostrar == 'S')
    //   this.resumoEstrutural.push(pessoal);

    let statusDecodificacao: number = this.getStatusDecodificacao();
    let respostaDecodificacao: String = this.getRespostaDecodificacao();

    let decodificacao = {
      pergunta: 'Verificação correta?', status: statusDecodificacao, resposta: respostaDecodificacao,
      mostrar: this.dadosConsulta.decodificador != null && this.dadosConsulta.decodificador.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    };
    if (decodificacao.mostrar == 'S')
      this.resumoEstrutural.push(decodificacao);


      let statusParecerTecnico: number = this.getStatusParecerTecnico();
      let respostaParecerTecnico: String = this.getRespostaParecerTecnico();

      let parecerTecnico = {
        pergunta: 'Possui risco de mercado?', status: statusParecerTecnico, resposta: respostaParecerTecnico,
        mostrar: this.mostrarParecerTecnico()
      };

      if (parecerTecnico.mostrar == 'S')
        this.resumoEstrutural.push(parecerTecnico);

    let statusPagamento: number = this.getStatusMultas();
    let respostaPagamento: String = this.getRespostaMultas();

    // let pagamento = {
    //   pergunta: 'Pagamento contínuo?', status: 1, resposta: '----',
    //   mostrar: this.dadosConsulta.binestadual != null ? 'S' : 'N'
    // };
    // if (pagamento.mostrar == 'S')
    //   this.resumoEstrutural.push(pagamento);

    // let statusSeguradora: number = this.getStatusJaFoiSeguradora();
    // let respostaSeguradora: String = this.getRespostaJaFoiSeguradora();

    // let seguradora = {
    //   pergunta: 'Já foi de seguradora?', status: statusSeguradora, resposta: respostaSeguradora,
    //   mostrar: this.dadosConsulta.proprietarios != null && this.dadosConsulta.proprietarios.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    // };
    // if (seguradora.mostrar == 'S')
    //   this.resumoEstrutural.push(seguradora);

    let statusReanajud: number = this.getStatusRenajud();
    let respostaRenajud: String = this.getRespostaRenajud();

    let renajud = {
      pergunta: 'Registro no Renajud?', status: statusReanajud, resposta: respostaRenajud,
      mostrar: this.dadosConsulta.binrenajud != null && this.dadosConsulta.binrenajud.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    };
    if (renajud.mostrar == 'S')
      this.resumoEstrutural.push(renajud);

    let statusRecall: number = this.getStatusRecall();
    var respostaRecall: String = this.getRespostaRecall();

    let recall = {
      pergunta: 'Possui recall?', status: statusRecall, resposta: respostaRecall,
      mostrar: this.dadosConsulta.recall != null && this.dadosConsulta.recall.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    };
    if (recall.mostrar == 'S')
      this.resumoEstrutural.push(recall);

    let statusSinistro: number = this.getStatusSinistro();
    let respostaSinistro: String = this.getRespostaSinistro();

    let sinistro = {
      pergunta: 'Sinistro encontrado?', status: statusSinistro, resposta: respostaSinistro,
      mostrar: (this.dadosConsulta.sinistro != null && this.dadosConsulta.sinistro.codigoControle != "ERRO_FORNECEDOR") || (this.dadosConsulta.pt != null && this.dadosConsulta.pt.codigoControle != "ERRO_FORNECEDOR") ? 'S' : 'N'
    };
    if (sinistro.mostrar == 'S')
      this.resumoEstrutural.push(sinistro);

    let statusLeilao: number = this.getStatusLeilao();
    let respostaLeilao: String = this.getRespostaLeilao();

    let leilao = {
      pergunta: 'Leilão encontrado?', status: statusLeilao, resposta: respostaLeilao,
      mostrar: this.dadosConsulta.leilao != null && this.dadosConsulta.leilao.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    };

    if (leilao.mostrar == 'S')
      this.resumoEstrutural.push(leilao);

    let statusRemarketing: number = this.getStatusRemarketing();
    let respostaRemarketing: String = this.getRespostaRemarketing();

    let remarketing = {
      pergunta: 'Remarketing encontrado?', status: statusRemarketing, resposta: respostaRemarketing,
      mostrar: this.dadosConsulta.remarketing != null && this.dadosConsulta.remarketing.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    };
    if (remarketing.mostrar == 'S')
      this.resumoEstrutural.push(remarketing);


  }

  criaResumoLegal() {

    let statusHistoricoRoubo: number = this.getStatusHistoricoRoubo();
    let respostaRoubado: String = this.getHistoricoRoubo();

    let roubado = {
      pergunta: 'Possui Historico de roubo e furto?', status: statusHistoricoRoubo, resposta: respostaRoubado,
      mostrar: this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    };
    if (roubado.mostrar == 'S')
      this.resumoLegal.push(roubado);

    let statusFinanciado: number = this.getStatusFinanciado();
    let respostaFinanciado: String = this.getRespostaFinanciado();

    let financiado = {
      pergunta: 'Veículo financiado?', status: statusFinanciado, resposta: respostaFinanciado,
      mostrar: this.dadosConsulta.gravame != null && this.dadosConsulta.gravame.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    };
    if (financiado.mostrar == 'S')
      this.resumoLegal.push(financiado);

    let statusCirculacao: number = this.getStatusCirculacao();
    let respostaCirculacao: String = this.getRespostaCirculacao();

    // let circulacao = {
    //   pergunta: 'Veículo em circulação?', status: statusCirculacao, resposta: respostaCirculacao,
    //   mostrar: ((this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.codigoControle != "ERRO_FORNECEDOR") || (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.codigoControle != "ERRO_FORNECEDOR") || (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.codigoControle != "ERRO_FORNECEDOR")) ? 'S' : 'N'
    // };
    // if (circulacao.mostrar == 'S')
    //   this.resumoLegal.push(circulacao);

    // let statusMultas: number = this.getStatusMultas();
    // let respostaMultas: String = this.getRespostaMultas();

    // let multas = {
    //   pergunta: 'Possui multas ESTADUAIS?', status: statusMultas, resposta: respostaMultas,
    //   mostrar: this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    // };
    // if (multas.mostrar == 'S')
    //   this.resumoLegal.push(multas);

    // let statusDebitos: number = this.getStatusDebitos();
    // let respostaDebitos: String = this.getRespostaDebitos();

    // let debitos = {
    //   pergunta: 'Possui débitos ESTADUAIS?', status: statusDebitos, resposta: respostaDebitos,
    //   mostrar: this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    // };
    // if (debitos.mostrar == 'S')
    //   this.resumoLegal.push(debitos);

    // let statusDPVAT: number = this.getStatusDpvat();
    // let respostaDPVAT: String = this.getRespostaDpvat();

    // let dpvat = {
    //   pergunta: 'DPVAT atual pago?', status: statusDPVAT, resposta: respostaDPVAT,
    //   mostrar: this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    // };
    // if (dpvat.mostrar == 'S')
    //   this.resumoLegal.push(dpvat);

    let statusDuplicidade: number = this.getStatusDuplicidade();
    var respostaDuplicidade: String = this.getRespostaDuplicidade();

    let duplicidade = {
      pergunta: 'Motor duplicado na BIN?', status: statusDuplicidade, resposta: respostaDuplicidade,
      mostrar: this.dadosConsulta.duplicidade != null && this.dadosConsulta.duplicidade.codigoControle != "ERRO_FORNECEDOR" ? 'S' : 'N'
    };
    if (duplicidade.mostrar == 'S')
      this.resumoLegal.push(duplicidade);

    let statusRestricoes: number = this.getStatusRestricoes();
    let respostaRestricoes: String = this.getRespostaRestricoes();
    /*
    let possuiRestricao = {
      pergunta: 'Possui restrições?', status: statusRestricoes, resposta: respostaRestricoes,
      mostrar: ((this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.codigoControle != "ERRO_FORNECEDOR") || (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.codigoControle != "ERRO_FORNECEDOR") || (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.codigoControle != "ERRO_FORNECEDOR") || (this.dadosConsulta.denatran != null && this.dadosConsulta.denatran.codigoControle != "ERRO_FORNECEDOR")) ? 'S' : 'N'
    };
    if (possuiRestricao.mostrar == 'S')
      this.resumoLegal.push(possuiRestricao);
    */
  }


  getStatusUsoPessoal() {
    if (this.dadosConsulta.binestadual != null &&
      this.dadosConsulta.binestadual.dadosveiculo != null &&
      this.dadosConsulta.binestadual.dadosveiculo.categoria != null) {
      if (this.dadosConsulta.binestadual.dadosveiculo.categoria == 'PARTICULAR') {
        return 0;
      } else {
        return 2;
      }
    }
  }

  getStatusDecodificacao() {
    if (this.dadosConsulta.decodificador != null && this.dadosConsulta.decodificador.dadosveiculo != null) {
      return 0;
    } else {
      return 2;
    }
  }


  mostrarParecerTecnico(){

    if(this.dadosConsulta.sinistro != null && this.dadosConsulta.sinistro.codigoControle != "ERRO_FORNECEDOR" &&
        this.dadosConsulta.sinistro.indicioSinistro!=null && this.dadosConsulta.sinistro.indicioSinistro.statusParecer!="" && this.dadosConsulta.sinistro.indicioSinistro.statusParecer!=null){

          return "S";
    }else if(this.dadosConsulta.parecerTecnico != null && this.dadosConsulta.parecerTecnico.codigoControle != "ERRO_FORNECEDOR"){

        return "S";
    }else{
      return "N";
    }
  }

  getStatusRenajud() {
    if (this.dadosConsulta.binrenajud != null && this.dadosConsulta.binrenajud.renajud != null) {
      return 1;
    } else {
      return 0;
    }
  }

  getStatusSinistro() {

    if (this.dadosConsulta.sinistro != null && this.dadosConsulta.sinistro.indicioSinistro != null && this.dadosConsulta.sinistro.indicioSinistro.temSinistro != false) {
      return 2;
    }
    if (this.dadosConsulta.pt != null && this.dadosConsulta.pt.ptPositivo == true) {
      return 2;
    }
    else {
      return 0;
    }
  }

  getStatusLeilao() {

    if (this.dadosConsulta.leilao != null && this.dadosConsulta.leilao.dadosLeilao.length > 0) {
      return 2;
    } else {
      return 0;
    }
  }

  getStatusRemarketing() {

    if (this.dadosConsulta.remarketing != null && this.dadosConsulta.remarketing.ocorrencia.length > 0) {
      return 2;
    } else {
      return 0;
    }
  }

  getStatusHistoricoRoubo() {
    if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.rf != null && this.dadosConsulta.binrf.rf.length > 0) {
      return 2;
    } else {
      return 0;
    }
  }

  getStatusChassiRemarcado() {
    if (this.dadosConsulta.decodificador != null &&
      this.dadosConsulta.decodificador.dadosveiculo != null &&
      this.dadosConsulta.decodificador.dadosveiculo.remarcacaoChassi != null) {
      return 2;
    } else {

      return 0;
    }
  }

  getStatusJaFoiSeguradora() {
    let seguradora: String;
    if (this.dadosConsulta.proprietarios != null &&
      this.dadosConsulta.proprietarios.item != null &&
      this.dadosConsulta.proprietarios.item.nomeProprietario != null) {
      seguradora = this.dadosConsulta.proprietarios.item.nomeProprietario;
      if ((seguradora.includes('CORRETORA')) || (seguradora.includes('CORRETORA'))) {
        return 2;
      } else {
        return 0;
      }
    } else {
      return 0;
    }

  }




  getRespostaUsoPessoal() {
    if (this.dadosConsulta.binestadual != null &&
      this.dadosConsulta.binestadual.dadosveiculo != null &&
      this.dadosConsulta.binestadual.dadosveiculo.categoria != null) {
      if (this.dadosConsulta.binestadual.dadosveiculo.categoria == 'PARTICULAR') {
        return 'Sim';
      } else {
        return 'Não';
      }

    } else {
      return 'Não';
    }
  }

  getRespostaDecodificacao() {
    if (this.dadosConsulta.decodificador != null && this.dadosConsulta.decodificador.dadosveiculo != null) {
      return 'Sim';
    } else {
      return 'Não';
    }
  }

  getRespostaRenajud() {
    if (this.dadosConsulta.binrenajud != null && this.dadosConsulta.binrenajud.renajud != null) {
      return 'Sim';
    } else {
      return 'Não';
    }
  }

  getRespostaParecerTecnico() {
    if (this.dadosConsulta.sinistro != null && (this.dadosConsulta.sinistro.indicioSinistro!=null && this.dadosConsulta.sinistro.indicioSinistro.statusParecer != null && this.dadosConsulta.sinistro.indicioSinistro.statusParecer!="")) {
        if(this.dadosConsulta.sinistro.indicioSinistro.statusParecer == '1'){
          return 'Não';
        }else{
          return 'Sim';
        }
    }else if(this.dadosConsulta.parecerTecnico != null && (this.dadosConsulta.parecerTecnico.parecerTecnico!=null && this.dadosConsulta.parecerTecnico.parecerTecnico.statusParecer != null && this.dadosConsulta.parecerTecnico.parecerTecnico.statusParecer!="") ) {
      if(this.dadosConsulta.parecerTecnico.parecerTecnico.statusParecer == '1'){
        return 'Não';
      }else{
        return 'Sim';
      }
    }else{
      return "Não";
    }
  }


  getStatusParecerTecnico() {
    if (this.dadosConsulta.sinistro != null && (this.dadosConsulta.sinistro.indicioSinistro!=null && this.dadosConsulta.sinistro.indicioSinistro.statusParecer != null && this.dadosConsulta.sinistro.indicioSinistro.statusParecer!="")) {
        if(this.dadosConsulta.sinistro.indicioSinistro.statusParecer == '1'){
          return 0;
        }else if(this.dadosConsulta.sinistro.indicioSinistro.statusParecer == '2'){
          return 2;
        } else{
          return 2;
        }
    }else if(this.dadosConsulta.parecerTecnico != null && (this.dadosConsulta.parecerTecnico.parecerTecnico!=null && this.dadosConsulta.parecerTecnico.parecerTecnico.statusParecer != null && this.dadosConsulta.parecerTecnico.parecerTecnico.statusParecer!="") ) {
      if(this.dadosConsulta.parecerTecnico.parecerTecnico.statusParecer == '1'){
        return 0;
      }else if(this.dadosConsulta.parecerTecnico.parecerTecnico.statusParecer =='2'){
        return 2;
      } else{
        return 2;
      }
  }else {
    return 0;
  }
}





  getRespostaSinistro() {
    if (this.dadosConsulta.sinistro != null && this.dadosConsulta.sinistro.indicioSinistro != null && this.dadosConsulta.sinistro.indicioSinistro.temSinistro != false) {
      return 'Sim';
    }
    if (this.dadosConsulta.pt != null && this.dadosConsulta.pt.ptPositivo != false) {
      return 'Sim';
    }
    else {
      return 'Não';
    }
  }

  getRespostaLeilao() {
    if (this.dadosConsulta.leilao != null && this.dadosConsulta.leilao.dadosLeilao.length > 0) {
      return 'Sim';
    } else {
      return 'Não';
    }
  }

  getRespostaRemarketing() {
    if (this.dadosConsulta.remarketing != null && this.dadosConsulta.remarketing.ocorrencia.length > 0) {
      return 'Sim';
    } else {
      return 'Não';
    }
  }

  getStatusRestricoes() {
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.restricoes.length > 0) {
      return 2;

    } else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.restricoes.length > 0) {
      return 2;

    } else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.restricoes.length > 0) {
      return 2;

    } else if(this.dadosConsulta.denatran!=null && this.dadosConsulta.denatran.restricoesDenatran != null && this.dadosConsulta.denatran.restricoesDenatran.length > 0 ){
      return 2;

    } else {
      return 0;

    }
  }

  getStatusDpvat() {
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosDebito != null) {
      if (this.dadosConsulta.binestadual.dadosDebito.dpvat > 0) {
        return 2;
      } else {
        return 0;
      }

    } else {
      return 0;
    }
  }

  getRespostaDpvat() {
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosDebito != null) {
      if (this.dadosConsulta.binestadual.dadosDebito.dpvat > 0) {
        return 'Não';
      } else {
        return 'Sim';
      }

    } else {
      return 'Sim';
    }
  }


  getStatusMultas() {
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosMulta != null) {
      return 2;

    } else {
      return 0;
    }
  }

  getStatusDebitos() {
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosDebito != null) {
      return 2;

    } else {
      return 0;
    }
  }

  getStatusCirculacao() {
    if (this.dadosConsulta.binestadual != null &&
      this.dadosConsulta.binestadual.dadosveiculo != null &&
      this.dadosConsulta.binestadual.dadosveiculo.situacaoVeiculo == 'CIRCULACAO') {
      return 0;

    } else {
      return 2;
    }
  }

  getStatusDuplicidade() {
    if (this.dadosConsulta.duplicidade != null && this.dadosConsulta.duplicidade.ocorrencia.length > 0) {
      return 2;
    } else {
      return 0;
    }
  }

  getStatusRecall() {
    if (this.dadosConsulta.recall != null && this.dadosConsulta.recall.ocorrencia.length > 0) {
      return 2;
    } else {
      return 0;
    }
  }

  getRespostaRecall() {
    if (this.dadosConsulta.recall != null && this.dadosConsulta.recall.ocorrencia.length > 0) {
      return 'Sim';
    } else {
      return 'Não';
    }
  }

  getRespostaRestricoes() {
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.restricoes.length > 0) {
      return 'Sim';

    } else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.restricoes.length > 0) {
      return 'Sim';

    } else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.restricoes.length > 0) {
      return 'Sim';

    } else if(this.dadosConsulta.denatran!=null && this.dadosConsulta.denatran.restricoesDenatran != null && this.dadosConsulta.denatran.restricoesDenatran.length > 0 ){
      return 'Sim';
    }
    else {
      return 'Não';
    }
  }

  getRespostaMultas() {
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosMulta != null) {
      return 'Sim';

    } else {
      return 'Não';
    }
  }

  getRespostaDebitos() {
    if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosDebito != null) {
      return 'Sim';

    } else {
      return 'Não';
    }
  }

  getRespostaCirculacao() {
    if (this.dadosConsulta.binestadual != null &&
      this.dadosConsulta.binestadual.dadosveiculo != null &&
      this.dadosConsulta.binestadual.dadosveiculo.situacaoVeiculo == 'CIRCULACAO') {
      return 'Sim';

    } else {
      return 'Não';
    }
  }

  getRespostaDuplicidade() {
    if (this.dadosConsulta.duplicidade != null && this.dadosConsulta.duplicidade.ocorrencia.length > 0) {
      return 'Sim';
    } else {
      return 'Não';
    }
  }

  getRespostaRoubo() {
    if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.rf != null && this.dadosConsulta.binrf.rf.lenght > 0) {
      return 'Sim';
    } else {
      return 'Não';
    }
  }

  getRespostaChassiRemarcado() {
    if (this.dadosConsulta.binestadual != null &&
      this.dadosConsulta.binestadual.dadosveiculo != null &&
      this.dadosConsulta.binestadual.dadosveiculo.remarcacaoChassi != null &&
      this.dadosConsulta.binestadual.dadosveiculo.remarcacaoChassi.toUpperCase() == 'REMARCADO') {
      return 'Sim';
    } else {
      return 'Não';
    }
  }

  getRespostaJaFoiSeguradora() {
    let seguradora: String;
    if (this.dadosConsulta.proprietarios != null &&
      this.dadosConsulta.proprietarios.item != null &&
      this.dadosConsulta.proprietarios.item.nomeProprietario != null) {
      seguradora = this.dadosConsulta.proprietarios.item.nomeProprietario;
      if ((seguradora.includes('CORRETORA')) || (seguradora.includes('CORRETORA'))) {
        return 'Sim';
      } else {
        return 'Não';
      }
    } else {
      return 'Não';
    }

  }

  getStatusFinanciado() {
    let financiado: String;
    let achou: boolean = false;
    if (this.dadosConsulta.gravame != null &&
      this.dadosConsulta.gravame.dadosGravame != null) {
      for (let i = 0; i < this.dadosConsulta.gravame.dadosGravame.length; i++) {
        if (this.dadosConsulta.gravame.dadosGravame[i].descricaoStatus != null) {
          financiado = this.dadosConsulta.gravame.dadosGravame[i].descricaoStatus;

          if ((financiado.includes('INCLUIDO INCLUDO')) || (financiado.includes('INCLUDO')) || (financiado.includes('COM DOCUMENTO')) || (financiado.includes('ALIENAÇÃO FIDUCIÁRIA')) || (financiado.includes('COM ARRENDAMENTO'))) {
            achou = true;
          }
        }
      }

      if (achou) {
        return 2;
      } else {
        return 0;
      }
    }

  }

  getRespostaFinanciado() {
    let financiado: String;
    let achou: boolean = false;
    if (this.dadosConsulta.gravame != null &&
      this.dadosConsulta.gravame.dadosGravame != null) {
      for (let i = 0; i < this.dadosConsulta.gravame.dadosGravame.length; i++) {
        if (this.dadosConsulta.gravame.dadosGravame[i].descricaoStatus != null) {
          financiado = this.dadosConsulta.gravame.dadosGravame[i].descricaoStatus;

          if ((financiado.includes('INCLUIDO INCLUDO')) || (financiado.includes('INCLUDO')) || (financiado.includes('COM DOCUMENTO')) || (financiado.includes('ALIENAÇÃO FIDUCIÁRIA')) || (financiado.includes('COM ARRENDAMENTO'))) {
            achou = true;
          }
        }

      }

      if (achou) {
        return 'Sim';
      } else {
        return 'Não';
      }
    }

  }

  // numberToCurrency(numero) {
  //   var numero = numero.toFixed(2).split('.');
  //   numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
  //   return numero.join(',');
  // }

  // numberToReal(numero) {
  //   if (numero != "----") {
  //     numero = numero.split('.');//.toFixed(2)
  //     numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
  //     return parseFloat(numero[0]).toFixed(2);
  //   } else {
  //     return "----";
  //   }
  // }

  qtdeCamposObjeto(Obj) {
    var arrayTemp = new Array();
    for (var fieldsJSON in Obj) {
      arrayTemp.push(fieldsJSON);
    }
    return arrayTemp.length;

  }

  getValoresMercado() {
    this.vprecoMedioBr = "0.00";
    this.vprecoMolicar = "0.00";
    this.vprecoMedioUf = "0.00";
    this.vprecoFipeString = "0.00";
    this.vprecoFipeDouble = 0.00;

    if (this.dadosConsulta.dadosResumo != null) {
      if (this.dadosConsulta.dadosResumo.precoFipe != null && this.dadosConsulta.dadosResumo.precoFipe.indexOf("-")==-1) {
        this.vprecoFipeString = this.dadosConsulta.dadosResumo.precoFipe.replace("R$ ","");
      }
    }

    if (this.dadosConsulta.dadosResumo != null) {
      if (this.dadosConsulta.dadosResumo.precoMedioUf != null) {
        this.vprecoMedioUf = this.dadosConsulta.dadosResumo.precoMedioUf;
      }
    }

    if (this.dadosConsulta.dadosResumo != null) {
      if (this.dadosConsulta.dadosResumo.precoMedioBr != null) {
        this.vprecoMedioBr = this.dadosConsulta.dadosResumo.precoMedioBr;
      }
    }

    if (this.dadosConsulta.dadosResumo != null) {
      if (this.dadosConsulta.dadosResumo.precoMolicar != null) {
        this.vprecoMolicar = this.dadosConsulta.dadosResumo.precoMolicar;
      }
    }

  }

    //   if (this.dadosConsulta.precificador != null) {
    //     if (this.dadosConsulta.precificador.ocorrencia[0].precoFipe !=
    //       null) {
    //       this.vprecoFipeString =
    //         this.vprecoFipeString.replace(".", "");
    //       this.vprecoFipeDouble = parseFloat(this.vprecoFipeString);
    //     }
    //   }
    //   let vDesvalorizacao: string = this.getDesvalorizacaoAtual();
    //   //Preço BR
    //   if (this.dadosConsulta.consultaprecowebmotors.codigoControle != 'SEMREGISTRO' &&
    //     this.dadosConsulta.consultaprecowebmotors.codigoControle != 'PENDENTE' &&
    //     this.dadosConsulta.consultaprecowebmotors.codigoControle != 'ERRO_FORNECEDOR') {
    //     if (this.dadosConsulta.consultaprecowebmotors == null ||
    //       this.dadosConsulta.consultaprecowebmotors.precoBR.valorMedio ==
    //       "0.00") {
    //       this.vprecoMedioBr = (this.vprecoFipeDouble * 0.97).toString();
    //     } else {
    //       this.vprecoMedioBr = this.dadosConsulta.consultaprecowebmotors.precoBR.valorMedio;
    //     }
    //   } else if (vDesvalorizacao != null && vDesvalorizacao!="0") {
    //     this.vprecoMedioBr = vDesvalorizacao;
    //   } else {
    //     this.vprecoMedioBr = (this.vprecoFipeDouble * 0.97).toString();
    //   }
    //   //PrecoBR

    //   //Preco Molicar
    //   if (this.dadosConsulta.consultaprecowebmotors.codigoControle != 'SEMREGISTRO' &&
    //     this.dadosConsulta.consultaprecowebmotors.codigoControle != 'PENDENTE' &&
    //     this.dadosConsulta.consultaprecowebmotors.codigoControle != 'ERRO_FORNECEDOR') {
    //     if (this.dadosConsulta.consultaprecowebmotors == null ||
    //       this.dadosConsulta.consultaprecowebmotors.PrecoWebMotors.valorFipe == "0") {
    //       this.vprecoMolicar = (this.vprecoFipeDouble * 0.9675).toString();
    //     } else {
    //       this.vprecoMolicar = this.dadosConsulta.consultaprecowebmotors.PrecoWebMotors.valorFipe;
    //       this.vprecoFipeString = this.dadosConsulta.consultaprecowebmotors.PrecoWebMotors.valorFipe;
    //     }
    //   } else {
    //     this.vprecoMolicar = (this.vprecoFipeDouble * 0.9675).toString();
    //   } //Preco Molicar

    //   //Preco Médio UF
    //   if (this.dadosConsulta.consultaprecowebmotors.codigoControle != 'SEMREGISTRO' &&
    //     this.dadosConsulta.consultaprecowebmotors.codigoControle != 'PENDENTE' &&
    //     this.dadosConsulta.consultaprecowebmotors.codigoControle != 'ERRO_FORNECEDOR') {
    //     if (this.dadosConsulta.consultaprecowebmotors == null ||
    //       this.dadosConsulta.consultaprecowebmotors.precoBR.valorMedio ==
    //       "0.00") {
    //       this.vprecoMedioUf = (this.vprecoFipeDouble * 0.9672).toString();
    //     } else {
    //       this.vprecoMedioUf = this.dadosConsulta.consultaprecowebmotors.precoBR.valorMedio;
    //     }
    //   } else {
    //     this.vprecoMedioUf = (this.vprecoFipeDouble * 0.9672).toString();
    //   } //Preco Preco Médio UF
    // }

  }
