import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabNavComponent } from '../tab-nav/tab-nav.component';
import { CadastrarPessoaFisicaComponent } from './cadastrar-pessoa-fisica/cadastrar-pessoa-fisica.component';
import { CadastrarPessoaJuridicaComponent } from './cadastrar-pessoa-juridica/cadastrar-pessoa-juridica.component';

@Component({
    selector: 'cadastrar',
    templateUrl: './cadastrar.component.html',
    styleUrls: ['./cadastrar.component.scss'],
    standalone: true,
    imports: [CommonModule, TabNavComponent, CadastrarPessoaFisicaComponent, CadastrarPessoaJuridicaComponent]
})
export class CadastrarComponent implements OnInit {

  @Input() cadastro ={
    /* pj */
    razaoSocial: '',
    cnpj: '',
    /* pf */
    cpf: '',
    nome: '',
    email: '',
    senha: '',
    cep: '',
    numero: '',
    endereco: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    tipoPessoa: '',
    telefone: '',
    clienteTipoIndefinido:'S'
  };

  @Output() cadastroChange = new EventEmitter();

  pessoaJuridica = '1';
  pessoaFisica = '0';

  constructor() {
   }

  ngOnInit() { 

  }

  tipoPessoaChange(){
    this.cadastroChange.emit(this.cadastro);
  }

}
