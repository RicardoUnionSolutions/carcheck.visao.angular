import { Component, OnInit } from '@angular/core';
import { TokenService } from '../service/token.service';
import { dadosConsultaService } from '../service/dados-consulta.service';
import { FormGroup } from '@angular/forms';
import { FazerConsultaService } from '../service/fazer-consulta.service';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';
import { ModalService } from '../service/modal.service';
import { UtilMasks } from '../utils/util-masks';
import { NotificationService } from '../service/notification.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'realizar-consultas',
  templateUrl: './realizar-consultas.component.html',
  styleUrls: ['./realizar-consultas.component.scss']
})
export class RealizarConsultasComponent implements OnInit {
  errors: any = false;
  dadosConsulta: any[];
  dadosVeiculo: any = { marca: '', modelo: '' };

  form: FormGroup;
  login: any;
  consultasOptions: any[] = [];
  consultasOptionsDisponiveis: any[] = [];
  carregandoConsulta = false;
  masks: any;
  consultas: any = [{ placa: '', chassi: '', tipoPesquisa: 'placa' }];

  consultasDisponiveisVazio: any = false;

  constructor(
    private modalService: ModalService, 
    private loginService: LoginService, 
    private dadosConsultaService: dadosConsultaService, 
    private fazerConsultaService: FazerConsultaService, 
    private router: Router, 
    private notificationService:NotificationService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.dadosConsulta = []
    this.dadosVeiculo = { marca: '', modelo: '' };
    this.loginService.getLogIn().subscribe(v => this.login = v);

    this.masks = {
      placa: { mask: UtilMasks.placa, guide: false }
    }
  }

  carregaDadosVeiculoConsulta(i, concat: String = '') {
    var dados = this.consultas[i].tipoPesquisa == 'placa' ? this.consultas[i].placa.toUpperCase() : this.consultas[i].chassi.toUpperCase();

    if (this.consultas.length == 1 && concat == '') {
      concat = 'Tem certeza que deseja realizar a seguinte consulta?';
    } else if (concat == '') {
      concat = 'Tem certeza que deseja realizar as seguintes consultas?';
    }
    this.modalService.openLoading({ title: "Aguarde...", text: "Carregando informações" });
    this.fazerConsultaService.consultar(dados)
      .subscribe((data: any) => {
        this.dadosVeiculo = data;
        if (data != null) {
          concat += '<br>' + this.consultas[i].consultaSelecionada.nome + ' - ' +
            (this.consultas[i].tipoPesquisa == 'placa' ? ' Placa: ' + this.consultas[i].placa.toUpperCase() : ' Chassi: ' + this.consultas[i].chassi.toUpperCase())
            + ' - ' + data.marca + '/' + data.modelo;
        } else {
          concat += '<br>' + this.consultas[i].consultaSelecionada.nome + ' - ' +
            (this.consultas[i].tipoPesquisa == 'placa' ? ' Placa: ' + this.consultas[i].placa.toUpperCase() : ' Chassi: ' + this.consultas[i].chassi.toUpperCase());
        }

        i++;
        if (i < this.consultas.length) {
          this.carregaDadosVeiculoConsulta(i, concat);
        } else {
          this.modalService.closeLoading();
          this.modal(concat);
        }
      },
        error => {

            //Continuar a consulta mesmo com dados incorretos, mas informar placa incorreta

          //   concat += '<br>' + this.consultas[i].consultaSelecionada.nome + ' - ' +
          //   (this.consultas[i].tipoPesquisa == 'placa' ? '<span class="text-danger"> Placa: ' + this.consultas[i].placa.toUpperCase() + ' não consta na base de dados. </span>' : '<span class="text-danger"> Chassi: ' + this.consultas[i].chassi.toUpperCase() + ' não consta na base de dados. </span>');

          // i++;
          // if (i < this.consultas.length) {
          //   this.carregaDadosVeiculoConsulta(i, concat);
          // } else {
          //   this.modalService.closeLoading();
          //   this.modal(concat);
          // }

          //Continuar a consulta mesmo com dados incorretos

          concat += '<br>' + this.consultas[i].consultaSelecionada.nome + ' - ' +
            (this.consultas[i].tipoPesquisa == 'placa' ? ' Placa: ' + this.consultas[i].placa.toUpperCase() : ' Chassi: ' + this.consultas[i].chassi.toUpperCase());

          i++;
          if (i < this.consultas.length) {
            this.carregaDadosVeiculoConsulta(i, concat);
          } else {
            this.modalService.closeLoading();
            this.modal(concat);
          }


        }
      );

  }

  carregarDadosCreditoConsulta() {
    this.modalService.openLoading({ title: 'Carregando...', text: 'Aguarde, carregando consultas disponíveis.' });
    this.dadosConsultaService.getCreditoConsulta()
      .subscribe((data: any) => {
        this.dadosConsulta = data;
        let options = [];
        for (let d of data) {
          if (d.quantidade > 0)
            options.push({ label: d.nome, value: { ...d, quantidadeSelecionada: 0 } });
        }
        this.consultasOptions = options;
        this.consultas[0].options = options;

        if(this.consultasOptions.length==0){
          this.consultasDisponiveisVazio = true;
          this.router.navigateByUrl("/comprar-consulta-placa")
        }else{
          this.consultasDisponiveisVazio = false;
        }

        this.modalService.closeLoading();
      },
        error => {
          console.log("erro", error)
          this.modalService.closeLoading();
        }
      );

  }

  ngOnInit() {
    this.carregarDadosCreditoConsulta();
    this.titleService.setTitle('Realizar Consulta de Veículos por Placa ou Chassi');
    this.metaService.updateTag({ name: 'description', content: 'Página para realizar consultas veiculares detalhadas usando placa ou chassi, com múltiplas opções de crédito.' });

  }

  addConsulta() {
    let consulta = { placa: '', chassi: '', tipoPesquisa: 'placa', options: [] };

    this.consultasOptions.forEach(o => {
      if (o.value.quantidade > o.value.quantidadeSelecionada) {
        consulta.options.push(o);
      }
    });
    this.consultas.push(consulta);
  }

  removeConsulta(consulta, i) {
    if (consulta.consultaSelecionada != null) {
      consulta.consultaSelecionada.quantidadeSelecionada--;
      this.updateConsultasOptions();
    }
    this.consultas.splice(i, 1);
  }

  changeChassi() {

    //this.consultas.push({placa:this.form.controls.placa.value, chassi:this.form.controls.chassi.value, tipoPesquisa:this.form.controls.tipoPesquisa.value, consultaSelecionada:''});
  }

  changePlaca() {

    //this.consultas.push({placa:this.form.controls.placa.value, chassi:this.form.controls.chassi.value, tipoPesquisa:this.form.controls.tipoPesquisa.value, consultaSelecionada:''});
  }

  verificarDisponibilidadeConsulta() {
    var indisponiveis = 0;
    for (let i = 0; i < this.consultasOptions.length; i++) {
      if (this.consultasOptions[i].value.quantidade == this.consultasOptions[i].value.quantidadeSelecionada)
        indisponiveis++;
    }
    return !(indisponiveis == this.consultasOptions.length);
  }
  /*
    changeConsulta(consulta, id) {
      console.log('consulta: ', consulta, 'id: ', id);
      var consultaSelecionada = this.dadosConsulta.filter((obj) => {
        return obj.id >= id;
      })[0];
      console.log("changeConsulta=> ", consulta);
      console.log("changeConsulta=> ", consultaSelecionada);

      consulta.consultaSelecionada = consultaSelecionada;

      consultaSelecionada.quantidade--;
    }*/

  consultar() {
    this.errors = false;
    let consultas = [];
    for (let i = 0; i < this.consultas.length; i++) {


      if (this.consultas[i].tipoPesquisa == 'placa' && this.consultas[i].placa.length < 7) {
        //console.log(this.consultas[i]);
        this.consultas[i].erroPlaca = true;
        this.errors = true;
      } else {
        this.consultas[i].erroPlaca = false;
      }

      if (this.consultas[i].tipoPesquisa == 'chassi' && this.consultas[i].chassi.length < 17) {
        //console.log(this.consultas[i]);
        this.consultas[i].erroChassi = true;
        this.errors = true;
      } else {
        this.consultas[i].erroChassi = false;
      }

      if (this.consultas[i].consultaSelecionada == null) {
        //console.log(this.consultas[i]);
        this.consultas[i].erroTipoConsulta = true;
        this.errors = true;
      } else {
        this.consultas[i].erroTipoConsulta = false;
      }

    }

    if(this.errors) return;

    this.carregandoConsulta = true;

    this.carregaDadosVeiculoConsulta(0);

  }

  modal(concat) {

    let consultas = [];
    for (let i = 0; i < this.consultas.length; i++) {
      consultas.push({ ...this.consultas[i] });
      delete consultas[i].options;
    }
    this.modalService.openModalMsg({
      status: 1,
      title: 'Confirmação de consulta',
      text: concat,
      html: true,
      ok: {
        event: () => {
          setTimeout(() => {
          this.modalService.openLoading({ title: 'Efetuando consulta', text: 'Aguarde, sua consulta está sendo realizada.' });
          this.fazerConsultaService.realizarConsulta(consultas)
            .subscribe(
              () => {
                this.modalService.closeLoading();
                this.carregandoConsulta = false;
                this.router.navigate(['/']);
                this.notificationService.addNotification("Consulta realizada", "Sua consulta esta pronta para ser vizualizada")
              },

              error => {
                this.modalService.closeLoading();
                //console.log("erro", error)
                this.carregandoConsulta = false;
              }
            );
          }, 3000);
        }
      },
      cancel: { event: () => { this.carregandoConsulta = false } }
    });
  }

  selecionarConsulta(i, $event) {
    if ($event.quantidade == $event.quantidadeSelecionada) {
      this.consultas[i].consultaSelecionada = null;
      return;
    } else {
      if (this.consultas[i].consultaSelecionada != null)
        this.consultas[i].consultaSelecionada.quantidadeSelecionada--;

      $event.quantidadeSelecionada++;
      this.consultas[i].consultaSelecionada = $event;
      this.updateConsultasOptions();
    }
  }

  updateConsultasOptions() {
    this.consultas.forEach(c => {
      c.options = [];

      this.consultasOptions.forEach(o => {
        if (o.value.quantidade > o.value.quantidadeSelecionada || (c.consultaSelecionada != null && o.value.nome == c.consultaSelecionada.nome))
          c.options.push(o);
      })

    });

  }

  validaPlaca(placa) {
    var er = /[a-z]{3}-?\d{4}/gim;
    er.lastIndex = 0;
    return er.test(placa);
  }

}
