import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UtilForms } from '../../../utils/util-forms';
import { UtilMasks } from '../../../utils/util-masks';
import { CepService } from '../../../service/cep.service';
import { UtilValidators } from '../../../utils/util-validators';
import { distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'cadastrar-pessoa-juridica',
  templateUrl: './cadastrar-pessoa-juridica.component.html',
  styleUrls: ['./cadastrar-pessoa-juridica.component.scss']
})
export class CadastrarPessoaJuridicaComponent implements OnInit {


  @Input() cadastro = {
    nome: '',
    razaoSocial: '',
    cnpj: '',
    email: '',
    senha: '',
    cep: '',
    numero: '',
    endereco: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    telefone: '',
    dataNascimento: '',
    tipoPessoa: '0',
    tokenFacebook: '',
    clienteTipoIndefinido:'N',
    form: null
  }


  @Output() cadastroChange: any = new EventEmitter();

  ufOptions: any = UtilForms.options.estado;
  form: FormGroup;
  formMask: any;
  loadingEndereco = false;
  lastCep = '';

  constructor(private fb: FormBuilder, private cepService: CepService) { }

  ngOnInit() {
    this.form = this.fb.group({
      //razaoSocial: [this.cadastro.razaoSocial, Validators.required],
      nome: [{ value: this.cadastro.nome, disabled: this.cadastro.tokenFacebook != '' }, [Validators.required,UtilValidators.nomeCompleto]],
      email: [{ value: this.cadastro.email, disabled: this.cadastro.tokenFacebook != '' }, [Validators.required, Validators.email]],
      senha: [this.cadastro.senha, [Validators.required, Validators.minLength(4), Validators.maxLength(99)]],
      confirmarEmail: [{value:'', disabled: this.cadastro.tokenFacebook!=''}, [Validators.required, Validators.email, UtilValidators.equalValidator('email', false)]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(99), UtilValidators.equalValidator('senha')]],
      /*    cep: [this.cadastro.cep, [Validators.required, Validators.minLength(10)]],
          endereco: [this.cadastro.endereco, Validators.required],
          bairro: [this.cadastro.bairro, Validators.required],
          uf: [this.cadastro.uf, Validators.required],
          cidade: [this.cadastro.cidade, Validators.required],
          numero: [this.cadastro.numero, Validators.required],
          telefone: [this.cadastro.numero, Validators.required],
          celular: [this.cadastro.numero],
          complemento: [this.cadastro.complemento],
          cnpj: [this.cadastro.cnpj, UtilValidators.cnpj],
          dataNascimento: [this.cadastro.dataNascimento, Validators.required]
          */
    });
    this.verificatokenFacebook(this.cadastro);
    this.formMask = {
      cep: { mask: UtilMasks.cep, guide: false },
      telefone: { mask: UtilMasks.tel, guide: false },
      cnpj: { mask: UtilMasks.cnpj, guide: false },
      data: { mask: UtilMasks.dataBr, gruide: false }
    }

    /*this.ufOptions = UtilForms.options.estado;

    this.form.controls.cep.valueChanges.subscribe(v => {
      if (v.length >= 10 && this.lastCep != v) {
        this.lastCep = v;
        this.loadingEndereco = true;
        this.cepService.search(v).toPromise().then(
          response => {
            this.loadingEndereco = false;
            this.form.patchValue({
              endereco: response.logradouro,
              cidade: response.localidade,
              bairro: response.bairro,
              uf: response.uf,
              complemento: response.complemento
            })
          }, 
          error => {
            console.log('erro ao localizar cep:', error);
            this.loadingEndereco = false;
          });
      }
    });*/

    this.form.valueChanges.subscribe(v => {
      this.updateCadastro(this.form.value);
    });

    
    this.form.controls.senha.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe((v: string) => {
      let newValue = v
      this.form.controls.senha.patchValue(newValue.replace(/\s/g, ''));
    });

    this.form.controls.email.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe((v: string) => {
      let newValue = v.replace(/\s/g, '')
      this.form.controls.email.patchValue(newValue);
    });

    this.form.controls.confirmarSenha.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe((v: string) => {
      let newValue = v.replace(/\s/g, '')
      this.form.controls.confirmarSenha.patchValue(newValue);
    });

    this.form.controls.confirmarEmail.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe((v: string) => {
      let newValue = v.replace(/\s/g, '')
      this.form.controls.confirmarEmail.patchValue(newValue);
    });


  }

  ngOnChanges() {
    if (this.form != null && this.cadastro != null)
      this.updateForm(this.cadastro);
  }

  updateForm(v) {
    this.form.patchValue({
      nome: v.nome || '',
      email: v.email || '',
      senha: v.senha || '',
      /*  cnpj: v.cnpj || '',
        cep: v.cep || '',
        numero: v.numero || '',
        endereco: v.endereco || '',
        complemento: v.complemento || '',
        bairro: v.bairro || '',
        cidade: v.cidade || '',
        uf: v.uf || '',
        telefone: v.telefone || '',
        dataNascimento: v.dataNascimento || '',*/
    });
    this.verificatokenFacebook(v);
  }

  verificatokenFacebook(v) {
    if (v.tokenFacebook != '' && this.form.controls.senha != null) {
      this.form.removeControl('senha');
    } else if (v.tokenFacebook == '' && this.form.controls.senha == null) {
      this.form.setControl('senha', new FormControl());
      this.form.controls.senha.patchValue(v.senha || '');
    }
  }

  updateCadastro(v) {
    this.cadastro.razaoSocial = v.razaoSocial || this.cadastro.razaoSocial;
    this.cadastro.nome = v.nome || this.cadastro.nome;
    this.cadastro.email = v.email || this.cadastro.email;
    this.cadastro.senha = v.senha || this.cadastro.senha;
    this.cadastro.clienteTipoIndefinido = 'N';
    /*this.cadastro.cnpj = v.cnpj || this.cadastro.cnpj;
    this.cadastro.cep = v.cep || this.cadastro.cep;
    this.cadastro.numero = v.numero || this.cadastro.numero;
    this.cadastro.endereco = v.endereco || this.cadastro.endereco;
    this.cadastro.complemento = v.complemento || this.cadastro.complemento;
    this.cadastro.bairro = v.bairro || this.cadastro.bairro;
    this.cadastro.cidade = v.cidade || this.cadastro.cidade;
    this.cadastro.uf = v.uf || this.cadastro.uf;
    this.cadastro.telefone = v.telefone || this.cadastro.telefone;
    this.cadastro.dataNascimento = v.dataNascimento || this.cadastro.dataNascimento;*/
    if (this.cadastro.tipoPessoa == "1") this.cadastro.form = this.form;
    this.cadastroChange.emit(this.cadastro);
  }


}
