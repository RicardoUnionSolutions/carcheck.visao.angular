import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PessoaService } from '../service/pessoa.service';
import { TokenService } from '../service/token.service';
import { LoginService } from '../service/login.service';
import { Title, Meta } from '@angular/platform-browser';
import { TabNavComponent } from '../components/tab-nav/tab-nav.component';
import { CadastrarPessoaFisicaComponent } from '../components/cadastrar/cadastrar-pessoa-fisica/cadastrar-pessoa-fisica.component';
import { CadastrarPessoaJuridicaComponent } from '../components/cadastrar/cadastrar-pessoa-juridica/cadastrar-pessoa-juridica.component';

@Component({
    selector: 'completar-cadastro',
    templateUrl: './completar-cadastro.component.html',
    styleUrls: ['./completar-cadastro.component.scss'],
    standalone: true,
    imports: [
      TabNavComponent,
      CadastrarPessoaFisicaComponent,
      CadastrarPessoaJuridicaComponent
    ]
})
export class CompletarCadastroComponent implements OnInit {

  userDados: any;

  @Input() cadastro = {
    /* pj */
    razaoSocial: '',
    nomeResponsavel: '',
    cnpj: '',
    /* pf */
    nome: '',
    cpf: '',
    /* pj/pf */
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
    tokenFacebook: ''
  };

  atualizado = false;

  @Output() cadastroChange = new EventEmitter();
  @Output() atualizouCad = new EventEmitter();

  pessoaJuridica = '1';
  pessoaFisica = '0';

  constructor(
    private pessoaService: PessoaService,
    private tokenService: TokenService,
    private loginService: LoginService,
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit() {
    this.carregarDadosUsuarioLogado();
    this.verificarDados();

    this.titleService.setTitle('Completar Cadastro - CarCheck');
    this.metaService.updateTag({
      name: 'description',
      content: 'Preencha ou atualize seus dados cadastrais para continuar utilizando nossos serviços com segurança.'
    });
  }

  atualizarCadastro() {
    this.pessoaService.atualizar(this.cadastro)
      .then(response => {
        this.atualizado = true;
        this.loginService.logIn(response);
        this.atualizouCad.emit();
      })
      .catch(error => console.log("erro", error));
  }

  verificarDados() {

    var dadosCliente = this.userDados['cliente'];
    var dadosEnd = this.userDados['endereco'];

    if (dadosCliente['tipoPessoa'] == 'FISICA') {
      this.cadastro.tipoPessoa = '0';
    } else {
      this.cadastro.tipoPessoa = '1';
    }

    this.cadastro.cpf = dadosCliente['documento'];
    this.cadastro.email = this.userDados['email'];
    this.cadastro.nome = this.userDados['nome'];
    this.cadastro.senha = this.userDados['senha'];
    this.cadastro.cidade = dadosEnd['cidade'];
    this.cadastro.uf = dadosEnd['estado'];
    this.cadastro.bairro = dadosEnd['bairro'];
    this.cadastro.numero = dadosEnd['numero'];
    this.cadastro.complemento = dadosEnd['complemento'];
    this.cadastro.endereco = dadosEnd['endereco'];
    this.cadastro.cep = dadosEnd['cep'];

  }

  tipoPessoaChange() {
    this.cadastroChange.emit(this.cadastro);
  }

  carregarDadosUsuarioLogado() {
    if (localStorage.getItem("tokenLogin")) {
      var dados = this.tokenService.decodeToken("tokenLogin");
      this.userDados = JSON.parse(dados);
    }
  }

  temToken() {
    this.carregarDadosUsuarioLogado();
    if (localStorage.getItem("tokenLogin")) {
      return true;
    } else {
      return false;
    }
  }

}
