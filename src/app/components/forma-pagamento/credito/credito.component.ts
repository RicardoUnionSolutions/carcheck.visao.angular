import { Component, OnInit, Input, AfterViewInit, OnDestroy, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { PagSeguroService } from '../../../service/pagseguro.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { UtilMasks } from '../../../utils/util-masks';
import { UtilValidators } from '../../../utils/util-validators';
import { LoginService } from '../../../service/login.service';
import { distinctUntilChanged, debounceTime, filter, map, first } from 'rxjs/operators';
import { PessoaService } from '../../../service/pessoa.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskDirective } from '../../../directives/text-mask.directive';
import { CkSelectComponent } from '../../ck-select/ck-select.component';
import { CkInputComponent } from '../../ck-input/ck-input.component';

declare var PagSeguroDirectPayment: any;
declare var Card: any;

@Component({
    selector: 'forma-pagamento-credito',
    templateUrl: './credito.component.html',
    styleUrls: ['./credito.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TextMaskDirective, CkSelectComponent, CkInputComponent]
})
export class CreditoComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() valorTotal = 0;
  @Input() valorTotalDesconto = 0;
  @ViewChild('cardForm', { static: false }) cardForm!: ElementRef;
  parcelas: any[] = [];
  cpfControl: UntypedFormControl = new UntypedFormControl('', { validators: UtilValidators.cpf });
  formMask: any;

  form: UntypedFormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(35)]],
    numero: ['', [Validators.required, this.creditCardValidator]], // Validador customizado para cartão
    cvv: ['', [Validators.required]],
    parcela: [null, Validators.required],
    vencimento: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
    donoCartao: [false],
    documentoCartao: ['', [Validators.required, UtilValidators.cpf]]
  });

  loadingCartao: boolean = false;
  lastNumCartao = '';
  cartao: any = { bandeira: '', config: null };
  login: any;

  messages: any = {
    validDate: 'Data válida\naté',
    monthYear: 'mm/aaaa'
  };

  placeholders: any = {
    number: '•••• •••• •••• ••••',
    name: 'Nome Completo',
    expiry: '••/••',
    cvc: '•••'
  };

  masks: any = {
    cardNumber: '•'
  };

  documentoDono: any;
  private cardInstance: any = null;
  private isCardInitialized = false;

  constructor(private loginService: LoginService, public pagSeguro: PagSeguroService, private fb: UntypedFormBuilder, pessoaService: PessoaService) { }

  // Validador customizado para cartão de crédito
  creditCardValidator(control: UntypedFormControl) {
    if (!control.value) {
      return null;
    }
    
    // Remove espaços e caracteres não numéricos
    const cleanValue = control.value.replace(/\D/g, '');
    
    // Verifica se tem exatamente 16 dígitos
    if (cleanValue.length !== 16) {
      return { invalidCreditCard: true };
    }
    
    // Verifica se todos os caracteres são dígitos
    if (!/^\d{16}$/.test(cleanValue)) {
      return { invalidCreditCard: true };
    }
    
    return null;
  }

  // Método para limitar entrada do cartão de crédito
  onCreditCardInput(event: any) {
    const input = event.target;
    let value = input.value;
    
    // Remove caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');
    
    // Limita a 16 dígitos
    if (cleanValue.length > 16) {
      const limitedValue = cleanValue.substring(0, 16);
      // Aplica a máscara manualmente
      const formattedValue = this.formatCreditCard(limitedValue);
      input.value = formattedValue;
      this.form.controls.numero.setValue(formattedValue);
    } else {
      // Aplica a máscara normalmente
      const formattedValue = this.formatCreditCard(cleanValue);
      input.value = formattedValue;
      this.form.controls.numero.setValue(formattedValue);
    }
  }

  // Método para interceptar teclas pressionadas
  onCreditCardKeyPress(event: KeyboardEvent) {
    const char = String.fromCharCode(event.which);
    
    // Permite apenas números (0-9)
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
      return false;
    }
    
    // Verifica se já atingiu o limite de 16 dígitos
    const currentValue = (event.target as HTMLInputElement).value;
    const numbersOnly = currentValue.replace(/\D/g, '');
    
    if (numbersOnly.length >= 16) {
      event.preventDefault();
      return false;
    }
    
    return true;
  }

  // Método para formatar o cartão de crédito
  private formatCreditCard(value: string): string {
    const cleanValue = value.replace(/\D/g, '');
    const match = cleanValue.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
    if (match) {
      const formatted = [match[1], match[2], match[3], match[4]]
        .filter(group => group.length > 0)
        .join(' ');
      return formatted;
    }
    return cleanValue;
  }

  ngOnInit() {
    // Inicializa as máscaras
    this.formMask = {
      cvv: { mask: UtilMasks.cvv, guide: false },
      vencimento: { mask: UtilMasks.vencimentoCartao, guide: false },
      cpf: { mask: UtilMasks.cpf, guide: false },
      creditCard: { 
        mask: UtilMasks.creditCard, 
        guide: false,
        placeholderChar: '•',
        showMask: false,
        keepCharPositions: false,
        pipe: this.creditCardPipe
      }
    };

    this.setParcelaInicial();

    this.loginService.getLogIn().pipe(first()).subscribe(v => {
      this.login = v;
      this.documentoDono = this.login.cliente.documento;
      this.form.controls.donoCartao.valueChanges.subscribe(v => this.updateControlCpf(v));
      this.form.controls.donoCartao.patchValue(v.cliente.tipoPessoa != 'JURIDICA');
    });
    this.getCreditCardBrand(this.form.controls.numero.value.replace(" ", ""));
    this.form.controls.numero.valueChanges
      .pipe(debounceTime(500), map(v => v.replace(" ", "")), filter(v => v.length > 5), distinctUntilChanged())
      .subscribe(v => this.getCreditCardBrand(v));
  }

  ngAfterViewInit() {
    console.log('CreditoComponent: ngAfterViewInit chamado');
    this.initializeCard();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('CreditoComponent: ngOnChanges chamado', changes);
    // Se o componente foi recriado, reinicializa o card
    if (changes.valorTotal || changes.valorTotalDesconto) {
      setTimeout(() => {
        this.initializeCard();
      }, 100);
    }
  }

  ngOnDestroy() {
    console.log('CreditoComponent: ngOnDestroy chamado');
    this.destroyCard();
  }

  private initializeCard() {
    console.log('CreditoComponent: Tentando inicializar card.js');
    
    // Destrói instância anterior se existir
    this.destroyCard();
    
    // Aguarda o card.js carregar e inicializa o cartão
    setTimeout(() => {
      if (typeof Card !== 'undefined' && this.cardForm && this.cardForm.nativeElement) {
        console.log('CreditoComponent: Inicializando nova instância do card.js');
        try {
          this.cardInstance = new Card({
            form: this.cardForm.nativeElement,
            container: '.card-wrapper',
            width: 350,
            formatting: true,
            messages: {
              validDate: 'Data válida\naté',
              monthYear: 'mm/aaaa'
            },
            placeholders: {
              number: '•••• •••• •••• ••••',
              name: 'Nome Completo',
              expiry: '••/••',
              cvc: '•••'
            },
            masks: {
              cardNumber: '•'
            }
          });
          this.isCardInitialized = true;
          console.log('CreditoComponent: Card.js inicializado com sucesso');
        } catch (error) {
          console.error('CreditoComponent: Erro ao inicializar card.js:', error);
        }
      } else {
        console.warn('CreditoComponent: Card.js não disponível ou form não encontrado');
        console.log('Card disponível:', typeof Card !== 'undefined');
        console.log('Form disponível:', !!this.cardForm);
        console.log('Form element:', this.cardForm?.nativeElement);
      }
    }, 1000);
  }

  private destroyCard() {
    if (this.cardInstance) {
      console.log('CreditoComponent: Destruindo instância anterior do card.js');
      try {
        // Limpa o container do card
        const container = document.querySelector('.card-wrapper');
        if (container) {
          container.innerHTML = '';
        }
        this.cardInstance = null;
        this.isCardInitialized = false;
      } catch (error) {
        console.error('CreditoComponent: Erro ao destruir card.js:', error);
      }
    }
  }

  // Método público para reinicializar o card (pode ser chamado externamente)
  public reinitializeCard() {
    console.log('CreditoComponent: Reinicializando card por solicitação externa');
    this.initializeCard();
  }

  updateControlCpf(dono) {

    if (!dono) {
      this.form.controls.documentoCartao.setValue('');
    } else {
      this.form.controls.documentoCartao.setValue(this.documentoDono);
    }


  }

  getCreditCardBrand(numero: string) {
    const bandeira = numero.slice(0, 6)

    this.loadingCartao = true;

    this.pagSeguro.carregarbandeiraCartao(bandeira, this.valorTotalDesconto).then((objBandeira: any) => {
      this.cartao.bandeira = objBandeira.bandeira;
      this.cartao.config = objBandeira.config;
      this.parcelas = [];

      this.parcelas = objBandeira.valor.map((e) => {
        return {
          label: e.quantidadeParcela + " x " + this.numeroToString(e.valorParcela) + " = " + this.numeroToString(e.totalFinal),
          value: e
        }
      });
      this.setParcelaInicial();
      this.loadingCartao = false;
    });

  }

  setParcelaInicial() {
    const primeiraParcela = this.parcelas[0] || { value: null };
    const desabilitarParcelamento = this.valorTotal > this.valorTotalDesconto;
    const valueAtual = this.form.controls.parcela.value || primeiraParcela.value;
    if (desabilitarParcelamento) {
      this.form.controls.parcela.patchValue(primeiraParcela.value);
      this.parcelas = [primeiraParcela];
      return;
    }
    if (valueAtual) {
      const novaParcelaAtual = this.parcelas.find(p => p.value.quantidadeParcela == valueAtual.quantidadeParcela);
      this.form.controls.parcela.patchValue(novaParcelaAtual.value);
      return;
    }
    this.form.controls.parcela.patchValue(null);
  }

  numeroToString(numero) {
    return "R$ " + numero.toFixed(2).replace(".", ",");
  }

  // Pipe para filtrar apenas números válidos no cartão de crédito
  creditCardPipe = (conformedValue: string, config: any) => {
    // Remove todos os caracteres não numéricos
    const numbersOnly = conformedValue.replace(/\D/g, '');
    
    // Limita a 16 dígitos
    const limitedNumbers = numbersOnly.substring(0, 16);
    
    // Aplica a máscara apenas se tiver números válidos
    if (limitedNumbers.length === 0) {
      return '';
    }
    
    // Formata com espaços a cada 4 dígitos
    let formatted = limitedNumbers;
    if (limitedNumbers.length > 4) {
      formatted = limitedNumbers.substring(0, 4) + ' ' + limitedNumbers.substring(4);
    }
    if (limitedNumbers.length > 8) {
      formatted = limitedNumbers.substring(0, 4) + ' ' + 
                  limitedNumbers.substring(4, 8) + ' ' + 
                  limitedNumbers.substring(8);
    }
    if (limitedNumbers.length > 12) {
      formatted = limitedNumbers.substring(0, 4) + ' ' + 
                  limitedNumbers.substring(4, 8) + ' ' + 
                  limitedNumbers.substring(8, 12) + ' ' + 
                  limitedNumbers.substring(12);
    }
    
    return formatted;
  }

}
