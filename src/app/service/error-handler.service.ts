import { Injectable } from '@angular/core';

@Injectable()
export class ErrorHandlerService {

  constructor() { }

  handle(errorResponse : any){
    let msg: string;
    
    if(typeof errorResponse === 'string'){
      msg = errorResponse;
    }else{
      msg = 'Erro ao processar serviço. Tente novamente';
      console.log('Ocorreu um erro', errorResponse);
    }
    console.log(msg);
  }

}