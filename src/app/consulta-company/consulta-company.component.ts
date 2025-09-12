import { Component, HostListener, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { LoginService } from "../service/login.service";
import { ModalService } from "../service/modal.service";
import { dadosConsultaService } from "../service/dados-consulta.service";
import { DataService } from "../service/dataService.service";
import { Title, Meta } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import { InlineSVGDirective } from '../directives/inline-svg.directive';

@Component({
    selector: "app-consulta-company",
    templateUrl: "./consulta-company.component.html",
    styleUrls: ["./consulta-company.component.scss"],
    standalone: true,
    imports: [CommonModule, InlineSVGDirective]
})
export class ConsultaCompanyComponent implements OnInit {
  dadosConsulta: any;
  tokenConsulta: string | null = null;
  statusCarregamento: any = 1;
  login: any = { status: false };
  consultaExemplo = false;

  public iframeUrl: SafeResourceUrl;
  public iframeHeight: string;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private modalService: ModalService,
    private dadosConsultaService: dadosConsultaService,
    private dataService: DataService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.iframeHeight = "1000px";
  }

  @HostListener("window:message", ["$event"])
  onMessage(event: MessageEvent): void {
    const iframeOrigin = new URL("https://www.companyconferi.com.br").origin;
    if (event.origin !== iframeOrigin) {
      return;
    }

    if (event.data && typeof event.data.height === "number") {
      this.iframeHeight = `${event.data.height}px`;
    }
  }

  ngOnInit() {
    this.titleService.setTitle("Consulta CNPJ Completa");
    this.metaService.updateTag({
      name: "description",
      content:
        "Verifique dados de empresas por CNPJ com fonte oficial, rápida e confiável.",
    });

    this.modalService.openLoading({
      title: "Aguarde...",
      desc: "Estamos carregando a consulta.",
    });
    this.loginService.getLogIn().subscribe((v) => (this.login = v));

    this.route.paramMap.subscribe((params) => {
      this.tokenConsulta = params.get("tokenConsulta");
      this.verificaExemplo(this.tokenConsulta);
    });

    this.dadosConsulta = this.dataService.getData();
    if (this.dadosConsulta) {
      this.modalService.closeLoading();
      this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.dadosConsulta.linkPesquisa
      );
    } else {
      this.dadosConsultaService
        .getConsultaVeiculoCompany(this.tokenConsulta)
        .then((v) => {
          this.dadosConsulta = v;
          this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.dadosConsulta.linkPesquisa
          );
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.modalService.closeLoading();
        });
    }
  }

  ngOnDestroy() {
    this.dataService.clearData();
  }

  verificaExemplo(token: string | null | undefined): boolean {
    // true se houver token e ele contém "exemplo", senão false
    this.consultaExemplo = !!token?.match(/exemplo/);
    return this.consultaExemplo;
  }
}
