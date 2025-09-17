import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VariableGlobal } from './variable.global.service';

@Injectable()
export class PagarDebitosService {



  constructor(private http: HttpClient, private variableGlobal: VariableGlobal) { }


  consultarDebitos(dados: any): Observable<any> {
    return this.http.post(
      this.variableGlobal.getUrl("pinpag/consultarDebitos"), dados)
  }

  buscarPeloConsultaId(consultaId: any) {
    return this.http.get(this.variableGlobal.getUrl("pinpag/buscarConsulta/" + consultaId))
  }

  gerarLinkPagamento(dados: any): Observable<any> {
    return this.http.post(
      this.variableGlobal.getUrl("pinpag/gerarLinkPagamento"), dados)
  }

  buscarRetorno(consultId: string): Observable<any> {
    return this.http.get(this.variableGlobal.getUrl("pinpag/buscarRetorno/" + consultId))
  }
}
