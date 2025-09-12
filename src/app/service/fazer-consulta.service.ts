import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { VariableGlobal } from "./variable.global.service";
import { TokenService } from "./token.service";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class FazerConsultaService {
  constructor(
    private http: HttpClient,
    private variableGlobal: VariableGlobal,
    private tokenService: TokenService
  ) {}

  consultar(dados: any): Observable<any> {
    return this.http.post(
      this.variableGlobal.getUrl("consultar/pegarDadosVeiculo"),
      { parametro: dados }
    );
  }

  realizarConsulta(dados: any): Observable<any> {
    return this.http.post(
      this.variableGlobal.getUrl("consultar/realizarConsultaCompany"),
      dados
    );
  }

  credConsulta(dados: any): Observable<any> {
    return this.http.post(
      this.variableGlobal.getUrl("consultar/credConsulta"),
      { parametro: dados }
    );
  }

  getConsultaCliente(email: any): Observable<any> {
    return this.http.get(
      this.variableGlobal.getUrl(
        "consultar/pegarConsultaCliente?email=" + email
      )
    );
  }

  getPacotes(): Observable<any> {
    return this.http
      .get(this.variableGlobal.getUrl("consultar/getPacotes"))
      .pipe(
        catchError(() => {
          // Dados mock quando a conexão falhar
          const pacotesMock = [
            {
              id: 1,
              composta_id: 3,
              quantidade_composta: 10,
              nome_do_pacote: "Pacote 10 <br> Completa",
              descricao_do_pacote:
                "Obtenha 10 <strong>Consultas completa</strong> com 15% de desconto",
              porcentagem_desconto: 15,
              recomendada: true,
              ativo: true,
            },
            {
              id: 2,
              composta_id: 5,
              quantidade_composta: 10,
              nome_do_pacote: "Pacote 10 <br> Segura",
              descricao_do_pacote:
                "Obtenha 10 <strong>Consultas segura</strong> <br> com 10% de desconto",
              porcentagem_desconto: 10,
              recomendada: false,
              ativo: true,
            },
            {
              id: 3,
              composta_id: 2,
              quantidade_composta: 15,
              nome_do_pacote: "Pacote 15 <br> Leilão",
              descricao_do_pacote:
                "Obtenha 15 <strong>Consultas leilão</strong> <br> com 5% de desconto",
              porcentagem_desconto: 5,
              recomendada: false,
              ativo: true,
            },
          ];
          return of(pacotesMock);
        })
      );
  }
}
