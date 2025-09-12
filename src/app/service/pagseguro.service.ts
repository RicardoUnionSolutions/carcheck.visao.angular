
import { Injectable } from '@angular/core';
import { VariableGlobal } from './variable.global.service';
import { HttpClient } from '@angular/common/http';

declare var PagSeguroDirectPayment: any;


@Injectable()
export class PagSeguroService {
  constructor(private http: HttpClient, private variableGlobal: VariableGlobal) { }


  public getSession(): Promise<any> {
    return this.http.get(this.variableGlobal.getUrl("pagSeguro/getIdSession"), {responseType: 'text'}).toPromise();
  }

  getTokenEnvioPagSeguro() {
    return PagSeguroDirectPayment.getSenderHash();
  }

  getTokenCardPagSeguro(numeroCartao: String, cvv: String, mesExpiracao: String, anoExpiracao: String): Promise<any> {
    return new Promise((resolve, reject) => {
      numeroCartao = numeroCartao.replace(/\s/g, "");
      PagSeguroDirectPayment.createCardToken({
        cardNumber: numeroCartao,
        cvv: cvv,
        expirationMonth: mesExpiracao,
        expirationYear: anoExpiracao,
        success: response => {
          resolve(response.card.token);
        }, error: response => reject()
      });
    });
  }

  carregaJavascript() {
    var promise = new Promise<void>((resolve, reject) => {
      if (!this.variableGlobal.getStatusScript()) {
        let script: HTMLScriptElement = document.createElement('script');
        script.addEventListener('load', r => {
          // console.log("addScriptPagSeguro");
          this.variableGlobal.setStatusScript(true);
          resolve();
        });
        script.src = this.variableGlobal.getUrl("pagSeguro/urlJavaScript");
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });

    return promise;
  }

  carregarbandeiraCartao(numeroCartao: any, valor: any): Promise<any> {
    // console.log('cardBin = ',numeroCartao)
    return new Promise<any>((resolve, reject) => {
      PagSeguroDirectPayment.getBrand({
        cardBin: numeroCartao,
        success: response => {
          var objBandeira = {
            bandeira: response.brand.name,
            valor: [],
            config: {
              cvvSize: response.brand.cvvSize,
              hasCvv: response.brand.hasCvv,
              hasDueDate: response.brand.hasDueDate,
              hasPassword: response.brand.hasPassword,
              acceptedLengths: response.brand.acceptedLengths,
            }
          };
          this.carregarParcelasPagamento(objBandeira.bandeira, valor).then((valorBandeira: any[]) => {
            objBandeira.valor = valorBandeira;
            console.log('Carrega parcelas pagamento');

            resolve(objBandeira);
          });
        },
        error: (response) => {
          resolve(this.montarValores(valor));
        }
      }
      );
    }).catch(err => {

      return new Promise<any>((resolve, reject) => {
        resolve(this.montarValores(valor));
      });
    });
  }

  montarValores(valor) {
    // console.log("montarValores");
    var objBandeira = {
      bandeira: "outro",
      valor: []
    }
    var lista = [];
    lista[0] = { quantidadeParcela: 1, total: valor, totalFinal: valor, valorParcela: valor, label: "1 x R$ " + valor + "= R$ " + valor + "" };
    lista[1] = { quantidadeParcela: 2, total: valor, totalFinal: valor, valorParcela: valor / 2.0, label: "2 x R$ " + valor / 2.0 + "= R$ " + valor + "" };
    lista[2] = { quantidadeParcela: 3, total: valor, totalFinal: valor + (0.00995 * valor), valorParcela: (valor + (0.00995 * valor)) / 3.0, label: "3 x R$ " + (valor + (0.00995 * valor)) / 3.0 + "= R$ " + (valor + (0.00995 * valor)) + "" };
    lista[3] = { quantidadeParcela: 4, total: valor, totalFinal: valor + (0.01128 * valor), valorParcela: (valor + (0.01128 * valor)) / 4.0, label: "4 x R$" + (valor + (0.01128 * valor)) / 4.0 + "= R$ " + (valor + (0.01128 * valor)) + "" };
    lista[4] = { quantidadeParcela: 5, total: valor, totalFinal: valor + (0.01214 * valor), valorParcela: (valor + (0.01214 * valor)) / 5.0, label: "5 x R$ " + (valor + (0.01214 * valor)) / 5.0 + "= R$ " + (valor + (0.01214 * valor)) + "" };
    lista[5] = { quantidadeParcela: 6, total: valor, totalFinal: valor + (0.01261 * valor), valorParcela: (valor + (0.01261 * valor)) / 6.0, label: "6 x R$ " + (valor + (0.01261 * valor)) / 6.0 + "= R$ " + (valor + (0.01261 * valor)) + "" };
    lista[6] = { quantidadeParcela: 7, total: valor, totalFinal: valor + (0.01314 * valor), valorParcela: (valor + (0.01314 * valor)) / 7.0, label: "7 x R$ " + (valor + (0.01314 * valor)) / 7.0 + "= R$ " + (valor + (0.01314 * valor)) + "" };
    lista[7] = { quantidadeParcela: 8, total: valor, totalFinal: valor + (0.01342 * valor), valorParcela: (valor + (0.01342 * valor)) / 8.0, label: "8 x R$ " + (valor + (0.01342 * valor)) / 8.0 + "= R$ " + (valor + (0.01342 * valor)) + "" };
    // lista[8] = { quantidadeParcela: 9, total: valor, totalFinal: valor + (0.01374 * valor), valorParcela: (valor + (0.01374 * valor)) / 9.0, label: "9 x R$ " + (valor + (0.01374 * valor)) / 9.0 + "= R$ " + (valor + (0.01374 * valor)) + "" };
    // lista[9] = { quantidadeParcela: 10, total: valor, totalFinal: valor + (0.01385 * valor), valorParcela: (valor + (0.01385 * valor)) / 10.0, label: "10 x R$ " + (valor + (0.01385 * valor)) / 10.0 + "= R$ " + (valor + (0.01385 * valor)) + "" };
    // lista[10] = { quantidadeParcela: 11, total: valor, totalFinal: valor + (0.01409 * valor), valorParcela: (valor + (0.01409 * valor)) / 11.0, label: "11 x R$ " + (valor + (0.01409 * valor)) / 11.0 + "= R$ " + (valor + (0.01409 * valor)) + "" };
    // lista[11] = { quantidadeParcela: 12, total: valor, totalFinal: valor + (0.01437 * valor), valorParcela: (valor + (0.01437 * valor)) / 12.0, label: "12 x R$ " + (valor + (0.01437 * valor)) / 12.0 + "= R$ " + (valor + (0.01437 * valor)) + "" };
    objBandeira.valor = lista;

    return objBandeira;
  }

  carregarParcelasPagamento(bandeira, valor) {

    return new Promise((resolve, reject) => {

      PagSeguroDirectPayment.getInstallments({
        amount: valor,
        brand: bandeira,
        maxInstallmentNoInterest: 2,
        success: function (parcelas) {
          var objSaida = [];
          parcelas.installments[bandeira].forEach(element => {
            var objBandeira = {
              quantidadeParcela: element.quantity,
              total: valor,
              //totalFinal: element.totalAmount,
              totalFinal: element.quantity * element.installmentAmount,
              valorParcela: element.installmentAmount,
            }
            objSaida.push(objBandeira);
          });
          resolve(objSaida);
        },
        error: function (response) {
          console.log("DEU ERRO NO CARREGAMENTO DE PARCELAS")
        }
      });
    }).catch(erro => console.log("Deu erro no carregamento de parcela só vai -> carregarParcelasPagamento"));
  }

  carregarMeioPagamento(tokenPagSeguro): Promise<any[]> {
    var dados;

    PagSeguroDirectPayment.setSessionId(tokenPagSeguro);

    var promise = new Promise((resolve, reject) => {
      PagSeguroDirectPayment.getPaymentMethods({
        success: response => {
          var listaPagamento = [];

          //CARTAO
          listaPagamento.push(this.carregarMeioPagamentoCartao(response.paymentMethods.CREDIT_CARD.options));

          //BOLETO
          listaPagamento.push(this.carregarMeioPagamentoBoleto(response.paymentMethods.BOLETO.options.BOLETO));

          //DEBITO
          listaPagamento.push(this.carregarMeioPagamentoDebito(response.paymentMethods.ONLINE_DEBIT.options));

          resolve(listaPagamento);
        }
      });
    });

    return promise as Promise<any[]>;
  }

  carregarMeioPagamentoCartao(opcoesPagamentoCartao) {
    var saida = { tipo: "CARTAO", status: false };
    Object.keys(opcoesPagamentoCartao).forEach(element => {
      if (opcoesPagamentoCartao[element].status == "AVAILABLE") {
        saida.status = true;
      }
    });
    return saida;
  }

  carregarMeioPagamentoBoleto(opcoesPagamentoBoleto) {
    var saida = { tipo: "BOLETO", status: false };
    if (opcoesPagamentoBoleto.status == "AVAILABLE") {
      saida.status = true;
    }
    return saida;
  }

  carregarMeioPagamentoDebito(opcoesPagamentoDebito) {
    var saida = { tipo: "DEBITO", status: false, lista: [] };
    Object.keys(opcoesPagamentoDebito).forEach(element => {
      if (opcoesPagamentoDebito[element].status == "AVAILABLE") {
        var objBanco = {
          nome: opcoesPagamentoDebito[element].displayName,
          img: opcoesPagamentoDebito[element].images.MEDIUM.path,
          codigo: opcoesPagamentoDebito[element].code,
        }
        saida.lista.push(objBanco);
      }
      saida.status = saida.lista.length > 0;
    });

    return saida;
  }



  /*pegarCardToken() {
     var token;
     var listaPagamento = [];
     var promise = new Promise((resolve, reject) => {
       PagSeguroDirectPayment.getPaymentMethods({
         success: response => {


           //CARTAO
           listaPagamento.push(this.carregarMeioPagamentoCartao(response.paymentMethods.CREDIT_CARD.options));

           //BOLETO
           listaPagamento.push(this.carregarMeioPagamentoBoleto(response.paymentMethods.BOLETO.options.BOLETO));

           //DEBITO
           listaPagamento.push(this.carregarMeioPagamentoDebito(response.paymentMethods.ONLINE_DEBIT.options));

           resolve(listaPagamento);
           console.log(listaPagamento);
         token=  response.card.token;
         }

       });
     });
     console.log(token)
  }*/




}
