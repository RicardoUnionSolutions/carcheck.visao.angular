import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGDirective } from '../../../directives/inline-svg.directive';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { ConsultaMsgComponent } from '../../consulta-msg/consulta-msg.component';

@Component({
    selector: 'dados-estaduais',
    templateUrl: './dados-estaduais.component.html',
    styleUrls: ['./dados-estaduais.component.scss'],
    standalone: true,
    imports: [CommonModule, ConsultaMsgComponent]
})
export class DadosEstaduaisComponent implements OnInit {

  @Input() dadosDetalhamentoBinEstadual: any;
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

    this.statusConsulta = this.dadosDetalhamentoBinEstadual.codigoControle == "ERRO_FORNECEDOR" ? 5 : 0;
    switch (this.dadosDetalhamentoBinEstadual.codigoControle) {
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
    //console.log(this.dadosDetalhamentoBinEstadual);
    //console.log('idConsultaInterna',this.dadosDetalhamentoBinEstadual.consultaInterna.idConsultaInterna);

    this.dadosConsultaService
      .getRecarregarConsultaInterna(this.dadosDetalhamentoBinEstadual.consultaInterna.idConsultaInterna)
      .subscribe((data: any) => {
        this.dadosDetalhamentoBinEstadual = data;
        switch (this.dadosDetalhamentoBinEstadual.codigoControle) {
          case "ERRO_FORNECEDOR":
            this.statusReload = 2;
            this.setStatusConsulta();
            break;
          case "OK":
          case "SEMREGISTRO":
            this.statusReload = 0;
            this.setStatusConsulta();
            data.mudouStatus = true;
            this.consulta.binestadual = data;
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



  // Dados cadastrais binestadual

    verificaPlaca(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.placa != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.placa
      }else{
        return "não informado"
      }
    }

    verificaChassi(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.chassi != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.chassi
      }else{
        return "não informado"
      }
    }

    verificaNrMotorOriginal(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.nrMortorOriginal != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.nrMotorOriginal
      }else{
        return "não informado"
      }
    }

    verificaNrMotor(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.nrMotor != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.nrMotor
      }else {
        return "não informado"
      }
    }

    verificaCambio(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.nrCambio != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.nrCambio
      }else{
        return "não informado"
      }
    }

    verificaPotencia(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.potencia != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.potencia
      }else{
        return "não informado"
      }
    }

    verificaCilindradas(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.cilindrada != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.cilindrada
      }else{
        return "não informado"
      }
    }

    verificaRenavam(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.renavam != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.renavam
      }else{
        return "não informado"
      }
    }

    verificaDocumento(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.documentoComprador != null){
        var documento = this.dadosDetalhamentoBinEstadual.dadosveiculo.documentoComprador;
        documento = documento.replace(/\.|\-/g, '');
       if(documento.length == 11){
        return 'CPF'
       }else{
        return 'CNPJ'
       }
      }else{
        return "não informado"
      }
    }

    verificaDataCrvCrlv(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.dataCrvCrlv != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.dataCrvCrlv
      }else{
        return "não informado"
      }
    }

    verificaDataLicenciamento(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.dataLicenciamento != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.dataLicenciamento
      }else{
        return "não informado"
      }
    }

    verificaDataUltimaAtualizacao(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.dataUltimaAtualizacao != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.dataUltimaAtualizacao
      }else{
        return "não informado"
      }
    }

    verificaMunicipio(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.municipio != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.municipio
      }else{
        return "não informado"
      }
    }

    verificaUf(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.uf != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.uf
      }else{
        return "não informado"
      }
    }


    //Descrição do veiculo


    verificaMarcaModelo(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.marca != null && this.dadosDetalhamentoBinEstadual?.dadosveiculo?.modelo != null ){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.marca + " / " + this.dadosDetalhamentoBinEstadual.dadosveiculo.modelo
      }else{
        return "não informado"
      }
    }

    verificaCor(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.cor != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.cor
      }else{
        return "não informado"
      }
    }

    verificaAnoFabricacao(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.anoFabricacao != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.anoFabricacao
      }else{
        return "não informado"
      }
    }

    verificaEspecie(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.especie != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.especie
      }else{
        return "não informado"
      }
    }

    verificaAnoModelo(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.anoModelo != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.anoModelo
      }else{
        return "não informado"
      }
    }

    verificaNrPassageiros(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.capacidadePassageiros != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.capacidadePassageiros
      }else{
        return "não informado"
      }
    }

    verificaCombustivel(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.combustivel != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.combustivel
      }else{
        return "não informado"
      }
    }

    verificaCategoria(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.categoria != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.categoria
      }else{
        return "não informado"
      }
    }

    verificaSegmento(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.segmento != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.segmento
      }else{
        return "não informado"
      }
    }

    verificaSubSegmento(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.subSegmento != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.subSegmento
      }else{
        return "não informado"
      }
    }


    // PROPRIETARIOS


    verificaPropAnterior(){
      if(this.dadosDetalhamentoBinEstadual?.dadosProprietario?.nomeProprietarioAnterior != null){
        return this.dadosDetalhamentoBinEstadual?.dadosProprietarios?.nomeProprietarioAnterior
      }else{
        return "não informado"
      }
    }

    verificaPropAtual(){
      if(this.dadosDetalhamentoBinEstadual?.dadosProprietario?.nomeProprietario != null){
        return this.dadosDetalhamentoBinEstadual?.dadosProprietarios?.nomeProprietario
      }else{
        return "não informado"
      }
    }

    verificaDocumentoProp(){
      if(this.dadosDetalhamentoBinEstadual?.dadosProprietario?.documentoProprietario != null){
        return this.dadosDetalhamentoBinEstadual?.dadosProprietarios?.documentoProprietario
      }else{
        return "não informado"
      }
    }




    // FICHA TECNICA

    verificaTipoMontagem(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.montagem != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.montagem
      }else{
        return "não informado"
      }
    }

    verificaTipoVeiculo(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.tipo != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.tipo
      }else{
        return "não informado"
      }
    }

    verificaPesoBruto(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.pbt != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.pbt
      }else{
        return "não informado"
      }
    }

    verificaCapacidadeCarga(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.capacidadeDeCarga != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.capacidadeDeCarga
      }else{
        return "não informado"
      }
    }

    verificaCapacidadeTracao(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.cmt != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.cmt
      }else{
        return "não informado"
      }
    }

    verificaTipoCarroceria(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.carroceria != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.carroceria
      }else{
        return "não informado"
      }
    }

    verificaNrCarroceria(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.nrCarroceria != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.nrCarroceria
      }else{
        return "não informado"
      }
    }

    verificaCarroceria(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.carroceria != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.carroceria
      }else{
        return "não informado"
      }
    }

    verificaQuantidadeEixos(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.nrEixos != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.nrEixos
      }else{
        return "não informado"
      }
    }

    verificaTerceiroEixo(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.terceiroEixo != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.terceiroEixo
      }else{
        return "não informado"
      }
    }

    verificaEixoTraseiro(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo?.eixoTrasDiferencial != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo.eixoTrasDiferencial
      }else{
        return "não informado"
      }
    }

    verificaProtocoloDetran(){
      if(this.dadosDetalhamentoBinEstadual?.dadosveiculo != null){
        return this.dadosDetalhamentoBinEstadual.dadosveiculo
      }else{
        return "não informado"
      }
    }


    // COMUNICAÇÃO DE VENDA


    verificaDataVenda(){
      return "não informado"
    }

    verificaDataInclusaoVenda(){
      return "não informado"
    }

    verificaIndicadorVenda(){
      if(this.dadosDetalhamentoBinEstadual?.restricoes.length > 0){
        for (const r of this.dadosDetalhamentoBinEstadual?.restricoes) {
          if(r.descricao.includes("COMUNICACAO DE VENDA")){
            return "CONSTA COMUNICAÇÃO DE VENDA"
          }else{
           return "NÃO CONSTA"
          }
        }
      } else{
        return "NAO CONSTA COMUNICADO DE VENDA"
      }
    }


    // RESTRICOES

    verificaAdministrativa(){
      if(this.dadosDetalhamentoBinEstadual?.restricoes.length > 0){
        for (const r of this.dadosDetalhamentoBinEstadual?.restricoes) {
          if(r.descricao.includes("ADMINISTRATIVA")){
            return "CONSTA ADMINISTRATIVA "
          }else{
           return "NÃO CONSTA"
          }
        }
      } else{
        return "NÃO CONSTA"
      }
    }

    verificaAlienacao(){
      if(this.dadosDetalhamentoBinEstadual?.restricoes.length >0){
        for (const r of this.dadosDetalhamentoBinEstadual?.restricoes) {
          if(r.descricao.includes("ALIENAÇÃO")){
            return "CONSTA ALIENAÇÃO "
          }else{
           return "NÃO CONSTA"
          }
        }
      } else{
        return "NÃO CONSTA"
      }
    }

    verificaArrendamento(){
      if(this.dadosDetalhamentoBinEstadual?.restricoes.length >0){
        for (const r of this.dadosDetalhamentoBinEstadual?.restricoes) {
          if(r.descricao.includes("ARRENDAMENTO")){
            return "CONSTA ARRENDAMENTO "
          }else{
           return "NÃO CONSTA"
          }
        }
      } else{
        return "NÃO CONSTA"
      }
    }

    verificaJudicial(){
      if(this.dadosDetalhamentoBinEstadual?.restricoes.length >0){
        for (const r of this.dadosDetalhamentoBinEstadual?.restricoes) {
          if(r.descricao.includes("JUDICIAL")){
            return "CONSTA JUDICIAL "
          }else{
           return "NÃO CONSTA"
          }
        }
      } else{
        return "NÃO CONSTA"
      }
    }

    verificaReserva(){
      if(this.dadosDetalhamentoBinEstadual?.restricoes.length >0){
        for (const r of this.dadosDetalhamentoBinEstadual?.restricoes) {
          if(r.descricao.includes("RESERVA")){
            return "CONSTA RESERVA "
          }else{
           return "NÃO CONSTA"
          }
        }
      } else{
        return "NÃO CONSTA"
      }
    }

    verificaRF(){
      if(this.dadosDetalhamentoBinEstadual?.restricoes.length >0){
        for (const r of this.dadosDetalhamentoBinEstadual?.restricoes) {
          if(r.descricao.includes("ROUBO E FURTO ATIVO")){
            return "HÁ ROUBO E FURTO ATIVO "
          }else{
           return "NÃO CONSTA"
          }
        }
      } else{
        return "NÃO CONSTA"
      }
    }

    verificaSinistroRecuperado(){
      if(this.dadosDetalhamentoBinEstadual?.restricoes.length >0){
        for (const r of this.dadosDetalhamentoBinEstadual?.restricoes) {
          if(r.descricao.includes("SINISTRO RECUPERADO")){
            return "CONSTA SINISTRO RECUPERADO "
          }else{
           return "NÃO CONSTA"
          }
        }
      } else{
        return "NÃO CONSTA"
      }
    }

    verificaTributario(){
      if(this.dadosDetalhamentoBinEstadual?.restricoes.length >0){
        for (const r of this.dadosDetalhamentoBinEstadual?.restricoes) {
          if(r.descricao.includes("TRIBUTARIO")){
            return "CONSTA TRIBUTARIO "
          }else{
           return "NÃO CONSTA"
          }
        }
      } else{
        return "NÃO CONSTA"
      }
    }

    verificaObservacoes(){
      if(this.dadosDetalhamentoBinEstadual?.restricoes.length >0){
        for (const r of this.dadosDetalhamentoBinEstadual?.restricoes) {
          if(r.descricao != 'ADMINISTRATIVA' &&
            r.descricao != 'ALIENAÇÃO' &&
            r.descricao != 'ARRENDAMENTO' &&
            r.descricao != 'JUDICIAL' &&
            r.descricao != 'RESERVA' &&
            r.descricao != 'ROUBO E FURTO ATIVO' &&
            r.descricao != 'SINISTRO RECUPERADO'&&
            r.descricao != 'TRIBUTARIO' &&
            r.descricao != 'COMUNICACAO DE VENDA'
          ){
            return r.descricao
          }else{
            return "NÃO CONSTA"
          }
        }
      } else{
        return "NÃO CONSTA"
      return "NÃO CONSTA"
      }
    }

    // GRAVAME

    verificaAgenteFinanceiro(){
      if(this.dadosDetalhamentoBinEstadual?.dadosGravame?.nomeAgente != null){
        return this.dadosDetalhamentoBinEstadual.dadosGravame.nomeAgente;
      }else{
      return "NÃO CONSTA"
     }
    }

    verificaNomeFinanciador(){
      if(this.dadosDetalhamentoBinEstadual?.dadosGravame?.nomeFinanciado != null){
        var primeiroNome = this.dadosDetalhamentoBinEstadual?.dadosGravame?.nomeFinanciado.split(" ")[0];
        var segundoNome = this.dadosDetalhamentoBinEstadual?.dadosGravame?.nomeFinanciado.split(" ")[1];
        return primeiroNome + " " + segundoNome.substring(0,1) + '***';
      }else{
      return "NÃO CONSTA"
     }
    }

    verificaDataInclusao(){
      if(this.dadosDetalhamentoBinEstadual?.dadosGravame?.dataInclusao != null){
        return this.dadosDetalhamentoBinEstadual.dadosGravame.dataInclusao;
      }else{
      return "NÃO CONSTA"
     }
    }

    verificaRestricaoFinanceira(){
      if(this.dadosDetalhamentoBinEstadual?.dadosGravame?.tipoRestricao != null){
        return this.dadosDetalhamentoBinEstadual.dadosGravame.tipoRestricao;
      }else{
      return "NÃO CONSTA"
     }
    }

    verificaDocFinanciado(){
      if(this.dadosDetalhamentoBinEstadual?.dadosGravame?.documentoFinanciado != null){
        var documento = this.dadosDetalhamentoBinEstadual.dadosGravame.documentoFinanciado;
        documento = documento.replace(/\.|\-/g, '');
       if(documento.length == 11){
        return 'CPF'
       }else{
        return 'CNPJ'
       }
      }else{
      return "NÃO CONSTA"
     }
    }


    // DEBITOS

    verificaCetesb(){
      if(this.dadosDetalhamentoBinEstadual?.dadosMulta?.valorDebitoCetesb != null){
        return 'R$ ' + this.dadosDetalhamentoBinEstadual.dadosMulta.valorDebitoCetesb;
      }else{
        return 'R$ 0,00'
     }
    }

    verificaDer(){
      if(this.dadosDetalhamentoBinEstadual?.dadosMulta?.valorDebitoDer != null){
        return 'R$ ' + this.dadosDetalhamentoBinEstadual.dadosMulta.valorDebitoDer;
      }else{
        return 'R$ 0,00'
     }
    }

    verificaDersa(){
      if(this.dadosDetalhamentoBinEstadual?.dadosMulta?.valorDebitoDersa != null){
        return 'R$ ' + this.dadosDetalhamentoBinEstadual.dadosMulta.valorDebitoDersa;
      }else{
        return 'R$ 0,00'
     }
    }

    verificaDetran(){
      if(this.dadosDetalhamentoBinEstadual?.dadosMulta?.valorDebitoDetran != null){
        return 'R$ ' + this.dadosDetalhamentoBinEstadual.dadosMulta.valorDebitoDetran;
      }else{
        return 'R$ 0,00'
     }
    }

    verificaIpva(){
      if(this.dadosDetalhamentoBinEstadual?.dadosDebito?.Ipva != null){
        return 'R$ ' + this.dadosDetalhamentoBinEstadual.dadosDebito.Ipva;
      }else{
        return 'R$ 0,00'
     }
    }

    verificaMunicipais(){
      if(this.dadosDetalhamentoBinEstadual?.dadosMulta?.valorDebitoMunicipais != null){
        return 'R$ ' + this.dadosDetalhamentoBinEstadual.dadosMulta.valorDebitoMunicipais;
      }else{
        return 'R$ 0,00'
     }
    }

    verificaPrf(){
      if(this.dadosDetalhamentoBinEstadual?.dadosMulta?.valorDebitoPrf != null){
        return 'R$ ' + this.dadosDetalhamentoBinEstadual.dadosMulta.valorDebitoPrf;
      }else{
        return 'R$ 0,00'
     }
    }

    verificaRenainf(){
      if(this.dadosDetalhamentoBinEstadual?.dadosMulta?.valorDebitoRenainf != null){
        return 'R$ ' + this.dadosDetalhamentoBinEstadual.dadosMulta.valorDebitoRenainf;
      }else{
        return 'R$ 0,00'
     }
    }

    verificaLicenciamento(){
      if(this.dadosDetalhamentoBinEstadual?.dadosDebito?.Licenc != null){
        return 'R$ ' + this.dadosDetalhamentoBinEstadual.dadosDebito.Licenc;
      }else{
        return 'R$ 0,00'
     }
    }

    verificaMultas(){
      if(this.dadosDetalhamentoBinEstadual?.dadosMulta?.valorDebitoMultas != null){
        return 'R$ ' + this.dadosDetalhamentoBinEstadual.dadosMulta.valorDebitoMultas;
      }else{
        return 'R$ 0,00'
     }
    }

    verificaDpvat(){
      if(this.dadosDetalhamentoBinEstadual?.dadosDebito?.Dpvat != null){
        return 'R$ ' + this.dadosDetalhamentoBinEstadual.dadosDebito.Dpvat;
      }else{
        return 'R$ 0,00'
     }
    }





}
