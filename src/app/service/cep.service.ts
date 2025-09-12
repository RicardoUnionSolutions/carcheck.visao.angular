import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(private http: HttpClient) { }

  search(cep):Promise<any>{
    cep = cep.replace(/\D/g,'');
    return this.http.get('https://viacep.com.br/ws/' + cep + '/json/').toPromise();
  }

}
