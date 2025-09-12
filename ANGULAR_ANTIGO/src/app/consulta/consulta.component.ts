import { Component, OnInit, HostBinding } from '@angular/core';
import { dadosConsultaService } from '../service/dados-consulta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../service/modal.service';
import { LoginService } from '../service/login.service';
import { BehaviorSubject } from 'rxjs';
import { VariableGlobal } from '../service/variable.global.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Title, Meta } from '@angular/platform-browser';

declare var google: any; 

@Component({
  selector: 'consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
  removeAbas: boolean = false;
  teste: '';
  step: number = 0;
  tokenConsulta: String;
  statusCarregamento: any = 0;
  dadosConsulta: any = {};

  statusConsultaVeiculo = 0;
  qtdeCampos = 0;
  esconderDadosVeiculo = false;

  marcaVeiculo = "semmarca";

  login: any = { status: false };
  options: any[] = [
    { icon: 'search.svg', label: 'Detalhamento', url: null },
    /* { icon: 'list.svg', label: 'Resumo', url: null }, */
    /* { icon: 'checklist.svg', label: 'Checklist', url: null },*/
    { icon: 'timeline.svg', label: 'Timeline', url: null },
  ];

  dadosObservable: BehaviorSubject<any>;
  consultaExemplo = false;

  constructor(
    private loginService: LoginService, 
    private modal: ModalService, 
    private dadosConsultaService: dadosConsultaService,
    private title: Title,
    private meta: Meta,
    private route: ActivatedRoute, private router: Router, private variableGlobal: VariableGlobal) {
    this.dadosObservable = new BehaviorSubject(null);
  }



  ngOnInit() {

    this.title.setTitle('Login - CarCheck');
    this.meta.updateTag({
      name: 'description',
      content: 'Acesse sua conta para visualizar consultas veiculares, histórico de laudos e gerenciar seus dados.'
    });

    this.route.params.subscribe(params => {
      this.tokenConsulta = params['tokenConsulta'];
      this.carregarInformacoes();
    });

    this.loginService.getLogIn().subscribe(v => this.login = v);

    this.verificaExemplo(this.tokenConsulta);

  }

  getUrlPdf(){
    return this.variableGlobal.getUrl( "consultar/relatorioConsultaPdf/"+this.tokenConsulta);
  }

  ngChanges() {
    this.setStatusVeiculo();
  }

  setStatusVeiculo() {


    if (this.dadosConsulta.veiculo != null) {
      this.qtdeCampos = this.qtdeCamposObjeto(this.dadosConsulta.veiculo);
    }

    if (this.dadosConsulta.veiculo != null) {
      (this.statusConsultaVeiculo = this.qtdeCampos >= 1 ? 0 : 1);
    } else {
      this.statusConsultaVeiculo = 2;
    }


  }

  carregarInformacoes() {
    this.modal.openLoading({ title: 'Carregando Consulta', text: 'Aguarde, em alguns segundos sua consulta será carregada.' });
    this.dadosConsultaService
      .getConsultaVeiculo(this.tokenConsulta).toPromise()
      .then( data => {
          this.statusCarregamento = 1;
          this.dadosConsulta = data;
          this.modal.closeLoading();
          this.removeAbas = this.dadosConsulta.composta.nome.toLowerCase() != 'completa';

          this.marcaVeiculo = this.dadosConsulta.veiculo.marca != null ? this.dadosConsulta.veiculo.marca.toLowerCase().replace(/ /g, "").replace(/ /g, "") : "semmarca";

          this.dadosObservable.next(this.dadosConsulta);
          this.setStatusVeiculo();
        })
        .catch(error => {
          this.statusCarregamento = -1;
          this.modal.closeLoading();
        });
  }

  qtdeCamposObjeto(Obj) {
    const arrayTemp = new Array();
    for (const fieldsJSON in Obj) {
      arrayTemp.push(fieldsJSON);
    }
    return arrayTemp.length;
  }


  downloadPdf() {
    this.modal.openLoading({ title: 'Efetuando download', text: 'Aguarde, em alguns segundos o download do PDF será concluido.' });
    this.dadosConsultaService.downloadPdf(this.dadosConsulta.tokenConsulta).subscribe(data => {
      const file = new Blob([data], { type: 'application/pdf' });

      const fileURL = URL.createObjectURL(file);
      console.log(fileURL);
      window.open(fileURL, 'Consulta.pdf');

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file);
        return;
      }
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = 'Consulta.pdf';
      link.click();
      this.modal.closeLoading();
    }, error => {
      this.modal.closeLoading();
      this.modal.openModalMsg({ status: 2, title: 'Erro ao efetuar download', text: 'Ocorreu um erro ao efetuar o download do PDF, tente novamente mais tarde, caso o problema persista, entre em contato com o nosso suporte.', cancel: { show: false } });
    });
  }
  /*this.http.post("ws/consultaVeiculo/relatorioConsultaPdf", {idConsultaVeiculo},{responseType: 'arraybuffer'})
  .success(function(data, status, headers, config) {
   var file = new Blob([data], {type: 'application/pdf'});
         var fileURL = URL.createObjectURL(file);
         window.open(fileURL,"Consulta.pdf");

           if (window.navigator && window.navigator.msSaveOrOpenBlob) {
             window.navigator.msSaveOrOpenBlob(file);
             return;
           }

           var link = document.createElement('a');
           link.href = fileURL;
           link.download="Consulta.pdf";
           link.click();
       }
*/

  verificaExemplo(token) {
    if (token.match(/exemplo/)) {
      return this.consultaExemplo = true;
    } else {
      return this.consultaExemplo = false;
    }
  }
  verificaEntrada(){
    if(this.dadosConsulta.placaEntrada != null){
      return this.dadosConsulta.placaEntrada
    } else {
      return this.dadosConsulta.chassiEntrada
    }
  }

  verificaPlaca() {
    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.placa) {
      return this.dadosConsulta.veiculo.placa;
    } else if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.placa) {
      return this.dadosConsulta.binestadual.dadosveiculo.placa;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.placa) {
      return this.dadosConsulta.binfederal.dadosveiculo.placa;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].placa ) {
      return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].placa;
    }
    else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.placa) {
      return this.dadosConsulta.snva.dadosveiculo.placa;
    } else {
      return "Sem placa";
    }
  }

  verificaLogo() {

    if ((this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.marca) || (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null &&  this.dadosConsulta.snva.dadosveiculo.marca)) {
      if (this.dadosConsulta.veiculo.marca != null) {
        let marcaVeiculo = this.dadosConsulta.veiculo.marca != null ? this.dadosConsulta.veiculo.marca.toLowerCase().replace(/ /g, "").replace(/ /g, "") : "semmarca";
        if (this.dadosConsulta.veiculo.tipo != null) {
          if (this.dadosConsulta.veiculo.tipo == "Motocicleta" && marcaVeiculo != "semmarca") {
            marcaVeiculo = marcaVeiculo + '-moto';
          }
        }
        return marcaVeiculo;
      } else if (this.dadosConsulta.snva!=null && this.dadosConsulta.snva.dadosveiculo.marca != null) {
        let marcaVeiculo = this.dadosConsulta.snva.dadosveiculo.marca != null && this.dadosConsulta.snva.dadosveiculo.marca.indexOf("I/")==-1 ? this.dadosConsulta.snva.dadosveiculo.marca.toLowerCase().replace(/ /g, "").replace(/ /g, "") : "semmarca";
        if (this.dadosConsulta.snva.dadosveiculo.tipo != null) {
          if (this.dadosConsulta.snva.dadosveiculo.tipo == "Motocicleta" && marcaVeiculo != "semmarca") {
            marcaVeiculo = marcaVeiculo + '-moto';
          }
        }
        return marcaVeiculo;
      }

      else if(this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0){
        let marcaVeiculo = this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].marca != null && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].marca.indexOf("I/")==-1 ? this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].marca.toLowerCase().replace(/ /g, "").replace(/ /g, "") : "semmarca";
        if(this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].tipo !=null){
          if(this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].tipo == "Motocicleta" && marcaVeiculo != "semmarca"){
            marcaVeiculo = marcaVeiculo + '-moto';
          }
        }
        return marcaVeiculo;
      }

      // else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      /*&& this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].marca ) {
        return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].marca;
      }*/

    } else {
      return "semmarca";
    }
  }

  verificaMarca() {

    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.marca) {
      return this.dadosConsulta.veiculo.marca;
    } else if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.marca) {
      return this.dadosConsulta.binestadual.dadosveiculo.marca;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.marca) {
      return this.dadosConsulta.binfederal.dadosveiculo.marca;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].marca ) {
      return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].marca;
    }
    else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.marca) {
      return this.dadosConsulta.snva.dadosveiculo.marca;
    } else {
      return "----";
    }
  }

  verificaModelo() {
    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.modeloBin) {
      return this.dadosConsulta.veiculo.modeloBin;
    } else if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.modelo) {
      return this.dadosConsulta.binestadual.dadosveiculo.modelo;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.modelo) {
      return this.dadosConsulta.binfederal.dadosveiculo.modelo;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].modelo ) {
      return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].modelo;
    }
    else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.modelo) {
      return this.dadosConsulta.snva.dadosveiculo.modelo;
    } else {
      return "----";
    }
  }

  verificaAnoModelo() {
    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.anoModelo) {
      return this.dadosConsulta.veiculo.anoModelo;

    } else if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.anoModelo) {
      return this.dadosConsulta.binestadual.dadosveiculo.anoModelo;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.anoModelo) {
      return this.dadosConsulta.binfederal.dadosveiculo.anoModelo;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].anoModelo ) {
      return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].anoModelo;
    }
    else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.anoModelo) {
      return this.dadosConsulta.snva.dadosveiculo.anoModelo;
    } else {
      return "----";
    }
  }

  verificaAnoFabricacao() {
    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.anoFabricacao) {
      return this.dadosConsulta.veiculo.anoFabricacao;

    } else if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.anoFabricacao) {
      return this.dadosConsulta.binestadual.dadosveiculo.anoFabricacao;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.anoFabricacao) {
      return this.dadosConsulta.binfederal.dadosveiculo.anoFabricacao;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].anoFabricacao ) {
      return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].anoFabricacao;
    }
    else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.anoFabricacao) {
      return this.dadosConsulta.snva.dadosveiculo.anoFabricacao;
    } else {
      return "----";
    }
  }


  verificaCilindradas() {
    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.cilindrada) {
      return this.dadosConsulta.veiculo.cilindrada;
    } else if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.cilindrada) {
      return this.dadosConsulta.binestadual.dadosveiculo.cilindrada;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.cilindrada) {
      return this.dadosConsulta.binfederal.dadosveiculo.cilindrada;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].cilindrada ) {
      return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].cilindrada;
    }
    else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.cilindrada) {
      return this.dadosConsulta.snva.dadosveiculo.cilindrada;
    } else {
      return "----";
    }
  }

  verificaEstado() {
    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.uf) {
      return this.dadosConsulta.veiculo.uf;
    } else if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.uf) {
      return this.dadosConsulta.binestadual.dadosveiculo.uf;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.uf) {
      return this.dadosConsulta.binfederal.dadosveiculo.uf;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].uf ) {
      return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].uf;
    }
    else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.uf) {
      return this.dadosConsulta.snva.dadosveiculo.uf;
    } else {
      return "----";
    }
  }

  verificaMunicipio(){
    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.municipio) {
      return this.dadosConsulta.veiculo.municipio;
    } else if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.municipio) {
      return this.dadosConsulta.binestadual.dadosveiculo.municipio;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.municipio) {
      return this.dadosConsulta.binfederal.dadosveiculo.municipio;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].municipio ) {
      return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].municipio;
    }
    else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.municipio) {
      return this.dadosConsulta.snva.dadosveiculo.municipio;
    } else {
      return "----";
    }
  }

  verificaIdConsulta(){
    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.id) {
      return this.dadosConsulta.id;
    } else if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.id) {
      return this.dadosConsulta.binestadual.dadosveiculo.id;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.id) {
      return this.dadosConsulta.binfederal.dadosveiculo.id;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].id ) {
      return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].id;
    }
    else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.id) {
      return this.dadosConsulta.snva.dadosveiculo.id;
    } else {
      return "----";
    }
  }


  verificaCor() {
    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.cor) {
      return this.dadosConsulta.veiculo.cor;
    } else if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.cor) {
      return this.dadosConsulta.binestadual.dadosveiculo.cor;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.cor) {
      return this.dadosConsulta.binfederal.dadosveiculo.cor;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].cor ) {
      return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].cor;
    }
    else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.cor) {
      return this.dadosConsulta.snva.dadosveiculo.cor;
    } else {
      return "----";
    }


  }

  verificaChassi() {
    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.chassi) {
      return this.dadosConsulta.veiculo.chassi;
    } else if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.chassi) {
      return this.dadosConsulta.binestadual.dadosveiculo.chassi;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.chassi) {
      return this.dadosConsulta.binfederal.dadosveiculo.chassi;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].chassi ) {
      return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].chassi;
    }
    else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.chassi) {
      return this.dadosConsulta.snva.dadosveiculo.chassi;
    } else {
      return "----";
    }
  }

  verificaCombustivel() {
    if (this.dadosConsulta.veiculo != null && this.dadosConsulta.veiculo.combustivel) {
      return this.dadosConsulta.veiculo.combustivel;
    } else if (this.dadosConsulta.binestadual != null && this.dadosConsulta.binestadual.dadosveiculo != null && this.dadosConsulta.binestadual.dadosveiculo.combustivel) {
      return this.dadosConsulta.binestadual.dadosveiculo.combustivel;
    }
    else if (this.dadosConsulta.binfederal != null && this.dadosConsulta.binfederal.dadosveiculo != null && this.dadosConsulta.binfederal.dadosveiculo.combustivel) {
      return this.dadosConsulta.binfederal.dadosveiculo.combustivel;
    }
    else if (this.dadosConsulta.binrf != null && this.dadosConsulta.binrf.dadosveiculo != null && this.dadosConsulta.binrf.dadosveiculo.length > 0
      && this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].combustivel ) {
      return this.dadosConsulta.binrf.dadosveiculo[this.dadosConsulta.binrf.dadosveiculo.length - 1].combustivel;
    }
    else if (this.dadosConsulta.snva != null && this.dadosConsulta.snva.dadosveiculo != null && this.dadosConsulta.snva.dadosveiculo.combustivel) {
      return this.dadosConsulta.snva.dadosveiculo.combustivel;
    } else {
      return "----";
    }
  }

  verificaIndicadorVenda(){
    if(this.dadosConsulta.binestadual?.restricoes.length > 0){
      for (const r of this.dadosConsulta.binestadual.restricoes) {
        if(r.descricao.includes("CONSTA COMUNICACAO DE VENDA")){
          return true
        }else{
         return "NÃO CONSTA"
        }
      }
    } else{
      return "NAO CONSTA COMUNICADO DE VENDA"
    }
  }

  verificaDebitos(){
    if(this.dadosConsulta.binestadual.dadosDebito !=null || this.dadosConsulta.binestadual.dadosMulta !=null){
      return true;
    }
  }

  verificaMultas(){
    if(this.dadosConsulta.binestadual.dadosMulta !=null){
      return true;
    }
  }

  verificaRF(){
    if(this.dadosConsulta.binestadual.restricoes.length >0){
      for (const r of this.dadosConsulta.binestadual.restricoes) {
        if(r.descricao.includes("ROUBO E FURTO ATIVO")){
          return true
        }
      }
    }
  }

  verificaGravame(){
    if(this.dadosConsulta.binestadual.dadosGravame != null &&
      Object.values(this.dadosConsulta.binestadual.dadosGravame).length != 0 &&
      this.dadosConsulta.binestadual.dadosGravame?.tipoRestricao.toUpperCase() != 'NADA CONSTA'){
        return true
    }
  }

  verificaRestricao(){
    if(
      this.dadosConsulta.binestadual.restricoes.length > 0  ||
       this.dadosConsulta.binestadual.dadosDebito != null ||
        this.dadosConsulta.binestadual.dadosMulta != null ||
         this.verificaGravame() ||
          this.dadosConsulta.leilao?.dadosLeilao.length > 0 ||
            this.dadosConsulta.sinistro?.codigoControle != 'SEMREGISTRO'){
      return true;
    }
  }

  scrollTo(element: any): void {
    (document.getElementById(element) as HTMLElement).scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
  }

}
