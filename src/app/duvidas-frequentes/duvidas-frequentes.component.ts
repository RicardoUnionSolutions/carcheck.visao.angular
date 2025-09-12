import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { faqs } from '../utils/faqs';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-duvidas-frequentes',
    templateUrl: './duvidas-frequentes.component.html',
    styleUrls: ['./duvidas-frequentes.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class DuvidasFrequentesComponent implements OnInit {
  
  activeCard: string = '';

  listaFaqs = faqs;

  constructor(
    private title: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Dúvidas Frequentes | CarCheck');
    this.meta.updateTag({
      name: 'description',
      content: 'Encontre respostas para as perguntas mais comuns sobre nossas consultas veiculares, planos e formas de pagamento.'
    });
  }

  toggleCard(cardId: string) {
    this.activeCard = this.activeCard === cardId ? '' : cardId;
  }
}
