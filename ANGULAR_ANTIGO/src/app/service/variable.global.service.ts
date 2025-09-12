import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class VariableGlobal {

  private carregouScriptPagSeguro: boolean = false;
  private http: HttpClient;

  // public urlSistema:string = "http://localhost:8080/CarcheckWebservice";
  //private urlSistema:string = "http://homologacaows.carcheck.com.br:80/CarcheckWebservice";

  constructor() { }

  getUrl(url: String = '') {
    const base = environment.wsUrl;
    return url[0] == "/" ? base + url : base + "/" + url;
  }

  setStatusScript(carregouScriptPagSeguro: boolean) {
    this.carregouScriptPagSeguro = carregouScriptPagSeguro;
  }

  getStatusScript() {
    return this.carregouScriptPagSeguro;
  }

  getUrlSite() {
    let url = '//carcheckbrasil.com.br';
    //let url = '//192.168.0.87';
    return {
      home: url,
      duvidasFrequentes: url + '/duvidas-frequentes/',
    };
  }

  getProdutos() {
    var consultas = [
      {
        id: 3,
        nome_da_consulta: "Consulta Veicular Completa",
        slug: "completa",
        descricao_da_consulta: "Os dados mais completos para você",
        valor_atual: 69.90,
        valor_promocional: 54.90,
        imagem: "./assets/images/lading-page/a23ae0fb-afdd-412c-b9f0-19b887ff5169a8.jpeg",
        recomendada: true,
        exemplo: "https://carcheckbrasil.com.br/visualizar-consulta/823d09ce-a895-4dca-921e-484c1dd8c5de-exemplo",
        lista_de_insumos: [
          "Dados estaduais",
          "Dados nacionais",
          "Debitos e Multas",
          "Detalhes Renajud",
          "Restrições e Impedimentos Legais",
          "Dados originais",
          "Histórico de leilão",
          "Score aceitação de seguro",
          "Indício de sinistro (batidas ou colisões)",
          "Valor na tabela Fipe",
          "Desvalorização média",
          "Verificador de chassi",
          "Modelo cadastrado na montadora",
          "Recall do modelo",
          "Comunicação de venda",
          "Gravame",
          "Risco de comercialização mercado (%)",
          "Duplicidade de motor",
          "Percentual do valor do veículo leiloado na revenda",
          "Probabilidade da necessidade de vistoria física (%)",
          "Análise do estado do veículo no leilão (%)",
          "Gráficos de análise de risco",
          "Remarketing Veicular (leilão remarketing)",
          "Detalhamento de veículo em remarketing veicular (leilão remarketing)"
        ],
        lista_de_insumos_negados: []
      },
      {
        id: 5,
        nome_da_consulta: "Consulta Veicular Segura",
        slug: "segura",
        descricao_da_consulta: "Os principais dados para a decisão de compra",
        valor_atual: 61.90,
        valor_promocional: 48.90,
        imagem: "./assets/images/lading-page/8853dfdd-1dac-402e-b6a0-ccbcd6e32e85.jpeg",
        recomendada: false,
        exemplo: "https://carcheckbrasil.com.br/visualizar-consulta/be5bab35-7833-4684-8de6-fe007f645b53-exemplo",
        lista_de_insumos: [
          "Dados originais",
          "Histórico de leilão",
          "Score aceitação de seguro",
          "Indício de sinistro (batidas ou colisões)",
          "Verificador de chassi",
          "Risco de comercialização mercado (%)",
          "Percentual do valor do veículo leiloado na revenda",
          "Probabilidade da necessidade de vistoria física (%)",
          "Análise do estado do veículo no leilão (%)",
          "Gráficos de análise de risco",
          "Remarketing Veicular (leilão remarketing)",
          "Detalhamento de veículo em remarketing veicular (leilão remarketing)"
        ],
        lista_de_insumos_negados: []
      },
      {
        id: 2,
        nome_da_consulta: "Consulta Veicular Leilão",
        slug: "leilao",
        descricao_da_consulta: "Fuja de carros leiloados",
        valor_atual: 41.90,
        valor_promocional: 32.90,
        imagem: "./assets/images/lading-page/a23ae0fb-afdd-412c-b9f0-20b472be09e5.jpeg",
        recomendada: false,
        exemplo: "https://carcheckbrasil.com.br/visualizar-consulta/ab7a87f6-9916-45ca-bd66-5aec8b356e7a-exemplo",
        lista_de_insumos: [
          "Dados originais",
          "Histórico de leilão",
          "Valor na tabela Fipe"
        ],
        lista_de_insumos_negados: []
      }
    ];
    return consultas
  }

  // getPacotes() : Observable<any>  {
  //   return this.http.get(this.getUrl("consultar/getPacotes"));


    // var pacotes = [
    //   {
    //     id: 1,
    //     composta_id: 3,
    //     quantidade_composta: 10,
    //     nome_do_pacote: "Pacote 10 <br> Completa",
    //     descricao_do_pacote: "Obtenha 10 <strong>Consultas completa</strong> com 15% de desconto",
    //     porcentagem_desconto: 15,
    //     recomendada: true,
    //     ativo: true
    //   },
    //   {
    //     id: 2,
    //     composta_id: 5,
    //     quantidade_composta: 10,
    //     nome_do_pacote: "Pacote 10 <br> Segura",
    //     descricao_do_pacote: "Obtenha 10 <strong>Consultas segura</strong> <br> com 10% de desconto",
    //     porcentagem_desconto: 10,
    //     recomendada: false,
    //     ativo: true
    //   },
    //   {
    //     id: 3,
    //     composta_id: 2,
    //     quantidade_composta: 15,
    //     nome_do_pacote: "Pacote 15 <br> Leilão",
    //     descricao_do_pacote: "Obtenha 15 <strong>Consultas leilão</strong> <br> com 5% de desconto",
    //     porcentagem_desconto: 5,
    //     recomendada: false,
    //     ativo: true
    //   },
    //   {
    //     id: 4,
    //     composta_id: 2,
    //     quantidade_composta: 2,
    //     nome_do_pacote: "Pacote 2 <br> Leilão",
    //     descricao_do_pacote: "Obtenha 2 <strong>Consulta leilão</strong> <br> com 2% de desconto",
    //     porcentagem_desconto: 2,
    //     recomendada: false,
    //     ativo: false
    //   },
    // ];

    // return pacotes
  // }

}
