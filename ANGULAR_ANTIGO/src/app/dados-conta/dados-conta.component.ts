import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilMasks } from '../utils/util-masks';
import { UtilForms } from '../utils/util-forms';
import { TokenService } from '../service/token.service';
import { PessoaService } from '../service/pessoa.service';
import { dadosConsultaService } from '../service/dados-consulta.service';
import { LoginService } from '../service/login.service';
import { CepService } from '../service/cep.service';
import { VariableGlobal } from '../service/variable.global.service';
import { filter, distinctUntilChanged, debounceTime, startWith, first } from 'rxjs/operators';
import { UtilValidators } from '../utils/util-validators';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'dados-conta',
  templateUrl: './dados-conta.component.html',
  styleUrls: ['./dados-conta.component.scss']
})
export class DadosContaComponent implements OnInit {

  @Input() dadosUsuario = {
    email: '',
    nome: '',
    bairro: '',
    cep: '',
    cidade: '',
    complemento: '',
    endereco: '',
    estado: '',
    numero: '',
    telefone: '',
    senha: '',
    senhaAntiga: ''
  }

  form = this.fb.group({
    cep: ['', [Validators.required, Validators.minLength(10)]],
    rua: ['', Validators.required],
    bairro: ['', Validators.required],
    uf: ['', Validators.required],
    documento: ['', Validators.required],
    dataNascimento: ['', Validators.required],
    nome: ['', Validators.required],
    cidade: ['', Validators.required],
    numero: ['', Validators.required],
    complemento: [''],
    telefone: ['', Validators.required],
    email: [{ value: '', disabled: 'disabled' }, [Validators.required, Validators.email]],
    senhaAntiga: ['', [Validators.minLength(4), Validators.maxLength(99)]],
    senhaNova: ['', [Validators.minLength(4), Validators.maxLength(99)]],
  });

  loadingEndereco = false;
  loadingCadastro = false;

  login: any;

  consultas: any;
  ufOptions: any = UtilForms.options.estado;
  formMask = {
    cep: { mask: UtilMasks.cep, guide: true },
    telefone: { mask: UtilMasks.tel, guide: true },
    data: { mask: UtilMasks.dataBr, guide: false },
    documento: { mask: UtilMasks.cpf, guide: true }
  };
  msg: any = '';

  urlSite: String = '';

  constructor(private varGlobal: VariableGlobal, private cepService: CepService, private loginService: LoginService, private dadosConsultaService: dadosConsultaService, private fb: FormBuilder, private tokenService: TokenService, private pessoaService: PessoaService,
    private title: Title,
    private meta: Meta
  ) {
  }

  ngOnInit() {

    this.title.setTitle('Dados da Conta - CarCheck');
    this.meta.updateTag({
      name: 'description',
      content: 'Atualize os dados da sua conta, endereço, telefone e senha com segurança e praticidade.'
    });

    this.getUserInfo();

    this.form.controls.senhaNova.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((v: string) => {
        let newValue = v
        this.form.controls.senhaNova.patchValue(newValue.replace(/\s/g, ''));
      });

    this.form.controls.senhaAntiga.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((v: string) => {
        let newValue = v
        this.form.controls.senhaAntiga.patchValue(newValue.replace(/\s/g, ''));
      });
  }


  montarConsultas(data) {
    this.consultas = [];

    data.forEach(d => {
      if (d.nome == 'Completa') {
        let consulta = { label: d.nome, quantidade: d.quantidade, link: this.urlSite + '/consulta-completa/', id: d.id, cliente: this.login.email };
        this.consultas.push(consulta);
      }

      if (d.nome == 'Segura') {
        let consulta = { label: d.nome, quantidade: d.quantidade, link: this.urlSite + '/consulta-segura/', id: d.id, cliente: this.login.email };
        this.consultas.push(consulta);
      }

      if (d.nome == 'Gravame') {
        let consulta = { label: d.nome, quantidade: d.quantidade, link: this.urlSite + '/consulta-gravame/', id: d.id, cliente: this.login.email };
        this.consultas.push(consulta);
      }

      if (d.nome == 'Leilao') {
        let consulta = { label: d.nome, quantidade: d.quantidade, link: this.urlSite + '/consulta-leilao/', id: d.id, cliente: this.login.email };
        this.consultas.push(consulta);
      }

      if (d.nome == 'Decodificador') {
        let consulta = { label: d.nome, quantidade: d.quantidade, link: this.urlSite + '/consulta-decodificador/', id: d.id, cliente: this.login.email };
        this.consultas.push(consulta);
      }
    });
  }

  getUserInfo() {

    this.urlSite = this.varGlobal.getUrlSite().home;
    this.consultas = [
      { label: 'Completa', quantidade: 0, link: this.urlSite + '/consulta-completa/' },
      { label: 'Segura', quantidade: 0, link: this.urlSite + '/consulta-segura/', },
      { label: 'Gravame', quantidade: 0, link: this.urlSite + '/consulta-gravame/' },
      { label: 'Leilão', quantidade: 0, link: this.urlSite + '/consulta-leilao/' },
      { label: 'Decodificador', quantidade: 0, link: this.urlSite + '/consulta-decodificador/' },
    ];

    this.loginService.getLogIn().pipe(first()).subscribe(async v => {

      this.form.get('documento')?.clearValidators();

      this.login = v;
      await this.form.patchValue({
        cep: this.login.endereco.cep,
        rua: this.login.endereco.endereco,
        bairro: this.login.endereco.bairro,
        uf: this.login.endereco.estado,
        documento: this.login.cliente.documento,
        dataNascimento: this.login.cliente.dataNascimento,
        nome: this.login.nome,
        cidade: this.login.endereco.cidade,
        numero: this.login.endereco.numero,
        complemento: this.login.endereco.complemento,
        telefone: this.login.cliente.telefone,
        email: this.login.email,
        senhaAntiga: '',
        senhaNova: '',
      });

      this.setSearchCep();

      this.form.get('documento')?.setValidators([Validators.required, UtilValidators.cpf]);
      this.form.get('documento')?.updateValueAndValidity();

    });
  }

  setSearchCep() {

    this.form.controls.cep.valueChanges.pipe(debounceTime(600), filter((v) => this.form.controls.cep.valid), distinctUntilChanged()).subscribe(v => {
      v = v.replace(/\D/g, '');
      if (v.length == 8) {
        this.loadingEndereco = true;
        this.cepService.search(v).then(
          response => {
            if (response.erro == null || response.erro == false) {
              var f = this.form.value;
              this.form.patchValue({
                rua: response.logradouro == null ? f.endereco : response.logradouro,
                cidade: response.localidade == null ? f.endereco : response.localidade,
                bairro: response.bairro == null ? f.endereco : response.bairro,
                uf: response.uf == null ? f.endereco : response.uf
              });
            }
            this.loadingEndereco = false;
          },
          error => {
            console.log('erro ao localizar cep:', error);
            this.loadingEndereco = false;
          });
      }
    });

  }

  salvar() {
    this.msg = '';
    let senha = '';
    //força exibir erro nos campos marcando como tocados.
    this.form.controls.senhaAntiga.clearValidators();
    for (let i in this.form.controls) {
      this.form.controls[i].markAsTouched();
    }

    if (this.form.invalid) return;

    if (this.form.value.senhaNova.trim().length >= 4)
      senha = this.form.value.senhaNova;


    let dados = {
      senha: senha,
      senhaAntiga: this.form.value.senhaAntiga,
      cep: this.form.value.cep,
      endereco: this.form.value.rua,
      numero: this.form.value.numero,
      bairro: this.form.value.bairro,
      cidade: this.form.value.cidade,
      complemento: this.form.value.complemento,
      estado: this.form.value.uf,
      uf: this.form.value.uf,
      telefone: this.form.value.telefone,
      email: this.login.email,
      documento: this.form.value.documento,
      dataNascimento: this.form.value.dataNascimento,
      nome: this.form.value.nome
    };
    this.loadingCadastro = true;
    this.pessoaService.atualizar(dados)
      .then(novoToken => {
        this.loadingCadastro = false;
        this.loginService.logIn(novoToken);
        this.msg = 'success';
      })
      .catch(error => {
        console.log("erro", error)
        if (error.error = "erro_senha") {
          this.form.controls.senhaAntiga.setErrors({ 'password': true });
        }
        this.loadingCadastro = false;
      });

    //this.loginService.logIn(this.dadosUsuario);
    //localStorage.setItem('tokenLogin', JSON.stringify(this.dadosUsuario));
    this.form.value.senhaAntiga = '';
    this.form.value.senhaNova = '';

  }

  //Carrega o token e decodifica
  /*carregarDadosUsuarioLogado() {

    if (this.tokenService.getTokenLogin() !== "" && this.tokenService.getTokenLogin() !== "null") {
      var dados = JSON.parse(this.tokenService.decodeToken("tokenLogin"));

      console.log(dados);

      this.dadosUsuario.cep = dados.endereco.cep;
      this.dadosUsuario.endereco = dados.endereco.endereco;
      this.dadosUsuario.numero = dados.endereco.numero;
      this.dadosUsuario.bairro = dados.endereco.bairro;
      this.dadosUsuario.cidade = dados.endereco.cidade;
      this.dadosUsuario.complemento = dados.endereco.complemento;
      this.dadosUsuario.estado = dados.endereco.estado;
      this.dadosUsuario.email = dados.email;
      this.dadosUsuario.senhaAntiga = dados.senha;
    }
  }*/



  carregaCreditoCliente() {


  }
}
