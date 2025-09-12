import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss']
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

  pessoaJuridica = '1' || '2';
  pessoaFisica = '0' || '2';

  constructor() {
   }

  ngOnInit() { 

  }

  tipoPessoaChange(){
    this.cadastroChange.emit(this.cadastro);
  }

}
