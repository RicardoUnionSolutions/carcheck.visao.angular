export class UtilMasks {

  constructor() { }

  static cpf = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];

  static cnpj = [ /\d/, /\d/, '.',  /\d/,  /\d/,  /\d/, '.',  /\d/,  /\d/,  /\d/, '/',  /\d/,  /\d/,  /\d/,  /\d/, '-',  /\d/, /\d/];

  static cep = [/[0-9]/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

  static placa = [/[A-Za-z]/,/[A-Za-z]/,/[A-Za-z]/, /\d/,/[A-Za-z0-9]/,/\d/,/\d/ ];

  static dataBr = [/\d/,/\d/,'/',/\d/,/\d/,'/',/\d/,/\d/,/\d/,/\d/];

  static cvv = [/\d/,/\d/,/\d/,/\d/];

  static vencimentoCartao = [/[0-1]/,/[0-9]/,'/',/[1-9]/,/[0-9]/];

  static creditCard = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];

  /*static placa(userInput) {
    let isInteger = /[0-9]/;
    console.log(userInput.length>3, isInteger.test(userInput[4]));
    if(userInput.length>3 && isInteger.test(userInput[4])){
      return [/[A-z]/,/[A-z]/,/[A-z]/, /\d/,/\d/,/[A-z]/,/\d/];
    } else {
      return [/[A-z]/,/[A-z]/,/[A-z]/, /\d/,/[A-z]/,/\d/,/\d/];
    }
  }*/


  static tel(userInput) {
    let numbers = userInput.match(/\d/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join("").length;
    }

    if (numberLength > 10) {
      return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    } else {
      return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    }
  }

}
