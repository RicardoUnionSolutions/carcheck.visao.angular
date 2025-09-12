import { Injectable } from '@angular/core';
import { PessoaService } from './pessoa.service';

declare var ga: any;
declare var fbq: any;
declare var gtag: any;

@Injectable({
  providedIn: 'root'
})

export class AnalyticsService {
  constructor(private pessoaService: PessoaService) {
  }

  atualizacaoPagina(novaPagina) {
    //  ga('set', 'page', novaPagina);
    //  ga('send', 'pageview');

    // fbq('track', 'PageView');

  }

  registroEntrandoPagamento() {
    //  ga('set', 'page', "/carregandoPagamento");
    // ga('send', 'pageview');

    // fbq('track', 'AddPaymentInfo');
  }

  registroCadastroCliente() {
    //  ga('set', 'page', "/cadastroCliente");
    //  ga('send', 'pageview');

    // fbq('track', 'CompleteRegistration');
  }

  pagamentoFinalizado(pag, itens, tipoCompra = null) {

    let consultas = [];
    let total = 0;
    let possuiLaudo = false;
    for (let i = 0; i < itens.length; i++) {
      let item = itens[i];
      if (item.quantidade > 0) {
        consultas.push({
          id: item.composta.id,
          nome: item.composta.nome || item.label || item.composta.label || 'não informado',
          valor: item.valorConsulta || item.composta.valorConsulta || 0.00,
          quantidade: item.quantidade,
          tipo: item.composta.tipoProduto || 'CONSULTA',
        });
        total += item.quantidade * item.valorConsulta;
        if (item.composta.tipoProduto == 'LAUDO') {
          possuiLaudo = true;
        }
      }
    }

    gtag('event', 'conversaoVenda', {
      email: this.pessoaService.getEmail(),
      telefone: this.pessoaService.getTelefone(),
      tipopagamento: pag.tipoPagamento,
      totalpagamento: total,
      totalItens: consultas.length,
      tipoCompra: tipoCompra || (consultas.length > 1 || consultas[0].quantidade > 1 ? 'multipla' : 'unica'),
      currency: 'BRL',
      itens: consultas,
      possuiLaudo: possuiLaudo,
    });
    // fbq('track', 'Purchase', { currency: 'BRL', value: total });

  }

  pagamentoAprovado(pag, itens, tipoCompra = null) {
    let consultas = [];
    let total = 0;
    for (let i = 0; i < itens.length; i++) {
      let item = itens[i];
      if (item.quantidade > 0) {
        consultas.push({
          id: item.composta.id,
          nome: item.composta.nome || item.label || item.composta.label || 'não informado',
          valor: item.valorConsulta || item.composta.valorConsulta || 0.00,
          quantidade: item.quantidade,
          tipo: item.composta.tipoProduto || 'CONSULTA',
        });
        total += item.quantidade * item.valorConsulta;
      }
    }

    gtag('event', 'conversaoVendaAprovado', {
      email: this.pessoaService.getEmail(),
      telefone: this.pessoaService.getTelefone(),
      tipopagamento: pag.tipoPagamento,
      totalpagamento: total,
      totalItens: consultas.length,
      tipoCompra: tipoCompra || (consultas.length > 1 || consultas[0].quantidade > 1 ? 'multipla' : 'unica'),
      currency: 'BRL',
      itens: consultas
    });
  }

  homePageSistema() {
    gtag('event', 'pageView', {
      page_title: 'home',
      page_location: 'https://carcheckbrasil.com.br/home',
      email: this.pessoaService.getEmail(),
    })
  }

  experimentou() {
    gtag('event', 'consultaTeste', {
      path: '/consulta-teste',
      email: this.pessoaService.getEmail(),
    })
  }

  addToCart(consulta) {
    gtag('event', 'addToCart', {
      path: '/comprar-consulta-placa',
      email: this.pessoaService.getEmail(),
      telefone: this.pessoaService.getTelefone(),
      produto: 'Consulta ' + consulta
    })
  }

  addToCartCredito(consultas) {
    gtag('event', 'addToCart', {
      path: '/processo-compra-multipla',
      email: this.pessoaService.getEmail(),
      telefone: this.pessoaService.getTelefone(),
      produtos: consultas
    })
  }


  novoCadastro() {
    gtag('event', 'cadastroInicial');
  }

  novoCadastroFb() {
    gtag('event', 'cadastroInicialFacebook');
  }

  novoCadastroGoogle() {
    gtag('event', 'cadastroInicialGoogle');
  }

  cadastroCompleto() {
    gtag('event', 'cadastroFinalizado');
  }

  //completa, segura....
  selecionouTipoConsulta(tipo) {
    gtag('event', 'selecionouTipoConsulta', tipo || 'nao_informado');
  }

  //placa ou chassi
  informouVeiculo(tipo) {
    gtag('event', 'informouVeiculo', tipo || 'nao_informado');
  }

}
