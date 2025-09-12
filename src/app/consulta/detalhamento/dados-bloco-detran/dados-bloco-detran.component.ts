import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { CkSelectComponent } from '../../../components/ck-select/ck-select.component';

@Component({
    selector: 'dados-bloco-detran',
    templateUrl: './dados-bloco-detran.component.html',
    styleUrls: ['./dados-bloco-detran.component.scss'],
    standalone: true,
    imports: [CommonModule, CkSelectComponent]
})
export class DadosBlocoDetranComponent implements OnInit {

  listaEstados:any;

  @Input() dadosVeiculo: any;
  indiceEstadoInicial = 25;
  estados: any[] = [];

  select: UntypedFormControl;

  constructor() {

    this.listaEstados = [
      {
        label: 'Acre',
        value: {
          ID: '1',
          Sigla: 'AC',
          Nome: 'Acre',
          url: 'http://www.detran.ac.gov.br/'
        }
      },
      {
        label: 'Alagoas',
        value: {
          ID: '2',
          Sigla: 'AL',
          Nome: 'Alagoas',
          url: 'https://www.detran.al.gov.br/veiculos/consulta-veiculo/menu_lateral'
        }
      },
      {
        label: 'Amazonas',
        value: {
          ID: '3',
          Sigla: 'AM',
          Nome: 'Amazonas',
          url: 'http://www.detran.am.gov.br'
        }
      },
      {
        label: 'Amapá',
        value: {
          ID: '4',
          Sigla: 'AP',
          Nome: 'Amapá',
          url: 'http://www.detran.ap.gov.br/detranap/veiculo/consulta-de-veiculos/'
        }
      },
      {
        label: 'Bahia',
        value: {
          ID: '5',
          Sigla: 'BA',
          Nome: 'Bahia',
          url: 'http://www.detran.ba.gov.br/servicos/veiculos/situacao-de-veiculos'
        }
      },
      {
        label: 'Ceará',
        value: {
          ID: '6',
          Sigla: 'CE',
          Nome: 'Ceará',
          url: 'http://central.detran.ce.gov.br/veiculos/consulta_completa'
        }
      },
      {
        label: 'Distrito Federal',
        value: {
          ID: '7',
          Sigla: 'DF',
          Nome: 'Distrito Federal',
          url: 'http://www.detran.df.gov.br/consultar-veiculo.html'
        }
      },
      {
        label: 'Espírito Santo',
        value: {
          ID: '8',
          Sigla: 'ES',
          Nome: 'Espírito Santo',
          url: 'https://publicodetran.es.gov.br/NovoConsultaVeiculoES.asp'
        }
      },
      {
        label: 'Goiás',
        value: {
          ID: '9',
          Sigla: 'GO',
          Nome: 'Goiás',
          url: 'https://www.detran.go.gov.br'
        }
      },
      {
        label: 'Maranhão',
        value: {
          ID: '10',
          Sigla: 'MA',
          Nome: 'Maranhão',
          url: 'http://www.detran.ma.gov.br'
        }
      },
      {
        label: 'Minas Gerais',
        value: {
          ID: '11',
          Sigla: 'MG',
          Nome: 'Minas Gerais',
          url: 'https://www.detran.mg.gov.br/veiculos/situacao-do-veiculo/consulta-a-situacao-do-veiculo'
        }
      },
      {
        label: 'Mato Grosso do Sul',
        value: {
          ID: '12',
          Sigla: 'MS',
          Nome: 'Mato Grosso do Sul',
          url: 'http://www.detran.ms.gov.br/consulta-de-debitos/'
        }
      },
      {
        label: 'Mato Grosso',
        value: {
          ID: '13',
          Sigla: 'MT',
          Nome: 'Mato Grosso',
          url: 'https://www.detran.mt.gov.br/'
        }
      },
      {
        label: 'Pará',
        value: {
          ID: '14',
          Sigla: 'PA',
          Nome: 'Pará',
          url: 'http://www.detran.pa.gov.br/sistransito/detran-web/servicos/veiculos/indexRenavam.jsf'
        }
      },
      {
        label: 'Paraíba',
        value: {
          ID: '15',
          Sigla: 'PB',
          Nome: 'Paraíba',
          url: 'http://www.detran.pb.gov.br/index.php/consultar-veiculo.html'
        }
      },
      {
        label: 'Pernambuco',
        value: {
          ID: '16',
          Sigla: 'PE',
          Nome: 'Pernambuco',
          url: 'http://www.detran.pe.gov.br'
        }
      },
      {
        label: 'Piauí',
        value: {
          ID: '17',
          Sigla: 'PI',
          Nome: 'Piauí',
          url: 'http://taxas.detran.pi.gov.br/multa/index.jsf'
        }
      },
      {
        label: 'Paraná',
        value: {
          ID: '18',
          Sigla: 'PR',
          Nome: 'Paraná',
          url: 'http://www.extratodebito.detran.pr.gov.br/detranextratos/geraExtrato.do?action=iniciarProcesso'
        }
      },
      {
        label: 'Rio de Janeiro',
        value: {
          ID: '19',
          Sigla: 'RJ',
          Nome: 'Rio de Janeiro',
          url: 'http://www.detran.rj.gov.br/'
        }
      },
      {
        label: 'Rio Grande do Norte',
        value: {
          ID: '20',
          Sigla: 'RN',
          Nome: 'Rio Grande do Norte',
          url: 'http://www2.detran.rn.gov.br/externo/consultarveiculo.asp'
        }
      },
      {
        label: 'Rondônia',
        value: {
          ID: '21',
          Sigla: 'RO',
          Nome: 'Rondônia',
          url: 'http://www.detran.ro.gov.br/'
        }
      },
      {
        label: 'Roraima',
        value: {
          ID: '22',
          Sigla: 'RR',
          Nome: 'Roraima',
          url: 'https://consulta.detran.ro.gov.br/CentralDeConsultasInternet/Software/ViewConsultaVeiculos.aspx'
        }
      },
      {
        label: 'Rio Grande do Sul',
        value: {
          ID: '23',
          Sigla: 'RS',
          Nome: 'Rio Grande do Sul',
          url: 'http://www.detran.rs.gov.br/consulta-veiculos'
        }
      },
      {
        label: 'Santa Catarina',
        value: {
          ID: '24',
          Sigla: 'SC',
          Nome: 'Santa Catarina',
          url: 'http://www.detran.sc.gov.br/'
        }
      },
      {
        label: 'Sergipe',
        value: {
          ID: '25',
          Sigla: 'SE',
          Nome: 'Sergipe',
          url: 'https://seguro.detran.se.gov.br/portal/?pg=cons_veiculo'
        }
      },
      {
        label: 'São Paulo',
        value: {
          ID: '26',
          Sigla: 'SP',
          Nome: 'São Paulo',
          url: 'https://www.detran.sp.gov.br/wps/portal/portaldetran/detran/atendimento/servicos%20online/debitos%20e%20restricoes/'
        }
      },
      {
        label: 'Tocantins',
        value: {
          ID: '27',
          Sigla: 'TO',
          Nome: 'Tocantins',
          url: 'https://detran.to.gov.br/'
        }
      }];
  }

  paginaDetran(){
    window.open(this.select.value.url);
  }


  ngOnInit() {

    this.select = new UntypedFormControl();

    //myArray.map(function(e) { return e.hello; }).indexOf('stevie');


    let estado ="";
    //console.log("this.dados.veiculo = ",this.dadosVeiculo)
    if(this.dadosVeiculo.veiculo != null && this.dadosVeiculo.veiculo.uf){
      estado = this.dadosVeiculo.veiculo.uf;
      this.indiceEstadoInicial = this.listaEstados.map(function(e)  { return e.value.Sigla; }).indexOf(estado);
    }

    //console.log("O valor de estado é =",this.listaEstados[this.listaEstados.map(function(e)  { return e.value.Sigla; }).indexOf(estado)].value.Sigla);

    this.select.valueChanges.subscribe((v)=>{
//      console.log('select value:', v);
    });

  }

}
