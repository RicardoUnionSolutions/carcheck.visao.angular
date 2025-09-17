import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PagSeguroService } from '../../service/pagseguro.service';
import { AnalyticsService } from '../../service/analytics.service';
import { PagamentoService } from '../../service/pagamento.service';
import { CreditoComponent } from './credito/credito.component';
import { BoletoComponent } from './boleto/boleto.component';
import { PixComponent } from './pix/pix.component';
import { TabNavComponent } from '../../components/tab-nav/tab-nav.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalTermosUsoComponent } from '../../modal-termos-uso.component';



@Component({
    selector: 'forma-pagamento',
    templateUrl: './forma-pagamento.component.html',
    styleUrls: ['./forma-pagamento.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, TabNavComponent, CreditoComponent, BoletoComponent, PixComponent, ModalTermosUsoComponent]
})
export class FormaPagamentoComponent implements OnInit {
  @ViewChild(CreditoComponent) credito;
  tabIndex = { credito: 0, boleto: 1, pix: 2 };
  formaPagamento = this.tabIndex.credito;
  private previousFormaPagamento = this.tabIndex.credito;

  @Input() menuPagamento: any[];

  listaPagamento: any = [];

  @Input() pagamento: any = {
    termosUso: false,
    cupomDesconto: '',
    origemPagamento: 'PAG_SEGURO',
    tipo: '',
    tokenCartao: '',
    tokenEnvioPagSeguro: '',
  };

  @Input() valorTotal = 0;
  @Input() valorTotalDesconto = 0;
  @Output() valorTotalChange = new EventEmitter();
  @Output() valorTotalDescontoChange = new EventEmitter();
  valorDesconto = 0;
  
  // Estado de carregamento do card
  cardLoading = true;

  cupom = '';
  cupomQuantidade = 0;
  cupomMsg = '';
  cupomError = false;

  usuario: any;

  @Input() bancoDebito = null;
  bandeirasDebito: any;
  termosUsoAlert = false;
  mostrarModalTermos = false;

  constructor(
    private pagamentoService: PagamentoService,
    public pagSeguro: PagSeguroService,
    private analyticsService: AnalyticsService
  ) {

    this.menuPagamento = [
      { title: 'Crédito', icon: 'mdi mdi-credit-card-multiple', value: 'CREDITO' },
      { title: 'Boleto', icon: 'mdi mdi-barcode', value: 'BOLETO' },
      { title: 'Pix', icon: 'mdi mdi-qrcode', value: 'PIX'}
      // { title: 'Débito', icon: 'mdi mdi-cash-multiple', value: 'DEBITO' }
    ];

  }

  ngOnInit() {
    this.analyticsService.registroEntrandoPagamento();
    this.carregaJavascriptPagseguro();
  }

  ngOnChanges() {
    this.calcularTotalComDesconto();
    this.simulateCardLoading();
  }
  
  private simulateCardLoading() {
    // Simula o carregamento do card por 2 segundos
    this.cardLoading = true;
    setTimeout(() => {
      this.cardLoading = false;
    }, 2000);
  }

  ngAfterViewInit() {
    // Monitora mudanças na forma de pagamento
    this.monitorFormaPagamento();
  }

  private monitorFormaPagamento() {
    // Usa setInterval para verificar mudanças na forma de pagamento
    setInterval(() => {
      if (this.formaPagamento !== this.previousFormaPagamento) {
        console.log('FormaPagamentoComponent: Mudança detectada na forma de pagamento');
        console.log('Anterior:', this.previousFormaPagamento, 'Atual:', this.formaPagamento);
        
        // Se mudou para crédito, reinicializa o card
        if (this.formaPagamento === this.tabIndex.credito && this.credito) {
          console.log('FormaPagamentoComponent: Reinicializando card de crédito');
          setTimeout(() => {
            this.credito.reinitializeCard();
          }, 500);
        }
        
        this.previousFormaPagamento = this.formaPagamento;
      }
    }, 100);
  }


  calcularTotalComDesconto() {
    this.pagamento.cupomDesconto = this.cupom;
    this.valorTotalDesconto = this.valorTotal * ((100 - this.valorDesconto) / 100);
    this.valorTotalDescontoChange.emit(this.valorTotalDesconto);
  }


  async carregaJavascriptPagseguro() {
    try {
      await this.pagSeguro.carregaJavascript();
      const session = await this.pagSeguro.getSession();
      const lista: any[] = await this.pagSeguro.carregarMeioPagamento(session);
      this.listaPagamento = lista;
      let debito = lista.find(v => v.tipo == "DEBITO") || { lista: [] };
      this.bandeirasDebito = debito.lista;
      this.pagamento.origemPagamento = "PAG_SEGURO";
      this.pagamento.tokenEnvioPagSeguro = this.pagSeguro.getTokenEnvioPagSeguro();
    } catch (error) {

    }
  }

  openModalTermosUso(): void {
    this.mostrarModalTermos = true;
  }

  closeModalTermosUso(aceitou: boolean): void {
    this.mostrarModalTermos = false;
    if (aceitou) {
      this.pagamento.termosUso = true;
      this.termosUsoAlert = false;
    }
  }



  async validaCupom() {
    if (!this.cupom.trim()) {
      this.cupomError = true;
      this.cupomMsg = "Cupom não informado.";
      this.valorDesconto = 0;
      this.calcularTotalComDesconto();
      return;
    }
    try {
      const isValid = await this.pagamentoService.validaCupom(this.cupom);
      if (isValid) {
        const infoCupom = await this.pagamentoService.dadosCupom(this.cupom);
        this.cupomError = false;
        this.cupomMsg = "O cupom foi aplicado com sucesso. Você só poderá pagar à vista.";
        this.valorDesconto = infoCupom[0].valorDesconto;
      } else {
        this.cupomError = true;
        this.cupomMsg = "O cupom não é válido."
        this.valorDesconto = 0;
      }
    } catch (error) {
      this.valorDesconto = 0;
      this.cupomError = true;
      this.cupomMsg = "Erro ao tentar válidar o cupom."
    }
    this.calcularTotalComDesconto();
  }

  private removerCupom() {
    this.valorDesconto = 0;
    this.cupom = '';
    this.cupomError = false;
    this.cupomMsg = '';
    this.calcularTotalComDesconto();
  }



  private getPagamentoPadrao() {
    return {
      situacaoPagamento: "",
      parcela: {
        quantidadeParcela: 1,
        total: this.valorTotal,
        totalFinal: this.valorTotal,
        valorParcela: this.valorTotal,
      }
    };
  }

  getPagamento() {
    let pagamento = {...this.pagamento};
    if (!this.pagamento.termosUso) {
      this.termosUsoAlert = true;
      throw 'ERRO_TERMO_USO';
    }

    if(this.tabIndex.credito == this.formaPagamento) {
      pagamento.tipo = 'CARTAO';
      if(!this.credito.form) {
        throw 'ERRO_CREDITO_FORM_NAO_ENCONTRADO';
      }
      if(this.credito.form.invalid) {
        for (let i in this.credito.form.controls) {
          this.credito.form.controls[i].markAsTouched();
        }
        console.log(this.credito.form);
        throw 'ERRO_CREDITO_FORM_INVALIDO';
      }
      pagamento.CARTAO = { ...this.credito.form.value }
      if(this.cupom && !this.cupomError) {
        let pagPadrao = this.getPagamentoPadrao();
        pagamento.CARTAO.parcela = pagPadrao.parcela;
        pagamento.CARTAO.situacaoPagamento = pagPadrao.situacaoPagamento;
      }
      return pagamento;
    }

    // if(this.tabIndex.debito == this.formaPagamento) {
    //   pagamento.tipo = 'DEBITO';
    //   if(!this.bancoDebito) {
    //     throw 'ERRO_BANCO_NAO_ENCONTRADO';
    //   }
    //   pagamento.nomeBanco = this.bancoDebito;
    //   pagamento.DEBITO = this.getPagamentoPadrao();
    //   return pagamento;
    // }

    if(this.tabIndex.boleto == this.formaPagamento) {
      pagamento.tipo = 'BOLETO';
      pagamento.BOLETO = this.getPagamentoPadrao();
      return pagamento;
    }

    if(this.tabIndex.pix == this.formaPagamento){
      pagamento.tipo = 'PIX';
      pagamento.PIX = this.getPagamentoPadrao();
      return pagamento;
    }
    throw 'ERRO_TIPO_PAGAMENTO_INVALIDO';


  }

}

