import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoaService } from '../../service/pessoa.service';
import { LoginService } from '../../service/login.service';
import { CodeInputComponent } from '../code-input/code-input.component';

@Component({
    selector: 'app-confirmar-email',
    templateUrl: './confirmar-email.component.html',
    styleUrls: ['./confirmar-email.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, CodeInputComponent]
})
export class ConfirmarEmailComponent implements OnInit {

  @Input() user:any;
  @Input() token:any;
  @Output() emailConfirmado = new EventEmitter<{user: any, token: any}>();

  loading = false;
  codigo;
  codigoDigitado = false;
  codigoInvalido = false;

  constructor(
    private pessoaService: PessoaService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.acionarTimer();
  }

  acionarTimer(): void {
    // Oculta o botão de reenviar
    const resendBtn = document.getElementById('resendBtn');
    if (resendBtn) {
      resendBtn.style.display = 'none';
    }

    // Exibe o aviso de contador
    const counter = document.getElementById('counter');

    let secondsLeft = 40;
    if (counter) {
      counter.style.display = 'block';
      counter.textContent = `Para enviar um novo email com o código de verificação, aguarde ${secondsLeft} segundos`;
    }

    const countdown = setInterval(() => {
      secondsLeft--;
      if (counter) {
        counter.textContent = `Para enviar um novo email com o código de verificação, aguarde ${secondsLeft} segundos`;
      }
      if (secondsLeft <= 0) {
        clearInterval(countdown);
        if (counter) {
          counter.style.display = 'none'; // Esconde o aviso de contador quando o tempo acabar
        }
        if (resendBtn) {
          resendBtn.style.display = 'flex'; // Mostra o botão de reenviar novamente
        }
      }
    }, 1000);
  }

  reenviarEmail(): void {
    let entrada = {
      email: this.user.email,
    }
    this.pessoaService.reenviarCodigo(entrada).then((r) => {
      console.log(r);
    }).catch((error) => {
      console.log(error)
    });
    this.acionarTimer();
  }

  concluirCadastro(): void {
    this.loading = true;
    this.codigoInvalido = false;
    let entrada = {
      email: this.user.email,
      codigoEnviado: this.codigo
    }
    this.pessoaService.verificarCodigo(entrada).then((response) =>{
      if(response){
        this.loading = false;
        // Emitir evento para o componente pai processar o redirecionamento
        this.emailConfirmado.emit({
          user: this.user,
          token: this.token
        });
      }
    }).catch((error) => {
      this.loading = false;
      if (error.error == 'erro_verificacao_codigo') {
        this.codigoInvalido = true;
      }
    });
  }

  onCodeChanged(code: string): void {
    code = code.toUpperCase();
    this.codigo = code;
    this.codigoDigitado = code.length === 5;
  }

  onCodeCompleted(code: string): void {
    code = code.toUpperCase();
    this.codigoDigitado = code.length === 5;
    this.codigo = code;
  }



}


