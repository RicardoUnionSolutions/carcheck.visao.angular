import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UtilForms } from '../../../utils/util-forms';
import { UtilMasks } from '../../../utils/util-masks';
import { CepService } from '../../../service/cep.service';
import { UtilValidators } from '../../../utils/util-validators';
import { PessoaService } from '../../../service/pessoa.service';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'cadastrar-acesso',
  templateUrl: './cadastrar-acesso.component.html',
  styleUrls: ['./cadastrar-acesso.component.scss']
})
export class CadastrarAcessoComponent implements OnInit {

  @Input() cadastro = {
    nome: '',
    email: '',
    senha: '',
    clienteTipoIndefinido:'N',
    formAcesso: null
  }

  tipoClienteIndefinido:any;

  @Output() cadastroChange: any = new EventEmitter();

  form: FormGroup;
  ufOptions: any = UtilForms.options.estado;
  formMask: any;
  logou = false;

  emailMarketing: any = {
    acao: ''
  }

  constructor(private fb: FormBuilder, private pessoaService: PessoaService) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      nome: [this.cadastro.nome, Validators.required],
      email: [this.cadastro.senha, [Validators.required, Validators.email]],
      senha: [this.cadastro.senha, [Validators.required, Validators.minLength(4), Validators.maxLength(99)]],
      confirmarEmail: ['', [Validators.required, Validators.email, UtilValidators.equalValidator('email', false)]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(99), UtilValidators.equalValidator('senha')]],
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


    this.cadastro.formAcesso = this.form;
    this.formMask = {
      cep: { mask: UtilMasks.cep, guide: false },
      telefone: { mask: UtilMasks.tel, guide: false },
      cpf: { mask: UtilMasks.cpf, guide: false },
      data: { mask: UtilMasks.dataBr, guide: false }
    }

    this.form.valueChanges.subscribe(v => {
      this.updateCadastro(this.form.value);
    });

    this.tipoClienteIndefinido = 'S';
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
    });
  }

  updateCadastro(v) {
    this.cadastro.nome = v.nome || this.cadastro.nome;
    this.cadastro.email = v.email || this.cadastro.email;
    this.cadastro.senha = v.senha || this.cadastro.senha;
    this.cadastro.formAcesso = this.form;

    this.cadastroChange.emit(this.cadastro);
  }

}


