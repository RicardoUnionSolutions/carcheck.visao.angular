import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilMasks } from '../utils/util-masks';
import { dadosConsultaService } from '../service/dados-consulta.service';
import { LoginService } from '../service/login.service';
import { WebSocketService } from '../service/webSocket.service';
import { Title, Meta } from '@angular/platform-browser';


@Component({
  selector: 'historico-consulta',
  templateUrl: './historico-consulta.component.html',
  styleUrls: ['./historico-consulta.component.scss']
})
export class HistoricoConsultaComponent implements OnInit, OnDestroy {

  @HostListener('window:beforeunload')
  fechaWebsocket() {
    try {

      if (this.webSocketAberto)
        this.webSocketService.closeWebSocket();

    } catch (error) {
      console.log(error.stack);
    }
  }

  dadosConsulta: any;
  status: any;
  erro: any;
  usuario: any;
  tokensPendente = {
    tokens: []
  };

  escondeBotaoFiltro: any = false;
  novoUsuario: any = false;
  novoUsuarioComCredito: any = false;


  consultas: any = [];

  form: FormGroup;
  placaPesquisada: any = "";
  maskPlaca: any;


  array = [];
  sum = 100;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  pagina = 0;
  loadingScroll = false;
  possuiCompraAprovada = false;
  abrirWebsocket: boolean = false;
  fecharWebSocket: boolean = false;
  webSocketAberto: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private loginService: LoginService, 
    private dadosConsultaService: dadosConsultaService, 
    private webSocketService: WebSocketService,
    private title: Title,
    private meta: Meta

  ) {
    this.loginService.getLogIn().subscribe(v => this.usuario = v);
  }


  ngOnInit() {
    this.title.setTitle('Histórico de Consultas - CarCheck');
    this.meta.updateTag({
      name: 'description',
      content: 'Visualize todas as consultas realizadas anteriormente no sistema CarCheck com atualizações em tempo real.'
    });
    
    this.form = this.fb.group({
      placa: ['']
    });

    this.form.controls.placa.valueChanges.subscribe((v) => {
      if (this.placaPesquisada.toUpperCase() != v.toUpperCase()) {
        this.placaPesquisada = v.toUpperCase();
      }
    });

    this.maskPlaca = { mask: UtilMasks.placa, guide: false };

    this.carregarDadosHistoricoConsulta(this.pagina);
    this.verificaCompraAprovada();
    // this.analyticsService.homePageSistema();

  }

  ngOnDestroy(): void {
    if (this.webSocketAberto)
      this.webSocketService.closeWebSocket();
  }

  pesquisar() {
    this.pagina = 0;
    this.consultas = [];
    this.carregarDadosHistoricoConsulta(this.pagina);
  }

  carregarDadosHistoricoConsulta(valorPaginacao = 0) {
    this.loadingScroll = true;
    this.dadosConsultaService
      .getHistoricoConsulta({ placaPesquisada: this.placaPesquisada, pagina: valorPaginacao })
      .subscribe((data: any) => {
        this.dadosConsulta = data;

        this.MontaConsultas();

        if (this.tokensPendente.tokens.length > 0) {
          this.abrirWebsocket = true
        }

        //Se alguma consulta tiver como pendente, vai abrir o websocket que vai atualizar a página em tempo real
        if (this.abrirWebsocket && this.webSocketAberto == false) {
          this.webSocketAberto = true

          console.log("WEBSOCKET ABERTO");
          this.webSocketService.openWebSocket();

          this.webSocketService.sendMessage(this.tokensPendente);

          this.webSocketService.getMessages().subscribe(async retorno => {

            if (retorno.msg == "pronto") {
              this.tokensPendente.tokens = [];
              this.consultas = [];
              this.carregarDadosHistoricoConsulta(0);

            }

            //Verifica se pode fechar o webSocket
            if (this.tokensPendente.tokens.length == 0 && this.webSocketAberto) {

              this.webSocketService.closeWebSocket();

            } else {

              this.webSocketService.sendMessage(this.tokensPendente);

            }

          })

        }


        this.loadingScroll = false;
      },
        error => {
          console.log("erro", error)
        });

  }

  MontaConsultas() {

    this.tokensPendente.tokens = [];

    this.dadosConsulta.forEach(composta => {

      this.erro = 0;
      let qtdErro = 0;
      let qtdPendente = 0;

      if (composta.tipoProduto != 'LAUDO') {
        qtdErro = composta.consulta.filter(consultaInterna => consultaInterna.codigoControle == "ERRO_FORNECEDOR").length;
        qtdPendente = composta.consulta.filter(consultaInterna => consultaInterna.codigoControle == "PENDENTE").length;
      }

      composta.codigoControleConsultaPrimaria == 'ERRO_FORNECEDOR' ? qtdErro++ : null;
      composta.codigoControleConsultaPrimaria == "PENDENTE" ? qtdPendente++ : null;

      if (composta.codigoControleConsultaPrimaria == "PENDENTE") {
        let tokenObject = {
          token: null
        };
        tokenObject.token = composta.tokenConsulta
        this.tokensPendente.tokens.push(tokenObject);
      }


      let marca = composta.marca != null ? composta.marca.toLowerCase().replace(/ /g, "").replace(/ /g, "") : "semmarca";

      if (composta.codigoControleConsultaPrimaria == 'SEMREGISTRO') {
        marca = "semmarca";
      }

      if (composta.tipo != null) {
        if (composta.tipo == "Motocicleta" && marca != "semmarca") {
          marca = marca + '-moto';
        }
      }

      let modelo = composta.modeloBin != null ? composta.modeloBin : composta.modeloDecodificador;

      let consultaFinal = {
        id: composta.id,
        status: qtdErro == 0 && qtdPendente == 0 ? 0 : qtdPendente > 0 ? 1 : 2,
        data: composta.dataConsulta,
        qtdErros: qtdErro,
        tipo: composta.tipoProduto != 'LAUDO' ? "Consulta " + composta.nomeConsulta : composta.nomeConsulta,
        tokenConsulta: composta.tokenConsulta,
        placa: composta.placaEntrada,
        chassi: composta.chassiEntrada,
        modelo: modelo,
        img: './assets/images/marcas/' + marca + '.png',
        tipoProduto: composta.tipoProduto,
        laudo: composta.laudo || null,
        linkPesquisa: composta.linkPesquisa || null,
        consultaCompany: composta.consultaCompany || false,
        exibirPdf: composta.exibirPdf || false,
        linkPdf: composta.linkPdf || null
      };

      this.consultas.push(consultaFinal);

      if (consultaFinal.status == 1) {
        this.dadosConsultaService
          .getRecarregarConsultaListaPendente(consultaFinal.id)
          .then((data: any) => {
            console.log("ok ", data);
          }).catch(error => {
            console.log('erro', error)
          });
      }
    });


    if (this.consultas.length < 4 && this.placaPesquisada == "") {
      this.escondeBotaoFiltro = true;
    } else {
      this.escondeBotaoFiltro = false;
    }

    if (this.consultas.length == 0 && this.possuiCompraAprovada == false) {
      this.novoUsuario = true;
    } else {
      this.novoUsuario = false;
    }

    if (this.consultas.length == 0 && this.possuiCompraAprovada == true) {
      this.novoUsuarioComCredito = true;
    } else {
      this.novoUsuarioComCredito = false;
    }


  }



  onScrollDown(ev) {
    if (!this.loadingScroll) {

      this.pagina++;
      this.direction = 'down'

      this.carregarDadosHistoricoConsulta(this.pagina);
    }

  }

  onUp(ev) {
    this.direction = 'up';
  }

  verificaCompraAprovada() {
    this.dadosConsultaService.getPossuiCompraAprovada()
      .subscribe((data: any) => {
        if (data == true) {
          this.possuiCompraAprovada = true;
        }

      },
        error => {
          console.log("erro", error)
        }
      );

  }

  firstName(): string {
    if (!this.usuario.nome) return '';
    return this.usuario.nome.split(' ')[0];
  }


}
