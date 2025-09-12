import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { CreditoComponent } from './credito.component';
import { PagSeguroService } from '../../../service/pagseguro.service';
import { LoginService } from '../../../service/login.service';
import { PessoaService } from '../../../service/pessoa.service';

class PagSeguroServiceStub {
  carregarbandeiraCartao() {
    return Promise.resolve({
      bandeira: 'visa',
      config: {},
      valor: [
        { quantidadeParcela: 1, valorParcela: 50, totalFinal: 50 },
        { quantidadeParcela: 2, valorParcela: 25, totalFinal: 50 }
      ]
    });
  }
}

class LoginServiceStub {
  getLogIn() {
    return of({ cliente: { documento: '12345678900', tipoPessoa: 'FISICA' } });
  }
}

class PessoaServiceStub {}

describe('CreditoComponent', () => {
  let component: CreditoComponent;
  let fixture: ComponentFixture<CreditoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreditoComponent],
      imports: [ReactiveFormsModule],
      providers: [
        UntypedFormBuilder,
        { provide: PagSeguroService, useClass: PagSeguroServiceStub },
        { provide: LoginService, useClass: LoginServiceStub },
        { provide: PessoaService, useClass: PessoaServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditoComponent);
    component = fixture.componentInstance;
    component.valorTotal = 100;
    component.valorTotalDesconto = 100;
  });

  it('should initialize and handle changes', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.documentoDono).toBe('12345678900');
    expect(component.form.controls.documentoCartao.value).toBe('12345678900');

    component.form.controls.donoCartao.setValue(false);
    expect(component.form.controls.documentoCartao.value).toBe('');

    component.form.controls.numero.setValue('12345678');
    tick(500);
    tick();
    expect(component.cartao.bandeira).toBe('visa');

    const spy = spyOn(component, 'getCreditCardBrand').and.callThrough();
    component.ngOnChanges();
    tick();
    expect(spy).toHaveBeenCalled();
  }));

  it('should handle ngOnChanges without form', fakeAsync(() => {
    component.ngOnInit();
    tick();
    component.form = null as any;
    const spy = spyOn(component, 'getCreditCardBrand');
    component.ngOnChanges();
    tick();
    expect(spy).not.toHaveBeenCalled();
  }));

  it('should set parcela inicial when parcelamento disabled', () => {
    component.parcelas = [
      { value: { quantidadeParcela: 1 } },
      { value: { quantidadeParcela: 2 } }
    ];
    component.valorTotal = 200;
    component.valorTotalDesconto = 100;
    component.setParcelaInicial();
    expect(component.parcelas.length).toBe(1);
    expect(component.form.controls.parcela.value).toEqual(component.parcelas[0].value);
  });

  it('should keep current parcela when present', () => {
    component.parcelas = [
      { value: { quantidadeParcela: 1 } },
      { value: { quantidadeParcela: 2 } }
    ];
    component.form.controls.parcela.setValue(component.parcelas[1].value);
    component.setParcelaInicial();
    expect(component.form.controls.parcela.value.quantidadeParcela).toBe(2);
  });

  it('should reset parcela when none selected', () => {
    component.parcelas = [];
    component.form.controls.parcela.setValue(null);
    component.setParcelaInicial();
    expect(component.form.controls.parcela.value).toBeNull();
  });

  it('should format number to string', () => {
    expect(component.numeroToString(10)).toBe('R$ 10,00');
  });
});
