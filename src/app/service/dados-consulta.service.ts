import { Injectable } from '@angular/core';
import { VariableGlobal } from './variable.global.service';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class dadosConsultaService {

  constructor(private http: HttpClient, private variableGlobal: VariableGlobal, private tokenService: TokenService) { }

  getConsultaVeiculo(uuid: any): Observable<any> {
    return this.http.get(this.variableGlobal.getUrl("consultar/dadosConsultaVeiculo/" + uuid));
  }

  getConsultaVeiculoCompany(uuid: any): Promise<any> {
    return this.http.get(this.variableGlobal.getUrl("consultar/dadosConsultaVeiculoCompany/" + uuid)).toPromise();
  }

  getConsultaTimeLine(uuid: any): Observable<any> {
    return this.http.get(this.variableGlobal.getUrl("consultar/consultaTimeLine/" + uuid));
  }

  getHistoricoConsulta(filtros: any): Observable<any> {
    return this.http.post(this.variableGlobal.getUrl("consultar/historicoConsulta"), filtros);
  }

  getHistoricoGeralConsulta(filtros: any): Observable<any> {
    return this.http.post(this.variableGlobal.getUrl("consultar/historicoGeralConsulta"), filtros);
  }

  getRecarregarConsultaInterna(idConsultaInterna): Observable<any> {
    return this.http.get(this.variableGlobal.getUrl("consultar/recarregarConsultaInterna/" + idConsultaInterna))
  }

  getRecarregarConsultaDenatran(idConsultaInterna, placa, renavan, documento): Observable<any> {
    const params = { placa: placa, renavan: renavan, documento: documento };
    return this.http.post(this.variableGlobal.getUrl("consultar/recarregarConsultaDenatran/" + idConsultaInterna), params)
  }

  getRecarregarConsulta(idConsultaVeiculo): Promise<any> {
    return this.http.get(this.variableGlobal.getUrl("consultar/recarregarConsultaCompany/" + idConsultaVeiculo)).toPromise();
  }

  getRecarregarConsultaListaPendente(idConsultaVeiculo): Promise<any> {
    return this.http.get(this.variableGlobal.getUrl("consultar/recarregarConsultaListaPendente/" + idConsultaVeiculo)).toPromise();
  }

  getCreditoConsulta(): Observable<any> {
    return this.http.get(this.variableGlobal.getUrl("consultar/creditoConsulta"))
  }

  getDadosTimeLine(email: any): Observable<any> {
    return this.http.get(this.variableGlobal.getUrl("consultar/timeLine?email=" + email))
  }

  feedback(status, msg): Observable<any> {
    const params = { status: status, msg: msg };
    return this.http.post(this.variableGlobal.getUrl("consultar/feedback"), params)
  }

  downloadPdf(token): Observable<any> {
    const params = { token: token };
    return this.http.post(this.variableGlobal.getUrl('consultar/relatorioConsultaPdf'), params, { responseType: "arraybuffer" });
  }

  getPossuiCompraAprovada(): Observable<any> {
    return this.http.get(this.variableGlobal.getUrl("consultar/possuiCompra"));
  }

}
