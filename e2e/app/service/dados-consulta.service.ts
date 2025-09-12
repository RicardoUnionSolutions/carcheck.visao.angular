import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DadosConsultaService {
  private dados: any = {};

  constructor() {}

  setDados(dados: any): void {
    this.dados = dados;
  }

  getDados(): any {
    return this.dados;
  }

  clearDados(): void {
    this.dados = {};
  }
}
