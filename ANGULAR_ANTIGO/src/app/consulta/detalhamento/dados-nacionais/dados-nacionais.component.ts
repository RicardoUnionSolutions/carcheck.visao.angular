import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../../../service/modal.service';
import { dadosConsultaService } from '../../../service/dados-consulta.service';
import { ConsultaComponent } from '../../consulta.component';
import { ResumoComponent } from '../../resumo/resumo.component';
import { BehaviorSubject } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'dados-nacionais',
  templateUrl: './dados-nacionais.component.html',
  styleUrls: ['./dados-nacionais.component.scss']
})
export class DadosNacionaisComponent implements OnInit {

  @Input() dadosDetalhamentoNacional: any;
  statusConsulta = 0;
  statusReload = 0;

  @Input() dadosObservable;
  consulta:any;
  vTipoMontagem = "";

  constructor(private modalService: ModalService, private dadosConsultaService: dadosConsultaService) {
  }

  ngOnInit() {
    this.setStatusConsulta();
  }

  ngChanges() {
    this.setStatusConsulta();
  }

  setStatusConsulta() {

    if (this.dadosDetalhamentoNacional.snva != null) {

      this.statusConsulta = this.dadosDetalhamentoNacional.snva.codigoControle == "ERRO_FORNECEDOR" ? 5 : 0;
      switch (this.dadosDetalhamentoNacional.snva.codigoControle) {
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

  }

  reload() {
    this.statusReload = 1;


    //console.log(this.dadosDetalhamentoNacional.snva);
    //console.log('idConsultaInterna', this.dadosDetalhamentoNacional.snva.consultaInterna.idConsultaInterna);

    this.dadosConsultaService
      .getRecarregarConsultaInterna(this.dadosDetalhamentoNacional.snva.consultaInterna.idConsultaInterna)
      .subscribe((data: any) => {
        this.dadosDetalhamentoNacional.snva = data;
        switch (this.dadosDetalhamentoNacional.snva.codigoControle) {
          case "ERRO_FORNECEDOR":
            this.statusReload = 2;
            this.setStatusConsulta();

            break;
          case "OK":
          case "SEMREGISTRO":
            this.statusReload = 0;
            this.setStatusConsulta();

            data.mudouStatus = true;
            this.consulta = data;
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


  trataValor() {
    return "teste";
  }

  verificaNaoNulidade() {
    if (this.dadosDetalhamentoNacional.binfederal == null && this.dadosDetalhamentoNacional.binestadual == null && this.dadosDetalhamentoNacional.binrf == null && this.dadosDetalhamentoNacional.snva == null) {
      return false;
    } else {
      if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.codigoControle == "SEMREGISTRO") {
        return false;
      } else {
        return true;
      }
    }
  }

  verificaPlaca() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.placa) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.placa;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.placa) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.placa;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.placa ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.placa;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.placa) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.placa;
    } else {
      return "----";
    }
  }


  verificaChassi() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.chassi) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.chassi;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.chassi) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.chassi;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.chassi ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.chassi;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.chassi) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.chassi;
    } else {
      return "----";
    }
  }


  verificaMotor() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.nrMotor) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.nrMotor;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.nrMotor) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.nrMotor;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.nrMotor ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.nrMotor;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.nrMotor) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.nrMotor;
    } else {
      return "----";
    }
  }

  verificaMarcaModelo() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.marca) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.marca + "/" + this.dadosDetalhamentoNacional.binestadual.dadosveiculo.modelo;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.marca) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.marca + "/" + this.dadosDetalhamentoNacional.binfederal.dadosveiculo.modelo;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.marca ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.marca + "/"+ this.dadosDetalhamentoNacional.binrf.dadosveiculo.modelo;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.marca) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.marca + "/" + this.dadosDetalhamentoNacional.snva.dadosveiculo.modelo;
    } else {
      return "----";
    }
  }

  //dadosDetalhamentoNacional.binestadual.dadosveiculo.anoFabricacao}}/{{dadosDetalhamentoNacional.binestadual.dadosveiculo.anoModelo
  verificaAno() {

    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.anoFabricacao != null) {

      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.anoFabricacao + "/" + this.dadosDetalhamentoNacional.binestadual.dadosveiculo.anoModelo;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.anoFabricacao != null) {

      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.anoFabricacao + "/" + this.dadosDetalhamentoNacional.binfederal.dadosveiculo.anoModelo;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.anoFabricacao !=null ) {

      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.anoFabricacao + "/"+ this.dadosDetalhamentoNacional.binrf.dadosveiculo.anoModelo;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.anoFabricacao != null) {

      return this.dadosDetalhamentoNacional.snva.dadosveiculo.anoFabricacao + "/" + this.dadosDetalhamentoNacional.snva.dadosveiculo.anoModelo;
    } else {
      return "----";
    }
  }

  //{{dadosDetalhamentoNacional.binestadual.dadosveiculo.municipio}}
  verificaMunicipio() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.municipio) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.municipio;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.municipio) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.municipio;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.municipio ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.municipio;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.municipio) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.municipio;
    } else {
      return "----";
    }
  }

  //dadosDetalhamentoNacional.binestadual.dadosveiculo.combustivel
  verificaCombustivel() {

    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.combustivel) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.combustivel;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.combustivel) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.combustivel;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.combustivel ) {

      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.combustivel;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.combustivel) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.combustivel;
    } else {
      return "----";
    }
  }

  //dadosDetalhamentoNacional.binestadual.dadosveiculo.cor
  verificaCor() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.cor) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.cor;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.cor) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.cor;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.cor ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.cor;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.cor) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.cor;
    } else {
      return "----";
    }
  }


  verificaEspecie() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.especie) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.especie;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.especie) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.especie;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.especie ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.especie;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.especie) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.especie;
    } else {
      return "----";
    }
  }


  verificaProcedencia() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.procedenciaVeiculo) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.procedenciaVeiculo;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.procedenciaVeiculo) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.procedenciaVeiculo;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.procedenciaVeiculo ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.procedenciaVeiculo;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.procedenciaVeiculo) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.procedenciaVeiculo;
    } else {
      return "----";
    }
  }


  verificaCapacidadePassageiros() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.capacidadePassageiros) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.capacidadePassageiros;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.capacidadePassageiros) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.capacidadePassageiros;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.capacidadePassageiros ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.capacidadePassageiros;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.capacidadePassageiros) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.capacidadePassageiros;
    } else {
      return "----";
    }
  }

  verificaModelo() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.modelo) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.modelo;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.modelo) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.modelo;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.modelo ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.modelo;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.modelo) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.modelo;
    } else {
      return "----";
    }
  }


  verificaCarroceria() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.carroceria) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.carroceria;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.carroceria) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.carroceria;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.carroceria ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.carroceria;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.carroceria) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.carroceria;
    } else {
      return "----";
    }
  }

  verificaTipoCarroceria() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.tipoDaCarroceria) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.tipoDaCarroceria;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.tipoDaCarroceria) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.tipoDaCarroceria;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.tipoDaCarroceria ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.tipoDaCarroceria;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.tipoDaCarroceria) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.tipoDaCarroceria;
    } else {
      return "----";
    }
  }


  verificaQuantidadeEixos() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.nrEixos) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.nrEixos;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.nrEixos) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.nrEixos;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.nrEixos ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.nrEixos;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.nrEixos) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.nrEixos;
    } else {
      return "----";
    }
  }


  verificaTipoVeiculo() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.tipo) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.tipo;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.tipo) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.tipo;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.tipo ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.tipo;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.tipo) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.tipo;
    } else {
      return "----";
    }
  }

  verificaTipoMontagem() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.montagem) {
      this.vTipoMontagem =  this.dadosDetalhamentoNacional.binestadual.dadosveiculo.montagem;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.montagem) {
      this.vTipoMontagem = this.dadosDetalhamentoNacional.binfederal.dadosveiculo.montagem;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.montagem ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.montagem;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.montagem) {
      this.vTipoMontagem = this.dadosDetalhamentoNacional.snva.dadosveiculo.montagem;
    } else {
      this.vTipoMontagem = "----";
    }

    if(this.vTipoMontagem=="2"){
      return "INCOMPLETA"
    }else if(this.vTipoMontagem=="1"){
      return "COMPLETA"
    }else{
      return "----";
    }
  }

  verificaPotencia() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.potencia) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.potencia;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.potencia) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.potencia;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.potencia ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.potencia;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.potencia) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.potencia;
    } else {
      return "----";
    }
  }


  verificaCilindradas() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.cilindrada) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.cilindrada;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.cilindrada) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.cilindrada;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.cilindrada ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.cilindrada;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.cilindrada) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.cilindrada;
    } else {
      return "----";
    }
  }


  verificaEixoTrasDiferencial() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.eixoTrasDiferencial) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.eixoTrasDiferencial;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.eixoTrasDiferencial) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.eixoTrasDiferencial;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.eixoTrasDiferencial ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.eixoTrasDiferencial;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.eixoTrasDiferencial) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.eixoTrasDiferencial;
    } else {
      return "----";
    }
  }


  verificaTerceiroEixo() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo != null && this.dadosDetalhamentoNacional.binestadual.dadosveiculo.terceiroEixo) {
      return this.dadosDetalhamentoNacional.binestadual.dadosveiculo.terceiroEixo;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo != null && this.dadosDetalhamentoNacional.binfederal.dadosveiculo.terceiroEixo) {
      return this.dadosDetalhamentoNacional.binfederal.dadosveiculo.terceiroEixo;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosveiculo.terceiroEixo ) {
      return this.dadosDetalhamentoNacional.binrf.dadosveiculo.terceiroEixo;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosveiculo != null && this.dadosDetalhamentoNacional.snva.dadosveiculo.terceiroEixo) {
      return this.dadosDetalhamentoNacional.snva.dadosveiculo.terceiroEixo;
    } else {
      return "----";
    }
  }


  //DADOS FATURAMENTO

  verificaCnpjFaturamento() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.cnpj) {
      return this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.cnpj;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.cnpj) {
      return this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.cnpj;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosveiculo != null
      && this.dadosDetalhamentoNacional.binrf.dadosFaturamento.cnpj ) {
      return this.dadosDetalhamentoNacional.binrf.dadosFaturamento.cnpj;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento.cnpj) {
      return this.dadosDetalhamentoNacional.snva.dadosFaturamento.cnpj;
    } else {
      return "----";
    }
  }

  verificaCidadeFaturamento() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.cidade) {
      return this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.cidade;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.cidade) {
      return this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.cidade;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosFaturamento != null && this.dadosDetalhamentoNacional.binrf.dadosFaturamento.cidade) {
      return this.dadosDetalhamentoNacional.binrf.dadosFaturamento.cidade;
    }
     else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento.cidade) {
      return this.dadosDetalhamentoNacional.snva.dadosFaturamento.cidade;
    }
    else {
      return "----";
    }
  }

  verificaUfFaturamento() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.uf) {
      return this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.uf;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.uf) {
      return this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.uf;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosFaturamento != null && this.dadosDetalhamentoNacional.binrf.dadosFaturamento.uf) {
      return this.dadosDetalhamentoNacional.binrf.dadosFaturamento.uf;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento.uf) {
      return this.dadosDetalhamentoNacional.snva.dadosFaturamento.uf;
    }
    else {
      return "----";
    }
  }

  verificaCepFaturamento() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.cep) {
      return this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.cep;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.cep) {
      return this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.cep;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosFaturamento != null && this.dadosDetalhamentoNacional.binrf.dadosFaturamento.cep) {
      return this.dadosDetalhamentoNacional.binrf.dadosFaturamento.cep;
    } else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento.cep) {
      return this.dadosDetalhamentoNacional.snva.dadosFaturamento.cep;
    }
    else {
      return "----";
    }
  }



  verificaEnderecoFaturamento() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.endereco) {
      return this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.endereco;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.endereco) {
      return this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.endereco;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosFaturamento != null && this.dadosDetalhamentoNacional.binrf.dadosFaturamento.endereco) {
      return this.dadosDetalhamentoNacional.binrf.dadosFaturamento.endereco;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento.endereco) {
      return this.dadosDetalhamentoNacional.snva.dadosFaturamento.endereco;
    }
    else {
      return "----";
    }
  }

  verificaRazaoSocialFaturamento() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.razaoSocial) {
      return this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.razaoSocial;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.razaoSocial) {
      return this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.razaoSocial;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosFaturamento != null && this.dadosDetalhamentoNacional.binrf.dadosFaturamento.razaoSocial) {
      return this.dadosDetalhamentoNacional.binrf.dadosFaturamento.razaoSocial;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento.razaoSocial) {
      return this.dadosDetalhamentoNacional.snva.dadosFaturamento.razaoSocial;
    }
    else {
      return "----";
    }
  }


  verificaTelefoneFaturamento() {
    if (this.dadosDetalhamentoNacional.binestadual != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento != null && this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.telefone) {
      return this.dadosDetalhamentoNacional.binestadual.dadosFaturamento.telefone;
    }
    else if (this.dadosDetalhamentoNacional.binfederal != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento != null && this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.telefone) {
      return this.dadosDetalhamentoNacional.binfederal.dadosFaturamento.telefone;
    }
    else if (this.dadosDetalhamentoNacional.binrf != null && this.dadosDetalhamentoNacional.binrf.dadosFaturamento != null && this.dadosDetalhamentoNacional.binrf.dadosFaturamento.telefone) {
      return this.dadosDetalhamentoNacional.binrf.dadosFaturamento.telefone;
    }
    else if (this.dadosDetalhamentoNacional.snva != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento != null && this.dadosDetalhamentoNacional.snva.dadosFaturamento.telefone) {
      return this.dadosDetalhamentoNacional.snva.dadosFaturamento.telefone;
    }
    else {
      return "----";
    }
  }






}
