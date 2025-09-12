import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "../../../service/login.service";
import { CommonModule } from "@angular/common";
import { AppearOnScrollDirective } from "../../../directives/appear-on-scroll.directive";

@Component({
  selector: "tipo-produto-pacotes",
  templateUrl: "./tipo-produto-pacotes.component.html",
  styleUrls: ["./tipo-produto-pacotes.component.scss"],
  standalone: true,
  imports: [CommonModule, AppearOnScrollDirective],
})
export class TipoProdutoPacotesComponent implements OnInit {
  @Input() pacotes: any;
  @Input() consultas: any;
  login: any;
  logou: boolean = false;

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit() {
    this.setValores();
  }

  clickComprar(pacote) {
    // verificação se esta logado
    this.loginService.getLogIn().subscribe((v) => {
      this.login = v;
      if (v.status == true) {
        this.logou = true;
      }
    });

    if (!this.logou && !this.login.status) {
      this.router.navigate(["/login"], {
        queryParams: {
          returnUrl: "/processo-compra-multipla",
        },
        state: { pacote: pacote },
      });
    } else {
      const currentUrl = this.router.url;

      if (currentUrl === "/processo-compra-multipla") {
        // Navegação para a URL temporária se a URL atual for 'processo-compra-multipla'
        this.router.navigate(["/url-temporaria"]).then(() => {
          this.router.navigate(["/processo-compra-multipla"], {
            state: { pacote: pacote },
          });
        });
      } else {
        // Navega diretamente para 'processo-compra-multipla' se a URL atual for diferente
        this.router.navigate(["/processo-compra-multipla"], {
          state: { pacote: pacote },
        });
      }
    }
  }

  valorToString(preco) {
    return (
      "R$" +
      preco.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  setValores() {
    if (this.pacotes && this.consultas) {
      this.pacotes.forEach((pacote, index) => {
        const idComposta = pacote.composta_id;
        const composta = this.consultas.find(
          (consulta) => consulta.id === idComposta
        );
        if (composta) {
          const valorAtual =
            composta.valor_promocional * pacote.quantidade_composta;
          const valorPromocional =
            valorAtual * (1 - pacote.porcentagem_desconto / 100);
          this.pacotes[index].valor_atual = valorAtual;
          this.pacotes[index].valor_promocional = valorPromocional;
        }
      });
    }
  }
}
