import { FormControl } from '@angular/forms';

export class UtilValidators {

    private constructor() { }




    static nomeCompleto(formControl: FormControl) {

        let nome = formControl.value.trim();
       
        if (nome.split(" ").length < 2) {
            return { nome: true };
        }
        return null;
    }


    static equalValidator(otherControlName: string, caseSensitive: boolean = true) {

        let thisControl: FormControl;
        let otherControl: FormControl;

        return function matchOtherValidate(control: FormControl) {

            if (!control.parent) {
                return null;
            }

            if (!thisControl) {
                thisControl = control;
                otherControl = control.parent.get(otherControlName) as FormControl;
                if (!otherControl) {
                    throw new Error('matchOtherValidator(): other control is not found in parent group');
                }
                otherControl.valueChanges.subscribe(() => {
                    thisControl.updateValueAndValidity();
                });
            }

            if (!otherControl) {
                return null;
            }

            if (caseSensitive) {
                if (otherControl.value !== thisControl.value) {
                    return { equal: true };
                }
            } else {
                if (otherControl.value.toLowerCase() !== thisControl.value.toLowerCase()) {
                    return { equal: true };
                }
            }

            return null;
        }
    }


    static cpf(c: FormControl) {
        let cpf = c.value || '';
        cpf = cpf.replace(/[^0-9]/g, '');

        let add, rev, i;
        if (cpf.length !== 11 || cpf == '00000000000' || cpf == '11111111111' || cpf == '22222222222' || cpf == '33333333333' ||
            cpf == '44444444444' || cpf == '55555555555' || cpf == '66666666666' || cpf == '77777777777' || cpf == '88888888888' ||
            cpf == '99999999999') {
            return { cpf: true };
        }
        add = 0;
        for (i = 0; i < 9; i++) {
            add += parseInt(cpf.charAt(i)) * (10 - i);
        }
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11) {
            rev = 0;
        }
        if (rev != parseInt(cpf.charAt(9))) {
            return { cpf: true };
        }
        add = 0;
        for (i = 0; i < 10; i++) {
            add += parseInt(cpf.charAt(i)) * (11 - i);
        }
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11) {
            rev = 0;
        }
        if (rev != parseInt(cpf.charAt(10))) {
            return { cpf: true };
        }
        return null;
    }

    static cnpj(c: FormControl) {

        let cnpj = c.value || '';
        cnpj = cnpj.replace(/[^0-9]/g, '');
        //cnpj = cnpj.replace(/[^\d]+/g,'');

        if (cnpj == '') return { cnpj: true };

        if (cnpj.length != 14) return { cnpj: true };

        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999")
            return { cnpj: true };

        // Valida DVs
        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return { cnpj: true };

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return { cnpj: true };

        return null;
    }


}