import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'code-input',
  templateUrl: './code-input.component.html',
  styleUrls: ['./code-input.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeInputComponent),
      multi: true
    }
  ]
})
export class CodeInputComponent implements OnInit, ControlValueAccessor {
  @Input() isCodeHidden: boolean = false;
  @Input() codeLength: number = 5;
  @Input() isCharsCode: boolean = true;
  @Input() inputType: string = 'text';
  
  @Output() codeChanged = new EventEmitter<string>();
  @Output() codeCompleted = new EventEmitter<string>();

  code: string[] = [];
  private onChange = (value: string) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.code = new Array(this.codeLength).fill('');
  }

  onInputChange(index: number, event: any) {
    const value = event.target.value;
    
    // Se o valor não mudou, não processa
    if (this.code[index] === value) {
      return;
    }
    
    // Limita a apenas 1 caractere
    const newValue = value.slice(-1);
    
    // Se for caractere, converte para maiúsculo
    if (this.isCharsCode && newValue) {
      this.code[index] = newValue.toUpperCase();
    } else {
      this.code[index] = newValue;
    }

    // Força a atualização do valor do input
    setTimeout(() => {
      event.target.value = this.code[index];
    }, 0);

    // Move para o próximo campo se o atual foi preenchido
    if (newValue && index < this.codeLength - 1) {
      const nextInput = event.target.parentElement.children[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }

    // Move para o campo anterior se o atual foi apagado
    if (!newValue && index > 0) {
      const prevInput = event.target.parentElement.children[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }

    const fullCode = this.code.join('');
    this.onChange(fullCode);
    this.codeChanged.emit(fullCode);

    if (fullCode.length === this.codeLength) {
      this.codeCompleted.emit(fullCode);
    }
  }

  onKeyDown(index: number, event: KeyboardEvent) {
    // Permite apenas backspace, delete, setas e caracteres alfanuméricos
    if (event.key === 'Backspace' || event.key === 'Delete' || 
        event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
        event.key === 'Tab') {
      return;
    }

    // Se for caractere, permite apenas letras e números
    if (this.isCharsCode) {
      if (!/[a-zA-Z0-9]/.test(event.key)) {
        event.preventDefault();
      }
    } else {
      // Se for numérico, permite apenas números
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    }
  }

  onKeyUp(index: number, event: KeyboardEvent) {
    // Limpa o campo se tiver mais de 1 caractere
    const target = event.target as HTMLInputElement;
    if (target.value.length > 1) {
      const lastChar = target.value.slice(-1);
      this.code[index] = this.isCharsCode ? lastChar.toUpperCase() : lastChar;
      target.value = this.code[index];
      
      const fullCode = this.code.join('');
      this.onChange(fullCode);
      this.codeChanged.emit(fullCode);
    }
  }

  writeValue(value: string): void {
    if (value) {
      this.code = value.split('').slice(0, this.codeLength);
      while (this.code.length < this.codeLength) {
        this.code.push('');
      }
    } else {
      this.code = new Array(this.codeLength).fill('');
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implementar se necessário
  }

  onPaste(event: ClipboardEvent, startIndex: number) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    
    // Remove caracteres inválidos
    let cleanText = pastedText;
    if (this.isCharsCode) {
      cleanText = pastedText.replace(/[^a-zA-Z0-9]/g, '');
    } else {
      cleanText = pastedText.replace(/[^0-9]/g, '');
    }
    
    // Preenche os campos a partir do índice atual
    for (let i = 0; i < cleanText.length && (startIndex + i) < this.codeLength; i++) {
      this.code[startIndex + i] = this.isCharsCode ? cleanText[i].toUpperCase() : cleanText[i];
    }
    
    // Foca no próximo campo vazio ou no último
    const nextEmptyIndex = this.code.findIndex((digit, index) => index >= startIndex && !digit);
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : Math.min(startIndex + cleanText.length, this.codeLength - 1);
    
    setTimeout(() => {
      const inputs = document.querySelectorAll('.code-input-field');
      if (inputs[focusIndex]) {
        (inputs[focusIndex] as HTMLInputElement).focus();
      }
    }, 0);
    
    const fullCode = this.code.join('');
    this.onChange(fullCode);
    this.codeChanged.emit(fullCode);

    if (fullCode.length === this.codeLength) {
      this.codeCompleted.emit(fullCode);
    }
  }
}
