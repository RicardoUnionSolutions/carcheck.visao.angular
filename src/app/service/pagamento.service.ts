import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { VariableGlobal } from './variable.global.service';
import { TokenService } from './token.service';
import { PagSeguroService } from './pagseguro.service';
import { Cupom } from '../classes/cupom';

@Injectable()
export class PagamentoService {

  private ultimaCompra: any = null;

  constructor(private http: HttpClient, private variableGlobal: VariableGlobal, private tokenService: TokenService, private pagSeguroService: PagSeguroService) {
    this.ultimaCompra = new BehaviorSubject(null);
  }

  async pagar(pagamento: any): Promise<any> {
    console.log('Tipo de pagamento:', pagamento.pagamento.tipo);
    
    if (pagamento.pagamento.tipo == "CARTAO") {
      let validade = pagamento.pagamento.CARTAO.vencimento;
      let mes = validade.split("/")[0];
      let ano = "20" + validade.split("/")[1];
      console.log('Processando cartão de crédito');
      try {
        let tokenPagamentoCartao = await this.pagSeguroService.getTokenCardPagSeguro(pagamento.pagamento.CARTAO.numero, pagamento.pagamento.CARTAO.cvv, mes, ano)
        pagamento.pagamento.tokenCartao = tokenPagamentoCartao;
        console.log('Token do cartão obtido com sucesso');
      } catch (error) {
        pagamento.pagamento.origemPagamento = "PAG_SEGURO";
        pagamento.pagamento.origemPagamento = "IUGU";
        console.log('Erro no PagSeguro, redirecionando para IUGU');
      }
    } else if (pagamento.pagamento.tipo == "BOLETO") {
      console.log('Processando pagamento via boleto - IUGU');
      pagamento.pagamento.origemPagamento = "IUGU";
    } else if (pagamento.pagamento.tipo == "PIX") {
      console.log('Processando pagamento via PIX - IUGU');
      pagamento.pagamento.origemPagamento = "IUGU";
    }
    
    console.log('Enviando pagamento para o backend:', pagamento);
    return this.realizarPagamento(pagamento).toPromise();
  }

  realizarPagamento(pagamento) {
    return this.http.post(this.variableGlobal.getUrl("pagamento/pagar"), pagamento)
  }

  getUltimaCompra(): Observable<any> | null {
    return this.ultimaCompra.asObservable();
  }

  setUltimaCompra(pag, itensCompra, tipoCompra: string = null) {
    this.ultimaCompra.next({ pagamento: pag, itens: itensCompra, tipoCompra: tipoCompra });
  }

  validaCupom(nomeCupom: any) {
    return this.http.get<boolean>(this.variableGlobal.getUrl("") + "painel/validaCupomPagamento?nomeCupom=" + nomeCupom).toPromise();
  }

  dadosCupom(nomeCupom: any) {
    return this.http.get<Cupom[]>(this.variableGlobal.getUrl("") + "painel/getDadosCupom?nomeCupom=" + nomeCupom).toPromise();
  }

  qtdCupomDisp() {
    return this.http.get<any>(this.variableGlobal.getUrl("") + "painel/getQuantidadeCupomAtivos").toPromise();
  }

  verificaStatusCompra(idCompra) {
    return this.http.get<any>(this.variableGlobal.getUrl("")+ "pagamento/verificarPagamento?idCompra=" + idCompra).toPromise();
  }

}
