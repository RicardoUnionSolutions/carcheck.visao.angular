import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {VariableGlobal} from './variable.global.service';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FazerConsultaService {


  constructor(private http: HttpClient, private variableGlobal: VariableGlobal, private tokenService: TokenService) { }

  consultar(dados : any): Observable<any>{
    return this.http.post(
      this.variableGlobal.getUrl("consultar/pegarDadosVeiculo"),{parametro: dados})
  }

  realizarConsulta(dados : any): Observable<any>{
    return this.http.post(
      this.variableGlobal.getUrl("consultar/realizarConsultaCompany"), dados )
  }

  credConsulta(dados : any): Observable<any>{
    return this.http.post(
      this.variableGlobal.getUrl("consultar/credConsulta"),{parametro: dados})
  }

  getConsultaCliente(email : any): Observable<any>{
    return this.http.get(this.variableGlobal.getUrl("consultar/pegarConsultaCliente?email="+email))
  }

  getPacotes() : Observable<any>  {
    return this.http.get(this.variableGlobal.getUrl("consultar/getPacotes"));
  }
}
