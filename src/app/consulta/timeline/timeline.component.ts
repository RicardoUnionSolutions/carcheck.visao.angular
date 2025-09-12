import { Component, OnInit, Input } from '@angular/core';
import { dadosConsultaService } from '../../service/dados-consulta.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'consulta-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
    standalone: true
})
export class TimelineComponent implements OnInit {
  @Input() dados: any = [];
  @Input() ocorrencias: any = [];
  @Input() saida: any = [];
  @Input() listaExterna: any = [];
  @Input() listaAnos: any = [];

  objetoRetorno: any = {
    proprietarios: ""
  };

  @Input() lAnosBlackList: any = [];

  @Input() objInterno: any = {
    ano: "",
    lObjeto: []
  };

  tokenConsulta: String;

  constructor(private dadosConsultaService: dadosConsultaService, private route: ActivatedRoute) {

    //this.carregarTimeLine();

  }


  carregarTimeLine() {

    //("20111031", "YYYYMMDD").fromNow();
    this.dadosConsultaService
      .getConsultaTimeLine(this.tokenConsulta)
      .subscribe(
        data => {
          this.dados = (data);
          if (data != null) this.criaListaTimeLine();
        },
        error => {
          console.log("erro", error)
        }
      );
  }


  pegarTodosAnos() {
  }



  criaListaTimeLine() {

    //console.log("lista de dados -> ",this.dados.proprietarios)      
    if (this.dados.binestadual && this.dados.binEstadual.codigoControle == "OK") {
    
      this.ocorrencias.push(this.dados.binestadual)
    }
    if (this.dados.gravame && this.dados.gravame.codigoControle == "OK") {
     
      this.ocorrencias.push(this.dados.gravame)
    }
    
    if (this.dados.leilao && this.dados.leilao.codigoControle == "OK") {
     
      this.ocorrencias.push(this.dados.leilao)
    }
    
    if (this.dados.proprietarios && this.dados.proprietarios.codigoControle == "OK") {

      this.dados.proprietarios.item.sort(function (a, b) {
        let dataA = a.dataProcessamento!=undefined && a.dataProcessamento!=""? a.dataProcessamento : a.dataEmissaoGuia;
        let dataB = b.dataProcessamento!=undefined && b.dataProcessamento!=""? b.dataProcessamento : b.dataEmissaoGuia;

        if (dataA.split("/", 3)[2] + dataA.split("/", 3)[1] + dataA.split("/", 3)[0] >
          dataB.split("/", 3)[2] + dataB.split("/", 3)[1] + dataB.split("/", 3)[0]) {
          return 1;
        }
        if (dataA.split("/", 3)[2] + dataA.split("/", 3)[1] + dataA.split("/", 3)[0] <
          dataB.split("/", 3)[2] + dataB.split("/", 3)[1] + dataB.split("/", 3)[0]) {
          return -1;
        }
        return 0;
      });
     
      this.ocorrencias.push(this.dados.proprietarios)
    }
    
    
    if (this.dados.veiculo) {
      this.dados.veiculo.consulta = "VEICULO";
      this.ocorrencias.push(this.dados.veiculo)
    }



    let dataAnterior = new Date().getFullYear();

    var lProprietarios: any = []
    let proprietarioAnterior = "";
    var lValores: any = [];
    var lObjetoInsere: any = [];

    let encontrou = false;
    this.ocorrencias.forEach(element => {
      if (element.consulta == "PROPRIETARIOS_ANTERIORES") {
        element.item.forEach(valor => {

          if (proprietarioAnterior != valor.nomeProprietario.toString()) {
            if (this.lAnosBlackList.length == 0) {
              encontrou = true;
              var blackListItem: any = {
                ano: valor.anoExercicio,
                lObjeto: []
              };
            
              this.lAnosBlackList.push(blackListItem);
            }
            else {
              this.lAnosBlackList.forEach(item => {
                if (item.ano == valor.anoExercicio) {
                  encontrou = true;
                }
              });
              if (encontrou == false) {
                var blackListItem: any = {
                  ano: valor.anoExercicio,
                  lObjeto: []
                };
                
                this.lAnosBlackList.push(blackListItem);
              }
            }
            encontrou = false;
            proprietarioAnterior = valor.nomeProprietario.toString();
          }
       
        });
      }


      if (element.consulta == "VEICULO") {
        if (this.lAnosBlackList.length == 0) {
          var blackListItem: any = {
            ano: element.anoFabricacao,
            lObjeto: []
          };
          this.lAnosBlackList.push(blackListItem);
          encontrou = true;
        } else {
          this.lAnosBlackList.forEach(item => {
            if (item.ano == element.anoFabricacao) {
              encontrou = true;
            }
          });
          if (encontrou == false) {
            var blackListItem: any = {
              ano: element.anoFabricacao,
              lObjeto: []
            };
            this.lAnosBlackList.push(blackListItem);
          }
        }
        encontrou = false;
      }


      if (element.consulta == "GRAVAME") {

        element.dadosGravame.forEach(valor => {
          if (this.lAnosBlackList.length == 0) {
            var blackListItem: any = {
              ano: valor.dataStatus.split("/", 3)[2],
              lObjeto: []
            };
            this.lAnosBlackList.push(blackListItem);
            encontrou = true;
          }
          else {
            this.lAnosBlackList.forEach(item => {
              if (item.ano == valor.dataStatus.split("/", 3)[2]) {
                encontrou = true;
              }
            });
            if (encontrou == false) {
              var blackListItem: any = {
                ano: valor.dataStatus.split("/", 3)[2],
                lObjeto: []
              };
              this.lAnosBlackList.push(blackListItem);
            }
          }
          encontrou = false;
        });
      }
      if (element.consulta == "LEILAO") {

        element.dadosLeilao.forEach(valor => {

          if (this.lAnosBlackList.length == 0) {
            var blackListItem: any = {
              ano: valor.dataLeilao.split("/", 3)[2],
              lObjeto: []
            };
            this.lAnosBlackList.push(blackListItem);
            encontrou = true;
          }
          else {
            this.lAnosBlackList.forEach(item => {
              if (item.ano == valor.dataLeilao.split("/", 3)[2]) {
                encontrou = true;
              }
            });
            if (encontrou == false) {
              var blackListItem: any = {
                ano: valor.dataLeilao.split("/", 3)[2],
                lObjeto: []
              };

              this.lAnosBlackList.push(blackListItem);
            }
          }
          encontrou = false;
        });
      }
    });

    encontrou = false;


    proprietarioAnterior = "";
    this.ocorrencias.forEach(element => {

      let primeiro = true;

      if (element.consulta == "PROPRIETARIOS_ANTERIORES") {
        element.item.forEach(valor => {
          let lista;
          let data = valor.dataProcessamento!=undefined && valor.dataProcessamento!="" ? valor.dataProcessamento : valor.dataEmissaoGuia;
          
          lista = data.split("/", 3);
          
          if (proprietarioAnterior != valor.nomeProprietario.toString()) {
            //console.log("cade o decio = ",valor.nomeProprietario.toString())
            var itemProprietario: any = {
              consulta: "proprietarios_anteriores",
              doc: this.pessoaFisicaJuridica(valor.cgcCpf),
              nomeProprietario: valor.nomeProprietario.toString(),
              uf: valor.ufDut.toString(),
              ano: lista[2],
              mes: this.retornaMes(lista[1] - 1),
              mesValor: lista[1] - 1,
              dia: lista[0]
            }


            lObjetoInsere.push(itemProprietario);

        

            var objInterno: any = {
              ano: lista[2],
              lObjeto: lObjetoInsere
            }

            //this.listaExterna
            primeiro = false;
            this.listaExterna.push(objInterno);
          }


          if (proprietarioAnterior != valor.nomeProprietario.toString()) {
            
            var itemProprietario: any = {
              consulta: "proprietarios_anteriores",
              doc: this.pessoaFisicaJuridica(valor.cgcCpf),
              nomeProprietario: valor.nomeProprietario.toString(),
              uf: valor.ufDut.toString(),
              ano: lista[2],
              mes: this.retornaMes(lista[1] - 1),
              mesValor : lista[1] - 1,
              dia: lista[0]
            }


            for (let i = 0; i < this.lAnosBlackList.length; i++) {

            

              if (this.lAnosBlackList[i].ano == itemProprietario.ano) {
                this.lAnosBlackList[i].lObjeto.push(itemProprietario);
                encontrou = true;
                break;
              }

              
              
            }
          }
          encontrou = false;
          proprietarioAnterior = valor.nomeProprietario.toString();

        });
      }

   

      if (element.consulta == "GRAVAME") {

        element.dadosGravame.forEach(valor => {
          let lista = valor.dataStatus.split("/", 3);

          var itemGravame: any = {
            consulta: "gravame",
            nomeAgente: valor.nomeAgente,
            ano: lista[2],
            mes: this.retornaMes(lista[1] - 1),
            mesValor: lista[1] - 1,
            dia: lista[0],
            descricaoStatus: valor.descricaoStatus
          }

          for (let i = 0; i < this.lAnosBlackList.length; i++) {
            if (this.lAnosBlackList[i].ano == itemGravame.ano) {
              this.lAnosBlackList[i].lObjeto.push(itemGravame);
              encontrou = true;
              break;
            }
          }


        });
      }

      encontrou = false;

      if (element.consulta == "LEILAO") {

        element.dadosLeilao.forEach(item => {

          let lista = item.dataLeilao.split("/", 3)

          var itemLeilao: any = {
            consulta: "leilao",
            descricao: "Registro de Leilão",
            ano: lista[2],
            mes: this.retornaMes(lista[1] - 1),
            mesValor : lista[1] - 1,
            dia: lista[0]
          }

          for (let i = 0; i < this.lAnosBlackList.length; i++) {
            if (this.lAnosBlackList[i].ano == itemLeilao.ano) {
              this.lAnosBlackList[i].lObjeto.push(itemLeilao);
              break;
            }
          }


        });

      }

    });


    this.lAnosBlackList.sort(function (a, b) {
      if (a.ano > b.ano) {
        return -1;
      }
      if (a.ano < b.ano) {
        return 1;
      }
      if(a.ano == b.ano){
        if(a.mesValor > b.mesValor){
          return 1;
        }if(a.mesValor < b.mesValor){
          return -1;
        }
        if(a.mesValor == b.mesValor){
          if (a.dia > b.dia) {
            return 1;
          }
          if (a.dia < b.dia) {
            return -1;
          }
          return 0;
        }
      }
      return 0;
    });


/*
    this.lAnosBlackList.forEach(element => {
      element.lObjeto.sort(function (a, b) {
        if (a.mes > b.mes) {
          return -1;
        }
        if (a.mes < b.mes) {
          return 1;
        }
        if (a.mes == b.mes) {
          if (a.dia > b.dia) {
            return -1;
          }
          if (a.dia < b.dia) {
            return 1;
          }
          return 0;
        }
      });
    });
*/

    if (this.lAnosBlackList.length > 0) {
      var carro: any = {
        consulta: "carro",
        ano: "",
        mes: "",
        dia: "",
        descricao: "REGISTRO DO CARRO"
      }

      this.lAnosBlackList[this.lAnosBlackList.length - 1].lObjeto.push(carro);

      this.lAnosBlackList.forEach(element => {
        
        element.ano++;
      });

      //Ordenando os itens internos ...
      this.lAnosBlackList.forEach(element => {
        //console.log("Valor de element = ",element.lObjeto)
        element.lObjeto.sort(function (a, b) {
            if (a.ano > b.ano) {
              return -1;
            }
            if (a.ano < b.ano) {
              return 1;
            }
            if(a.ano == b.ano){
              if((a.mesValor) > (b.mesValor)){
                return -1;
              }if((a.mesValor) < (b.mesValor)){
                return 1;
              }
              if((a.mesValor) == (b.mesValor)){
                if (a.dia > b.dia) {
                  return -1;
                }
                if (a.dia < b.dia) {
                  return 1;
                }
                return 0;
              }
            }
            return 0;
          });
        })
    

      //console.log("this.lAnosBlackList = ",this.lAnosBlackList)


    }
  }




  pessoaFisicaJuridica(doc: any) {

    if (doc.toString().length <= 11) {
      return "pessoa física"
    } else if (doc.toString().length > 11) {
      return "pessoa juridica"
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tokenConsulta = params['tokenConsulta'];
      this.carregarTimeLine();

    });

  }


  verificaInsereGravame(dadoGravame: any) {

    if (dadoGravame.dataStatus.toString() == "Não Informado" || dadoGravame.dataStatus.toString() == "" || dadoGravame.dataStatus.toString() == null) {
      return false
    }
    return true
  }

  retornaMes(valor: any) {
    if (valor == 0) {
      return "JAN";
    } else if (valor == 1) {
      return "FEV";
    } else if (valor == 2) {
      return "MAR";
    } else if (valor == 3) {
      return "ABR";
    } else if (valor == 4) {
      return "MAI";
    } else if (valor == 5) {
      return "JUN";
    } else if (valor == 6) {
      return "JUL";
    } else if (valor == 7) {
      return "AGO";
    } else if (valor == 8) {
      return "SET";
    } else if (valor == 9) {
      return "OUT";
    } else if (valor == 10) {
      return "NOV";
    } else if (valor == 11) {
      return "DEZ";
    }
  }

  retornoValorMes(x: string) {
    const meses: Record<string, number> = {
      JAN: 0,
      FEV: 1,
      MAR: 2,
      ABR: 3,
      MAI: 4,
      JUN: 5,
      JUL: 6,
      AGO: 7,
      SET: 8,
      OUT: 9,
      NOV: 10,
      DEZ: 11,
    };
    return meses[x] ?? -1;
  }

  ngOnChanges() { }

}