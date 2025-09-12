import { Component, OnInit } from '@angular/core';
import { StatusPagamentoService } from '../service/status-pagamento.service';
import { FormControl, AbstractControl } from '../../../node_modules/@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-status-pagamento',
  templateUrl: './status-pagamento.component.html',
  styleUrls: ['./status-pagamento.component.scss']
})
export class StatusPagamentoComponent implements OnInit {

  pagamentos: any[];
  filtros: any = {
    codigoPagamento: ""
  };

  pesquisa = new FormControl();
  valorPesquisa = '';

  constructor(private statusPagamentoService: StatusPagamentoService, private title: Title, private meta: Meta) {

    this.pagamentos = [];

    this.pesquisa.valueChanges.pipe(distinctUntilChanged(), debounceTime(600)).subscribe((v) => { });
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
    this.statusPagamentoService.carregarLista({ codigoPagamento: this.pesquisa.value })
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
