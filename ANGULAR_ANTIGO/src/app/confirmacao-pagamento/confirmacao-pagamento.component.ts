import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PagamentoService } from '../service/pagamento.service';
import { AnalyticsService } from '../service/analytics.service';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-confirmacao-pagamento',
  templateUrl: './confirmacao-pagamento.component.html',
  styleUrls: ['./confirmacao-pagamento.component.scss']
})
export class ConfirmacaoPagamentoComponent implements OnInit {
  dadosCompra: any;
  itens: any;
  tipoCompra;
  ultimacompra: any;
  @ViewChild('linkPagamento') linkPagamento: ElementRef;

  constructor(
    private router: Router,
    private pagamentoService: PagamentoService,
    private analyticsService: AnalyticsService,
    private notificationService: NotificationService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.ultimacompra = this.pagamentoService.getUltimaCompra().subscribe(v => {
      if (v == null || v.pagamento == null) return;
      this.dadosCompra = v.pagamento;
      this.itens = v.itens;
      this.tipoCompra = v.tipoCompra;

      let consultas: string[] = v.itens.map(i => {
        try {
          let composta = i.composta || { tipoProduto: '', label: '', nome: '' };
          let nome = i.label || composta.label || composta.nome;
          let tipo = composta.tipoProduto || '';
          return ('produto:' + nome + ';tipo:' + tipo).replace(/ /g, '_');
        } catch (error) {
          return '';
        }
      });
      this.router.navigate(['confirmacao-pagamento'], { queryParams: { compra: consultas.join(';') } });
      this.analyticsService.pagamentoFinalizado(v.pagamento, v.itens, v.tipoCompra);

      if (this.dadosCompra.tipoPagamento == 'BOLETO') {
        window.open(this.dadosCompra.urlBoleto, '_blank');
      } else if (this.dadosCompra.tipoPagamento == 'DEBITO') {
        window.open(this.dadosCompra.urlDebito, '_blank');
      } else if (this.dadosCompra.tipoPagamento == 'PIX') {
        window.open(this.dadosCompra.urlFatura, '_blank')
      }
      this.verificaStatus();
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Confirmação de Pagamento - CarCheck');
    this.metaService.updateTag({
      name: 'description',
      content: 'Veja os detalhes da sua compra e status do pagamento. Acompanhe o processamento do seu pedido com a CarCheck.'
    });
  }

  async verificaStatus() {

    this.pagamentoService.verificaStatusCompra(this.dadosCompra.tokenPagamento).then(r => {
      switch (r.situacaoPagamento[0]) {
        case "APROVADO":
          r.consulta != null ?
            this.router.navigate(['/']) :
            this.router.navigate(['/realizar-consultas']);
          this.analyticsService.pagamentoAprovado(this.dadosCompra, this.itens, this.tipoCompra);
          this.notificationService.addNotification("Pagamento aprovado", "Agradecemos por escolher o Carcheck Brasil!")
          break;
        case "AGUARDANDO_LIBERACAO":
          setTimeout(() => {
            this.verificaStatus();
          }, 15000);
          break;
        case "CANCELADO":
          this.notificationService.addNotification("Pagamento cancelado", "Caso duvidas, favor entrar em contato conosco")
        default:
          null;
          break;
      };
    });
  }

  ngOnDestroy() {
    this.ultimacompra.unsubscribe();
    this.pagamentoService.setUltimaCompra(null, null);
  }

  copyText() {
    navigator.clipboard.writeText
      (this.dadosCompra.qrCodeText);
  }

}
