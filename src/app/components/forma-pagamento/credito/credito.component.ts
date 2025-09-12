import { Component, OnInit, Input } from '@angular/core';
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

@Component({
    selector: 'forma-pagamento-credito',
    templateUrl: './credito.component.html',
    styleUrls: ['./credito.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TextMaskDirective, CkSelectComponent, CkInputComponent]
})
export class CreditoComponent implements OnInit {

  @Input() valorTotal = 0;
  @Input() valorTotalDesconto = 0;
  parcelas: any[] = [];
  cpfControl: UntypedFormControl = new UntypedFormControl('', { validators: UtilValidators.cpf });
  formMask = {
    cvv: { mask: UtilMasks.cvv, guide: false },
    vencimento: { mask: UtilMasks.vencimentoCartao, guide: false },
    cpf: { mask: UtilMasks.cpf, guide: false },
    creditCard: { mask: UtilMasks.creditCard, guide: false }
  }

  form: UntypedFormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(35)]],
    numero: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
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

  messages: any;
  placeholders: any;
  masks: any;
  documentoDono: any;

  constructor(private loginService: LoginService, public pagSeguro: PagSeguroService, private fb: UntypedFormBuilder, pessoaService: PessoaService) { }

  ngOnInit() {
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

  ngOnChanges() {
    if (this.form) {
      this.getCreditCardBrand(this.form.controls.numero.value.replace(" ", ""));
    }
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

}
