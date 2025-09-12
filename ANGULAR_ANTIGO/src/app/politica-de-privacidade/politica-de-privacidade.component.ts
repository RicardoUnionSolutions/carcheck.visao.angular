import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-politica-de-privacidade',
  templateUrl: './politica-de-privacidade.component.html',
  styleUrls: ['./politica-de-privacidade.component.scss']
})
export class PoliticaDePrivacidadeComponent implements OnInit {

  constructor(
    private title: Title,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.title.setTitle('Política de Privacidade | CarCheck');
    this.meta.updateTag({
      name: 'description',
      content: 'Saiba como protegemos seus dados. Leia nossa Política de Privacidade e entenda como tratamos suas informações pessoais.'
    });
  }

}
