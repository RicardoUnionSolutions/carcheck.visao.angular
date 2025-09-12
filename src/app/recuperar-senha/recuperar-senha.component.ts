import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CkInputComponent } from '../components/ck-input/ck-input.component';

import { UntypedFormControl, Validators } from '@angular/forms';
import { PessoaService } from '../service/pessoa.service';
import { ModalService } from '../service/modal.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Title, Meta } from '@angular/platform-browser';


@Component({
    selector: 'app-recuperar-senha',
    templateUrl: './recuperar-senha.component.html',
    styleUrls: ['./recuperar-senha.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, CkInputComponent]
})
export class RecuperarSenhaComponent implements OnInit {

  email: UntypedFormControl;
  emailEnviado;
  loading:boolean = false;
  constructor(
    private modalService: ModalService, 
    private pessoaService: PessoaService,
    private titleService: Title, 
    private metaService: Meta
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Recuperar Senha - Sistema de Consulta Veicular');
    this.metaService.updateTag({ name: 'description', content: 'Insira seu e-mail para recuperar a senha de acesso ao sistema de consulta veicular.' });

    this.email = new UntypedFormControl('', [Validators.required, Validators.email]);

    this.email.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe((v: string) => {
      let newValue = v.replace(/\s/g, '')
      this.email.patchValue(newValue);
    });
  }

  enviarEmail() {
    this.email.markAsTouched();
    if (this.email.invalid)
      return;

    this.loading = true;
    this.pessoaService.recuperarSenha(this.email.value).subscribe(
      (rs) => {
        if(rs=='email_nao_cadastrado'){
          this.email.setErrors({ msg: 'E-mail não cadastrado.' });
          this.loading = false;
          return;  
        }
        this.emailEnviado = true;
        this.loading = false;
      },
      (err) => {
        this.modalService.openModalMsg({
          status:2, 
          title: 'Erro ao efetuar transação',
         text: 'Ocorreu um erro inesperado ao alterar senha, tente novamente mais tarde, caso o problema persista entre em contato com o suporte.',
         cancel: { show: false } });
        this.loading = false;
      }
    );
  }

}
