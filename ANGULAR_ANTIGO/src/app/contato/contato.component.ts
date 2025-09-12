import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PessoaService } from '../service/pessoa.service';
import { error } from 'console';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss']
})
export class ContatoComponent implements OnInit {
  contactForm: FormGroup;
  submitMessage: string = '';
  showErrors: boolean = false;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
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
