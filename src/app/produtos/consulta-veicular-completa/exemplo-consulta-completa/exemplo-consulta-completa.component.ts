import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-exemplo-consulta-completa',
    templateUrl: './exemplo-consulta-completa.component.html',
    styleUrls: ['./exemplo-consulta-completa.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class ExemploConsultaCompletaComponent implements OnInit {

  constructor() { }

  isMobile: boolean = false;

  path: string = 'img-consultas-exemplo'
  s3Carcheckbrasil: string = 'https://carcheckbrasil.s3.us-east-1.amazonaws.com'
  consultas: { img: string, descricao: string, open: boolean }[] = [];

  ngOnInit() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.path = 'img-consultas-exemplo-mobile'
    }

    this.consultas = [
      {
        img: `${this.s3Carcheckbrasil}/img-consultas-exemplo/resumo-completa.png`,
        descricao: ``, open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/dados-originais.png`,
        descricao: `<p>Os dados de fabricação do veículo incluem informações essenciais como placa, marca, modelo, chassi, motor, ano de fabricação e cor. </p>
<p>Esses dados são fundamentais para a identificação do veículo e devem corresponder ao que está registrado no Certificado de Registro do Veículo (CRV). </p>
<p>É crucial verificar se todas as informações estão corretas, pois qualquer inconsistência pode indicar irregularidades ou fraudes. Esteja atento(a) a esses detalhes para garantir a autenticidade do seu veículo. </p>
<p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD), estamos comprometidos em proteger a privacidade e a segurança das informações pessoais. </p>
<p>Vale ressaltar que a divulgação de dados como chassi, Renavam, número do motor, documentos e nomes de proprietários é proibida por lei. </p>
<p>Essa base não retorna as restrições dos veículos. </p>
`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/dados-nacionais.png`,
        descricao: `<p>Os dados cadastrais nacionais são informações registradas na Senatran (Secretaria Nacional de Trânsito) e no CRV (Certificado de Registro do Veículo). Esses dados, fornecidos pela fabricante, revelam as características originais e os números de identificação do veículo. </p>
<p>Validar essas informações é crucial, pois ajuda a garantir que o documento apresentado pelo vendedor seja autêntico, evitando a compra de veículos clonados. </p>
<p>As restrições nacionais, também registradas na Senatran, nem sempre representam um problema, mas em alguns casos podem impedir a transferência do veículo para o seu nome e gerar complicações judiciais. Portanto, fique atento(a)! </p>
<p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD), estamos comprometidos em proteger a privacidade e a segurança das informações pessoais. </p>
<p>Vale lembrar que a divulgação de dados como chassi, Renavam, número do motor, documentos e nomes de proprietários é proibida por lei. </p>`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/rf.png`,
        descricao: `<p>Se o veículo tem ocorrência de roubo ou furto, isso indica que ele foi roubado e ainda não foi recuperado pelo proprietário. </p>
<p>Por outro lado, se não há ocorrência atual, mas existe um histórico de roubo ou furto, significa que o veículo foi roubado no passado, mas já foi devolvido. </p>
`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/verificacao-chassi.png`,
        descricao: `<p>O número do chassi é interpretado de acordo com o padrão estabelecido pela fabricante ou montadora. Essa padronização ajuda a evitar erros de digitação, além de garantir a correta classificação do modelo, marca e ano do veículo. Também possibilita verificar a existência do chassi e identificar possíveis indícios de adulteração. </p>`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/dados-estaduais.png`,
        descricao: ` <p>Os dados cadastrais estaduais são informações registradas no Detran (Departamento Estadual de Trânsito) e no CRLV (Certificado de Registro e Licenciamento do Veículo). Além dos dados de registro, esses registros fornecem a situação atual do veículo e qualquer alteração feita ao longo do tempo, como troca de motor, remarcação de chassi ou mudança de cor. </p>
<p>É essencial verificar se alterações como a troca de motor e a remarcação de chassi foram realizadas com a autorização do Detran e estão regularizadas. Isso ajuda a evitar multas e até a apreensão do veículo. </p>
<p>Em conformidade com a Lei Geral de Proteção de Dados (LGPD), estamos comprometidos em proteger a privacidade e a segurança das informações pessoais. </p>
<p>Vale ressaltar que a divulgação de dados como chassi, Renavam, número do motor, documentos e nomes de proprietários é proibida por lei. </p>
`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/debitos-multas.png`,
        descricao: `<p>São valores pendentes que o proprietário deve pagar ao Detran. Esses débitos podem incluir taxas não pagas, vencidas ou em aberto, impostos de veículos, taxas de licenciamento e outros encargos relacionados à posse e uso do veículo. Atenção: Existem débitos que o Detran não insere em seus próprios registros e que são disponíveis apenas através de outros órgãos, como a Secretaria da Fazenda (Sefaz) do estado. Esses débitos podem não aparecer nas consultas. </p>`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/restricoes.png`,
        descricao: `<p>As restrições estaduais são registradas no Detran (Departamento Estadual de Trânsito). </p>
<p>Embora nem sempre sejam motivo de preocupação, em alguns casos, elas podem impedir a transferência do veículo para o seu nome e gerar complicações judiciais. Por isso, é importante ficar atento(a)! </p>
`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/duplicidade-motor.png`,
        descricao: `<p>O alerta sobre a duplicidade de motor não significa necessariamente uma restrição, como mencionado na consulta. No passado, algumas montadoras cadastravam veículos antigos na base nacional sem inserir o número completo do motor, muitas vezes incluindo apenas parte dele. Isso é bastante comum e pode resultar em alertas de duplicidade. O importante é verificar se o número do motor que consta no documento do veículo é o mesmo que está fisicamente no veículo. Se ambos forem iguais, não há motivo para preocupação. </p>`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/gravame.png`,
        descricao: `<p>Aqui, você pode verificar o status de financiamento do veículo. </p>
<p>Essa informação é crucial, pois, se o veículo tiver um gravame ativo, a transferência para o seu nome não poderá ser feita sem a autorização do banco ou da instituição financeira responsável pelo contrato de financiamento. </p>
`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/comunicado-venda.png`,
        descricao: `<p>Um veículo que possui uma Comunicação de Venda é aquele em que o proprietário anterior informou ao DETRAN sobre a transferência de propriedade para um novo proprietário. Esse processo atualiza os registros do veículo e transfere a responsabilidade legal para o novo proprietário. </p>`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/recall.png`,
        descricao: `<p>Recall é um termo utilizado na indústria automobilística para descrever um procedimento no qual o fabricante convoca os proprietários para que determinado modelo de veículo/lote lhe seja levado de volta para reparo de possíveis ou reais defeitos. </p>`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/indicio.png`,
        descricao: `<p>Um sinistro é definido como qualquer ocorrência que cause danos ou prejuízos ao proprietário de um bem segurado. Um exemplo comum de sinistro é quando você se envolve em um acidente de carro involuntário e já possui uma cobertura para colisões com a seguradora. Outro exemplo ocorre quando o veículo é furtado ou roubado, também coberto pela apólice de seguro. </p>
<p>Vale destacar que essa base não indica o motivo do sinistro, apenas se há registro de um possível sinistro. recomenda-se realizar uma avaliação física do veículo. Para obter mais informações, você também pode conferir o campo "Observações" do CRLV (Certificado de Registro e Licenciamento de Veículo) impresso. </p>
`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/parecer.png`,
        descricao: `<p>Esse dado é registrado quando o veículo passou por reparos ou possui alguma restrição com a seguradora. É importante ressaltar que esse apontamento não reflete a situação final junto às companhias de seguro, já que os critérios de aceitação são internos e exclusivos de cada empresa, não sendo divulgados. Portanto, recomenda-se utilizá-lo apenas como um dado de apoio, em conjunto com outras informações sobre sinistralidade. </p>
<p>Vale lembrar que essa base não revela o motivo do apontamento, apenas indica que houve um registro. Assim, é essencial realizar uma cotação com uma seguradora de confiança. </p>
`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/leilao.png`,
        descricao: ``,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/detalhes-leilao.png`,
        descricao: `<p>Os leilões de veículos são eventos em que automóveis são vendidos ao maior lance, podendo ocorrer presencialmente ou online. Eles oferecem uma plataforma para a venda de carros recuperados, usados ou apreendidos por instituições financeiras, empresas de leasing ou agências governamentais. </p>
<p>Esses leilões são reconhecidos como uma excelente oportunidade de negócio, pois é possível adquirir veículos por valores que variam de 30% a 50% abaixo do preço Fipe. </p>
`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/remarketing.png`,
        descricao: `<p>O evento de Remarketing Automotivo é uma ação comercial focada na revenda de veículos usados, seminovos ou desativados por empresas, concessionárias ou locadoras de veículos. O termo "remarketing" no contexto automotivo refere-se à prática de dar um novo destino a veículos que já foram utilizados, buscando maximizar o valor de revenda desses automóveis, que podem ser de frota, devoluções de leasing, entre outros. Sempre que houver pesquisas com o positivo para essa informação, será disponibilizado fotos e checklist retornadas diretamente do fornecedor. </p>`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/checklist.png`,
        descricao: ``,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/hist-venda.png`,
        descricao: `<p>Venda Direta de Empresas/Locadoras: Grandes empresas que possuem frotas de veículos, como locadoras ou companhias de leasing, frequentemente vendem seus veículos de forma direta ao consumidor final ou a outros comerciantes, procurando obter a melhor oferta. Essa prática é comum quando as empresas decidem renovar suas frotas e vendem os veículos usados. </p>`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/fipe.png`,
        descricao: `<p>Retorna as versões de acordo com a tabela FIPE. </p>`,
        open: false
      },
      {
        img: `${this.s3Carcheckbrasil}/${this.path}/desv-media.png`,
        descricao: `<p>Mostra a desvalorização do veículo deste do ano fabricação até o ano atual vigente, a primeira linha percentual é referente ao ano anterior e a segunda é referente a desvalorização total do veículo. </p>`,
        open: false
      },
    ];
  }





  openDescricao(index) {
    this.consultas.forEach((item, i) => {
      if (i === index) {
        item.open = !item.open;
        if (item.open) {
          const i = document.getElementsByClassName('item' + index);
          i[0].classList.add('open');
        } else {
          const i = document.getElementsByClassName('item' + index);
          i[0].classList.remove('open');
        }
      } else {
        item.open = false;
      }
    });
  }

}
