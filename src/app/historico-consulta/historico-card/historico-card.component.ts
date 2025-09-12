import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { dadosConsultaService } from '../../service/dados-consulta.service';
import { ModalService } from '../../service/modal.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DataService } from '../../service/dataService.service';
import { AppearOnScrollDirective } from '../../directives/appear-on-scroll.directive';
import { InlineSVGDirective } from '../../directives/inline-svg.directive';

@Component({
    selector: 'historico-card',
    templateUrl: './historico-card.component.html',
    styleUrls: ['./historico-card.component.scss'],
    standalone: true,
    imports: [CommonModule, AppearOnScrollDirective, InlineSVGDirective]
})
export class HistoricoCardComponent implements OnInit {

  @Input() consulta:any;

  constructor(private http: HttpClient,
    private modalService: ModalService,
    private router: Router,
    private dadosConsultaService: dadosConsultaService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.formatarTextoConsulta();
  }

  ngOnChanges(){
    this.formatarTextoConsulta();
  }

  formatarTextoConsulta(){
    this.consulta.tipo = this.consulta.tipo.replace('Consulta', 'Consulta ');
  }

  click(){

    if(this.consulta.tipoProduto == 'LAUDO') {
      this.router.navigate(['/vistoria/',this.consulta.laudo.token]);
      return;
    }

    if(this.consulta.status==0 && !this.consulta.consultaCompany)
      this.router.navigate(['/consulta/',this.consulta.tokenConsulta]);

    if(this.consulta.status==0 &&  this.consulta.consultaCompany){
      
      if (this.consulta.exibirPdf && this.consulta.linkPdf != null) {
        window.open(this.consulta.linkPdf, '_blank');
      } else {
        this.dataService.setData(this.consulta);
        this.router.navigate(['/visualizar-consulta/',this.consulta.tokenConsulta]);
      }
      
    }

  }

  async recarregarConsulta(event){
    this.modalService.openLoading({ title: 'Atualizando consulta', text: 'Aguarde, sua consulta está sendo atualizada.' });

    try {
      let data = await this.dadosConsultaService.getRecarregarConsulta( this.consulta.id );
      if(data!=null && !this.consulta.consultaCompany){
        this.montaConsultas(data);
      }
      if(data !=null && this.consulta.consultaCompany){
        this.consulta.status = 1;
        this.consulta.qtdErros = 0
      }

    } catch (error) {
      console.log(error);
    } finally {
      this.modalService.closeLoading();
      event.stopPropagation();
    }
  }

  montaConsultas(composta) {
      let qtdErro = composta.consulta.filter(consultaInterna=>consultaInterna.codigoControle=="ERRO_FORNECEDOR").length;
      let qtdPendente = composta.consulta.filter(consultaInterna=>consultaInterna.codigoControle=="PENDENTE").length;

      // console.log(composta);


      console.log( composta.marca );

      let marca = composta.marca!=null ? composta.marca.toLowerCase().replace(/ /g,"").replace(/ /g,"") : "semmarca";
      let modelo = composta.modeloBin!=null? composta.modeloBin : composta.modeloDecodificador;

      if(composta.tipo!=null){
        if(composta.tipo=="Motocicleta" && marca!="semmarca"){
          marca = marca + '-moto';
        }
      }

      let consultaFinal = {
        id: composta.id,
        status: qtdErro==0 && qtdPendente==0? 0 : qtdPendente>0? 1 : 2,
        data: composta.dataConsulta,
        qtdErros: qtdErro,
        tipo: "Consulta " + composta.nomeConsulta,
        tokenConsulta: composta.tokenConsulta,
        placa: composta.placaEntrada,
        chassi: composta.chassiEntrada,
        modelo: modelo,
        img: './assets/images/marcas/' + marca + '.png',
        laudo: composta.laudo || null,
        tipoProduto: composta.tipoProduto,
      };

      this.consulta = consultaFinal;
  }

  downloadPdfFromUrl(url: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/pdf' });

    return this.http.get(url, {
      headers: headers,
      responseType: 'arraybuffer'
    })
    .pipe(
      map((arrayBuffer: ArrayBuffer) => new Blob([arrayBuffer], { type: 'application/pdf' }))
    );
  }

  baixarPdf(event, tokenConsulta: string) {
    event.stopPropagation();
    const url = `https://carcheckbrasil.s3.us-east-1.amazonaws.com/consulta-veiculo-pdf/${tokenConsulta}.pdf`;

    this.downloadPdfFromUrl(url).subscribe((blob: Blob) => {
      const fileURL = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = fileURL;
      a.download = 'Consulta-Carcheck-Brasil.pdf';
      a.click();
    });
  }



}
