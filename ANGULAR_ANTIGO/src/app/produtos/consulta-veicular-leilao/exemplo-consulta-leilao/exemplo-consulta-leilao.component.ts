import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exemplo-consulta-leilao',
  templateUrl: './exemplo-consulta-leilao.component.html',
  styleUrls: ['./exemplo-consulta-leilao.component.scss']
})
export class ExemploConsultaLeilaoComponent implements OnInit {

  isMobile: boolean = false;

  path: string = 'img-consultas-exemplo'
  s3Carcheckbrasil: string = 'https://carcheckbrasil.s3.us-east-1.amazonaws.com'
  consultas: { img: string, descricao: string, open: boolean }[] = [];


  constructor() { }

  ngOnInit() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.path = 'img-consultas-exemplo-mobile'
    }

    this.consultas = [
      {
        img: `${this.s3Carcheckbrasil}/img-consultas-exemplo/resumo-leilao.png`,
        descricao: '', open: false
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
        img: `${this.s3Carcheckbrasil}/${this.path}/leilao.png`,
        descricao: '',
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
