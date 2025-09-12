import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VariableGlobal }    from './variable.global.service';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusPagamentoService {

  constructor(private http: HttpClient, private variableGlobal: VariableGlobal, private tokenService: TokenService) { }

  carregarLista(pesquisa: any): Observable<any> {
    return this.http.post( this.variableGlobal.getUrl("pagamento/lista"), pesquisa );
  }

}


