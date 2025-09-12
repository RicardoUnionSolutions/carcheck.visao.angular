import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { PessoaService } from '../service/pessoa.service';
import { error } from 'console';
import { Title, Meta } from '@angular/platform-browser';
import { DuvidasFrequentesComponent } from '../duvidas-frequentes/duvidas-frequentes.component';

@Component({
    selector: 'app-contato',
    templateUrl: './contato.component.html',
    styleUrls: ['./contato.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DuvidasFrequentesComponent]
})
export class ContatoComponent implements OnInit {
  contactForm: UntypedFormGroup;
  submitMessage: string = '';
  showErrors: boolean = false;

  constructor(
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private pessoaService: PessoaService,
    private title: Title,
    private meta: Meta
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.title.setTitle('Fale Conosco | CarCheck');
    this.meta.updateTag({
      name: 'description',
      content: 'Entre em contato com a equipe CarCheck. Tire suas dúvidas, envie sugestões ou solicite suporte técnico.'
    });
  }

  submitForm() {
    this.showErrors = true;

    if (this.contactForm.invalid) {
      console.log('Formulário inválido. Verifique os campos.');
      return;
    }

    const body = {
      nome: this.contactForm.get('name').value,
      email: this.contactForm.get('email').value,
      assunto: this.contactForm.get('subject').value,
      mensagem: this.contactForm.get('message').value
    }

    this.pessoaService.enviarContato(body).then(
      () => {
        this.submitMessage = 'Mensagem enviada com sucesso!';
      }, error => {
        this.submitMessage = 'Erro ao enviar mensagem. Tente novamente mais tarde.';
      }
    );
  }

  // Função auxiliar para acesso fácil aos campos do formulário
  get formControls() {
    return this.contactForm.controls;
  }
}
