import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { UtilValidators } from '../../../utils/util-validators';
import { UtilMasks } from '../../../utils/util-masks';
import { UtilForms } from '../../../utils/util-forms';
import { LoginService } from '../../../service/login.service';
import { CepService } from '../../../service/cep.service';
import { PessoaService } from '../../../service/pessoa.service';
import { distinctUntilChanged, filter, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'cadastrar-dados-usuario',
  templateUrl: './cadastrar-dados-usuario.component.html',
  styleUrls: ['./cadastrar-dados-usuario.component.scss']
})


export class CadastrarDadosUsuarioComponent implements OnInit {

  formMask: any;
  form: FormGroup;
  ufOptions: any = UtilForms.options.estado;
  loadingEndereco = false;

  usuario: any;

  currentTabTipoIndefinido: '0';
  logou = false;
  email: any;
  login: any;



  @Input() cadastro: any = {
    cnpj: '',
    cpf: '',
    cep: '',
    numero: '',
    endereco: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    telefone: '',
    dataNascimento: '',
    tipoPessoa: 0,
    formCadastro: null
  }

  emailMarketing: any = {
    acao: ''
  }

  @Output() cadastroChange: any = new EventEmitter();

  constructor(private loginService: LoginService, private cepService: CepService, private fb: FormBuilder, private pessoaService: PessoaService) {
  }

  ngOnInit() {

    this.form = this.fb.group({
      cep: ['', [Validators.required, Validators.minLength(10)]],
      endereco: ['', Validators.required],
      bairro: ['', Validators.required],
      uf: ['', Validators.required],
      cidade: ['', Validators.required],
      numero: ['', Validators.required],
      telefone: ['', Validators.required],
      complemento: [''],
      dataNascimento: ['', Validators.required],
    });

    this.cadastro.formCadastro = this.form;

    this.tipoPessoaChange();

    this.form.valueChanges.subscribe((v) => {
      this.cadastro.cnpj = v.cnpj || this.cadastro.cnpj;
      this.cadastro.cpf = v.cpf || this.cadastro.cpf;
      this.cadastro.cep = v.cep || this.cadastro.cep;
      this.cadastro.numero = v.numero || this.cadastro.numero;
      this.cadastro.endereco = v.endereco || this.cadastro.endereco;
      this.cadastro.complemento = v.complemento || this.cadastro.complemento;
      this.cadastro.bairro = v.bairro || this.cadastro.bairro;
      this.cadastro.cidade = v.cidade || this.cadastro.cidade;
      this.cadastro.uf = v.uf || this.cadastro.uf;
      this.cadastro.telefone = v.telefone || this.cadastro.telefone;
      this.cadastro.dataNascimento = v.dataNascimento || this.cadastro.dataNascimento;

      this.cadastro.tipoPessoa = this.cadastro.tipoPessoa;
      this.cadastro.formCadastro = this.form;
    });

    this.loginService.getLogIn().subscribe(v => {
      this.login = v;
    });

    if (this.login.cliente.tipoPessoa == 'JURIDICA') {
      this.cadastro.tipoPessoa = '1';
    } else {
      this.cadastro.tipoPessoa = '0';
    }

    this.email = this.login.email;

    this.logou = this.loginService.getTokenLogin() != null;

    this.formMask = {
      cep: { mask: UtilMasks.cep, guide: false },
      telefone: { mask: UtilMasks.tel, guide: false },
      cpf: { mask: UtilMasks.cpf, guide: false },
      cnpj: { mask: UtilMasks.cnpj, guide: false },
      data: { mask: UtilMasks.dataBr, gruide: false }
    }

    this.ufOptions = UtilForms.options.estado;

    this.form.controls.cep.valueChanges.pipe(debounceTime(600), filter(v => v && v.length >= 10), distinctUntilChanged()).subscribe(v => {
      this.loadingEndereco = true;
      this.cepService.search(v).then(
        response => {
          if (response.erro == null || response.erro == false) {
            var f = this.form.value;
            this.form.patchValue({
              endereco: response.logradouro == null ? f.endereco : response.logradouro,
              cidade: response.localidade == null ? f.endereco : response.localidade,
              bairro: response.bairro == null ? f.endereco : response.bairro,
              uf: response.uf == null ? f.endereco : response.uf
            });
          }
          this.loadingEndereco = false;
        },
        error => {
          this.loadingEndereco = false;
        });
    });


  }

  tipoPessoaChange() {
    if (this.cadastro.tipoPessoa == 1) {
      this.form.setControl('cnpj', new FormControl(this.cadastro.cnpj || '', UtilValidators.cnpj));
      this.form.removeControl('cpf');
    } else if (this.cadastro.tipoPessoa == 0) {
      this.form.setControl('cpf', new FormControl(this.cadastro.cnpj || '', UtilValidators.cpf));
      this.form.removeControl('cnpj');
    } else {
      this.form.setControl('cpf', new FormControl(this.cadastro.cnpj || '', UtilValidators.cpf));
      this.form.removeControl('cnpj');
    }
  }
}