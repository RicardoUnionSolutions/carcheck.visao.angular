import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
    selector: 'app-politica-de-privacidade',
    templateUrl: './politica-de-privacidade.component.html',
    styleUrls: ['./politica-de-privacidade.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class PoliticaDePrivacidadeComponent implements OnInit {

  private title = inject(Title);
  private meta = inject(Meta);

  constructor() { }

  ngOnInit() {
    this.title.setTitle('Política de Privacidade | CarCheck');
    this.meta.updateTag({
      name: 'description',
      content: 'Saiba como protegemos seus dados. Leia nossa Política de Privacidade e entenda como tratamos suas informações pessoais.'
    });
  }

}
