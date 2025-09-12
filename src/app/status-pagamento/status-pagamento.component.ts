import { Component, OnInit } from '@angular/core';
import { StatusPagamentoService } from '../service/status-pagamento.service';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CkInputComponent } from '../components/ck-input/ck-input.component';

@Component({
    selector: 'app-status-pagamento',
    templateUrl: './status-pagamento.component.html',
    styleUrls: ['./status-pagamento.component.scss'],
    standalone: true,
    imports: [CommonModule, CkInputComponent]
})
export class StatusPagamentoComponent implements OnInit {

    pagamentos: any[];
    valorPesquisa: string | null = null;

    constructor(private statusPagamentoService: StatusPagamentoService, private title: Title, private meta: Meta) {
      this.pagamentos = [];
    }

  ngOnInit() {

    this.title.setTitle('Status de Pagamento');
    this.meta.updateTag({ name: 'description', content: 'Acompanhe o status de seus pagamentos realizados pela plataforma de forma rápida e segura.' });

    this.carregarLista();
  }

  filtrarLista() {
    this.carregarLista();
  }

  carregarLista() {
    this.statusPagamentoService.carregarLista({ codigoPagamento: this.valorPesquisa })
      .subscribe(lista => {
        //console.log( lista );
        console.log("erro----")
        this.pagamentos = lista;
      },
        error => {
          console.log("erro", error)
        }
      );
  }

}
