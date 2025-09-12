import { Component, OnInit, Input } from '@angular/core';
import { dadosConsultaService } from '../../service/dados-consulta.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'consulta-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class ChecklistComponent implements OnInit {

  detail: string = '';

  step: number = 0;
  tokenConsulta: String;
  dadosConsulta: any = {};

  @Input() dadosDebitos: any = [];
  @Input() dadosMulta: any = {};

  @Input() restricoes: any = [];

  @Input() arrendamentoMercantil: any = {};
  @Input() tributaria: any = {};
  @Input() judicial: any = {};
  @Input() penhor: any = {};
  @Input() administrativa: any = {};

  @Input() leilao: any = [];
  @Input() decodificador: any = {};
  @Input() remarcacaoChassi: any = {};
  @Input() circulacao: any = {};

  @Input() dpvat: any = {};
  @Input() alienacao: any = {};
  @Input() circulaEstado: any = {};
  @Input() roubo: any = {};
  @Input() historicoRoubo: any = {};
  @Input() reserva: any = {};



  @Input() dados: any = [];
  @Input() dadosObservable;

  constructor(private dadosConsultaService: dadosConsultaService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    
    this.route.params.subscribe(params => {
      this.tokenConsulta = params['tokenConsulta'];
      this.carregarInformacoes();
    });

    this.dadosObservable.asObservable().subscribe(() => {

      this.carregarInformacoes();
    });

  }

  carregarInformacoes() {
   
    this.dadosConsultaService
      .getConsultaVeiculo(this.tokenConsulta)
      .subscribe((data: any) => {
        this.dadosConsulta = data;
        this.dados.arrendamentoMercantil = this.getArrendamentoMercantil();
        this.dados.restricaoTributaria = this.getRestricaoTributaria();
        this.dados.restricaojudicial = this.getRestricaoJudicial();
        this.dados.restricaoPenhor = this.getRestricaoPenhor();
        this.dados.restricaoAdministrativa = this.getRestricaoAdministrativa();
        this.dados.circulacao = this.getCirculacao();
        this.dados.alienacao = this.getAlienacao();
        this.dados.roubo = this.getRouboFurto();
        this.dados.historicoRoubo = this.getHistoricoRoubo();
        this.dados.reserva = this.getReservaDominio();
        this.dados.comunicacaoVenda = this.getComunicacaoVenda();
        this.dados.reservaDominio = 'N';
      },
        error => {
          console.log("erro", error)
        },
        () => {
          console.log("Dados carregados com sucesso!");

        });
  }

  toggleDetail(detail) {

    if (this.detail == '') {
      this.detail = detail;
      return;
    }

    if (this.detail == detail) {
      this.detail = '';
      return;
    }

    this.detail = '';

    setTimeout(() => {
      this.detail = detail;
    }, 300);

  }

  getAlienacao() {

    if (this.dadosConsulta.denatran != null && this.dadosConsulta.denatran.restricoesDenatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("ALIENAÇÃO") != -1) {
          let alienacao = {
            descricao: this.dadosConsulta.denatran.restricoesDenatran[i].descricao
          };
          this.alienacao.descricao = alienacao.descricao;
          return "S";
        } else {
          return "N";
        }
      }

    }
  }




  getArrendamentoMercantil() {
    if (this.dadosConsulta.denatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("ARRENDAMENTO") > -1) {
          let arrendamento = {
            descricao: this.dadosConsulta.denatran.restricoesDenatran[i].descricao
          };
          this.arrendamentoMercantil.descricao = arrendamento.descricao;
          return "S";
        } else {
          return "N";
        }
      }

    }
  }




  getRouboFurto() {
    if (this.dadosConsulta.binrf != null) {
      if (this.dadosConsulta.binrf.restricoes != null) {
        for (let i = 0; i < this.dadosConsulta.binrf.restricoes.lenght; i++) {
          if (this.dadosConsulta.binrf.restricoes[i].descricao.toUpperCase.indexOf("ROUBO") > -1) {
            return "S";
          }
        }
      }
      if (this.dadosConsulta.binrf.rf != null) {
        if (!(this.dadosConsulta.binrf.rf.length % 3 == 0)) {
          return "S";
        }
        return "N";
      }

    }
  }


  getHistoricoRoubo() {

    if (this.dadosConsulta.binrf != null) {
      if (this.dadosConsulta.binrf.rf != null) {
        if (!(this.dadosConsulta.binrf.rf.length > 0)) {
          return "S";
        }
        return "N";
      }
    }

  }

  // getRouboFurto() {
  //   if (this.dadosConsulta.binrf != null) {
  //     for (let i = 0; i < this.dadosConsulta.binrf.rf.length; i++) {
  //       if (this.dadosConsulta.binrf.rf.length>0) {
  //         let boletim = {
  //           descricao: this.dadosConsulta.binrf.rf[i].boletim
  //         };
  //         this.roubo.descricao = boletim.descricao;
  //         return "S";
  //       } else {
  //         return "N";
  //       }
  //     }

  //   }
  // }

  getRestricaoTributaria() {
    if (this.dadosConsulta.denatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("TRIBUTARIA") != -1) {
          let tributaria = {
            descricao: this.dadosConsulta.denatran.restricoesDenatran[i].descricao
          };
          this.tributaria.descricao = tributaria.descricao;
          return "S";
        } else {
          return "N";
        }
      }

    }
  }

  getRestricaoJudicial() {
    if (this.dadosConsulta.denatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("JUDICIAL") != -1) {
          let judicial = {
            descricao: this.dadosConsulta.denatran.restricoesDenatran[i].descricao
          };
          this.judicial.descricao = judicial.descricao;
          return "S";
        } else {
          return "N";
        }
      }

    }
  }

  getRestricaoPenhor() {
    if (this.dadosConsulta.denatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("PENHOR") != -1) {
          let penhor = {
            descricao: this.dadosConsulta.denatran.restricoesDenatran[i].descricao
          };
          this.penhor.descricao = penhor.descricao;
          return "S";
        } else {
          return "N";
        }
      }

    }
  }

  getComunicacaoVenda() {
    if (this.dadosConsulta.denatran != null) {
      if (this.dadosConsulta.denatran.comunicacaoVenda != null) {
        return "S";
      }
      return "N";
    }
  }

  getRestricaoAdministrativa() {
    if (this.dadosConsulta.denatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("ADMINISTRATIVA") != -1) {
          let arrendamento = {
            descricao: this.dadosConsulta.denatran.restricoesDenatran[i].descricao
          };
          this.administrativa.push(arrendamento);
          return "S";
        } else {
          return "N";
        }
      }
    }
  }

  getCirculacao() {
    if (this.dadosConsulta.denatran != null && this.dadosConsulta.denatran.veiculoDenatran.situacao != null && this.dadosConsulta.denatran.veiculoDenatran.situacao == 'CIRCULACAO') {

      let circulacao = {
        marca: this.dadosConsulta.denatran.veiculoDenatran.marca,
        modelo: this.dadosConsulta.denatran.veiculoDenatran.modelo,
        combustivel: this.dadosConsulta.denatran.veiculoDenatran.combustivel,
        motor: this.dadosConsulta.denatran.veiculoDenatran.motor
      };
      this.circulacao.modelo = circulacao.modelo;
      this.circulacao.combustivel = circulacao.combustivel;
      this.circulacao.motor = circulacao.motor;
      return "S";
    } else {
      return "N";
    }

  }

  getReservaDominio() {
    if (this.dadosConsulta.denatran != null) {
      for (let i = 0; i < this.dadosConsulta.denatran.restricoesDenatran.length; i++) {
        if (this.dadosConsulta.denatran.restricoesDenatran[i].descricao.indexOf("RESERVA") != -1) {
          let reserva = {
            descricao: this.dadosConsulta.denatran.restricoesDenatran[i].descricao
          };
          this.reserva.descricao = reserva.descricao;
          return "S";
        } else {
          return "N";
        }
      }

    }
  }

}



