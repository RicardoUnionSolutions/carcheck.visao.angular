import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { UtilValidators } from './util-validators';

describe('UtilValidators', () => {
  it('should validate full name', () => {
    const control = new UntypedFormControl('Nome');
    expect(UtilValidators.nomeCompleto(control)).toEqual({ nome: true });
    control.setValue('Nome Completo');
    expect(UtilValidators.nomeCompleto(control)).toBeNull();
  });

  it('should validate equal fields', () => {
    const form = new UntypedFormGroup({
      senha: new UntypedFormControl('1234'),
      confirmar: new UntypedFormControl('4321')
    });
    form.controls.confirmar.setValidators(UtilValidators.equalValidator('senha'));
    form.controls.confirmar.updateValueAndValidity();
    expect(form.controls.confirmar.errors).toEqual({ equal: true });
    form.controls.senha.setValue('abcd');
    form.controls.confirmar.setValue('abcd');
    form.controls.confirmar.updateValueAndValidity();
    expect(form.controls.confirmar.errors).toBeNull();
  });

  it('should validate equal fields case insensitive', () => {
    const form = new UntypedFormGroup({
      senha: new UntypedFormControl('ABC'),
      confirmar: new UntypedFormControl('abc')
    });
    form.controls.confirmar.setValidators(UtilValidators.equalValidator('senha', false));
    form.controls.confirmar.updateValueAndValidity();
    expect(form.controls.confirmar.errors).toBeNull();
    form.controls.confirmar.setValue('abcd');
    form.controls.confirmar.updateValueAndValidity();
    expect(form.controls.confirmar.errors).toEqual({ equal: true });
  });

  it('should return null when control has no parent', () => {
    const validator = UtilValidators.equalValidator('senha');
    const control = new UntypedFormControl('valor');
    expect(validator(control)).toBeNull();
  });

  it('should throw error when other control not found', () => {
    const form = new UntypedFormGroup({
      senha: new UntypedFormControl('1234'),
      confirmar: new UntypedFormControl('1234')
    });
    const validator = UtilValidators.equalValidator('naoExiste');
    expect(() => {
      form.controls.confirmar.setValidators(validator);
      form.controls.confirmar.updateValueAndValidity();
    }).toThrowError('matchOtherValidator(): other control is not found in parent group');
  });

  it('should return null when other control is removed', () => {
    const form = new UntypedFormGroup({
      senha: new UntypedFormControl('1234'),
      confirmar: new UntypedFormControl('1234')
    });
    form.controls.confirmar.setValidators(UtilValidators.equalValidator('senha'));
    form.controls.confirmar.updateValueAndValidity();
    form.removeControl('senha');
    form.controls.confirmar.updateValueAndValidity();
    expect(form.controls.confirmar.errors).toBeNull();
  });

  it('should validate CPF correctly', () => {
    const control = new UntypedFormControl('52998224725');
    expect(UtilValidators.cpf(control)).toBeNull();
    control.setValue('123');
    expect(UtilValidators.cpf(control)).toEqual({ cpf: true });
    control.setValue('52998224735');
    expect(UtilValidators.cpf(control)).toEqual({ cpf: true });
    control.setValue('52998224726');
    expect(UtilValidators.cpf(control)).toEqual({ cpf: true });
  });

  it('should validate CNPJ correctly', () => {
    const control = new UntypedFormControl('11444777000161');
    expect(UtilValidators.cnpj(control)).toBeNull();
    control.setValue('');
    expect(UtilValidators.cnpj(control)).toEqual({ cnpj: true });
    control.setValue('123');
    expect(UtilValidators.cnpj(control)).toEqual({ cnpj: true });
    control.setValue('00000000000000');
    expect(UtilValidators.cnpj(control)).toEqual({ cnpj: true });
    control.setValue('11444777000171');
    expect(UtilValidators.cnpj(control)).toEqual({ cnpj: true });
    control.setValue('11444777000162');
    expect(UtilValidators.cnpj(control)).toEqual({ cnpj: true });
  });
});

