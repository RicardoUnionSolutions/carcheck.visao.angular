import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LaudoService } from '../service/laudo.service';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-vistoria',
  templateUrl: './vistoria.component.html',
  styleUrls: ['./vistoria.component.scss']
})
export class VistoriaComponent implements OnInit {

  statusText = '';
  steps = ["Solicitação de vistoria", "Agendado com proprietário", "Vistoria realizada", "Laudo entregue"];
  stepIndex = 0;
  token;
  dados: any;
  laudoDesc:string= '';
  fotoMarca = '';

  constructor(private activatedRoute: ActivatedRoute, private laudoService: LaudoService, private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    this.title.setTitle('Acompanhamento da Vistoria');
    this.meta.updateTag({ name: 'description', content: 'Visualize o status da vistoria veicular, incluindo etapas como agendamento, realização e entrega do laudo.' });

    this.token = this.activatedRoute.snapshot.paramMap.get('token');
    this.laudoService.getLaudo(this.token)
    .then(r => {
      this.dados = r;
      this.dados.cidade = this.laudoService.getCidadeNome(r.cidade);
      this.setStepIndex(this.dados.status);
      this.setFotoMarca(this.dados.marca);
    });
  }

  setStepIndex(status) {
    switch (status) {
      case 'SOLICITADO':
        this.stepIndex = 0;
        this.statusText = ' Recebemos sua solicitação. Entraremos em contato com o proprietário do veículo para realizar a vistoria em até 24h úteis.';
        this.laudoDesc = 'Solicitado';
        break;

      case 'AGENDADO':
        this.stepIndex = 1;
        this.statusText = 'Sua vistoria já está agendada com o proprietário do veículo. agora é só esperar. ;)';
        this.laudoDesc = 'Agendado';
        break;

      case 'VISTORIADO':
        this.stepIndex = 2;
        this.statusText = 'Já realizamos sua vistoria e estamos preparando o laudo. Em breve disponibilizaremos apra você.';
        this.laudoDesc = 'Vistoriado';
        break;

      case 'LAUDO_FINALIZADO':
        this.stepIndex = 3;
        this.statusText = '';
        this.laudoDesc = 'Finalizado';
        break;

      default:
        this.laudoDesc = status;
        break;
    }
  }

  setFotoMarca(nome_marca) {
    let marca = nome_marca != null ? nome_marca.toLowerCase().replace(/ /g, "").replace(/ /g, "") : "semmarca";
    this.fotoMarca = './assets/images/marcas/' + marca + '.png';
  }

}
