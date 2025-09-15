import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariableGlobal } from '../service/variable.global.service';
import { ModalService } from '../service/modal.service';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../service/login.service';
import { AnalyticsService } from '../service/analytics.service';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DuvidasFrequentesComponent } from '../duvidas-frequentes/duvidas-frequentes.component';
import { CompararProdutoComponent } from '../produtos/comparar-produto/comparar-produto.component';
import { ProdutosComponent } from '../home-view/produtos/produtos.component';
import { AppearOnScrollDirective } from '../directives/appear-on-scroll.directive';

@Component({
    selector: 'consulta-inicial',
    templateUrl: './consulta-inicial.component.html',
    styleUrls: ['./consulta-inicial.component.scss'],
    standalone: true,
    imports: [CommonModule, DuvidasFrequentesComponent, CompararProdutoComponent, ProdutosComponent, AppearOnScrollDirective]
})
export class ConsultaInicialComponent implements OnInit {

  placa: string = "";
  email: string = "";
  nome: string = "";
  flagCompra: boolean = false;
  loading: boolean = false;
  login: any;
  logou: boolean = false;
  limiteAtingido: boolean = false;
  erroAoConsultar: boolean = false;

  private tokenRecaptcha: string = "";
  @Input() dadosVeiculo: any;

  constructor(private router: Router, private modalService: ModalService, private analyticsService: AnalyticsService, private route: ActivatedRoute, private http: HttpClient, private variableGlobal: VariableGlobal, private titleService: Title, private metaService: Meta) { }

  ngOnInit() {
    this.titleService.setTitle('Consulta Veicular pela Placa');
    this.metaService.updateTag({
      name: 'description',
      content: 'Descubra as informações do veículo pela placa com segurança e rapidez. Consulte grátis agora mesmo.'
    });

    this.loading = true;
    this.flagCompra = false;
    this.route.params.subscribe(params => {
      this.flagCompra = false;
      this.placa = params['placa'];
      this.email = params['email'];
      this.nome = params['nome'];
      this.tokenRecaptcha = params["tokenRecaptcha"];
      if (this.placa != null && this.placa != "") {
      }
    });
    //verificação se esta logado
    // this.loginService.getLogIn().subscribe(v => {
    //   this.login = v;
    //   if(v.status == true){
    //     this.logou = true;
    //   }
    // });
    // if(this.logou && this.login.status){
    // this.analyticsService.experimentou();
    // } else {
    //   this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
    // }
    this.consultar();

  }

  consultar() {
    this.analyticsService.experimentou();
    var dados = {
      placa: this.placa,
      tokenRecaptcha: this.tokenRecaptcha,
      nome: this.nome,
      email: this.email
    };
    return this.http.post(this.variableGlobal.getUrl("consultar/pegarDadosVeiculoTelaInicial"), dados)
      .toPromise()
      .then(response => {
        this.dadosVeiculo = response;
        if (this.dadosVeiculo.listaFipes[0]?.status == "NAO_ENCONTRADO" || Object.keys( this.dadosVeiculo.listaFipes).length === 0) {
          this.dadosVeiculo.listaFipes = [];
        }

        this.dadosVeiculo.img = this.dadosVeiculo.veiculo.marca.trim().toLowerCase();
        this.loading = false;
      }).catch((err) => {
        this.loading = false;
        var error = err.error;
        if (error.limiteAtingido) {
          console.log(error.mensagem)
          this.limiteAtingido = true;
        } else {
          console.log(err);
          this.erroAoConsultar = true;
        }
      });
  }

  clickComprar() {
    this.flagCompra = true;
    this.router.navigate(['/comprar-consulta-placa/' + this.placa + '/']);
  }

  closeBanner() {
    const banner = document.getElementById('bannerFixed');
    banner.style.display = 'none';
  }

}
