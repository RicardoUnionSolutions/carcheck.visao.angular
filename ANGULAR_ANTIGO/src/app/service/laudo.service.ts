import { Injectable } from '@angular/core';
import { VariableGlobal } from './variable.global.service';
import { HttpClient } from '@angular/common/http';

type CidadeOption = { value:string, label:string, uf:string };
type UfOption = { value:string, label:string };

@Injectable({
  providedIn: 'root'
})
export class LaudoService {

  private ufOptions:UfOption[] = [
    { label: 'Espirito Santo', value: 'ES' },
    // { label: 'Distrito Federal', value: 'DF' },
    // { label: 'Goiás', value: 'GO' },
    { label: 'São Paulo', value: 'SP' }
  ];
  private cidadeOptions:CidadeOption[] = [
    // { uf:'DF', label: 'Brasília', value: 'brasilia' },
    { uf:'ES', label: 'Cariacica',  value: 'cariacica' },
    { uf:'ES', label: 'Vila Velha', value:  'vila_velha' },
    { uf:'ES', label: 'Vitória', value: 'vitoria' },
    { uf:'ES', label: 'Serra', value: 'serra' },
    // { uf:'GO', label: 'Goiania', value: 'goiania' },
    { uf:'SP', label: 'São Paulo e Região Metropolitana', value: 'sp_regiao_metropolitada' },
  ];

  constructor(private http: HttpClient, private variableGlobal: VariableGlobal) { }

  getLaudo(token) {
    const url = this.variableGlobal.getUrl('consultar/dadosLaudoVeiculo/'+ token);  
    return this.http.get<any>(url).toPromise();
  }

  getUfOptions() {
    return this.ufOptions;
  }

  getCidadeOptions(uf:string) {
    return this.cidadeOptions.filter(c => c.uf == uf);
  }

  getCidadeNome(value:string) {
    const cidade = this.cidadeOptions.find(c => c.value == value);
    return cidade ? cidade.label : '';
  }
}
