import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../service/modal.service';
import { PagarDebitosService } from '../service/pagar-debitos.service';
import { InlineSVGDirective } from '../directives/inline-svg.directive';

@Component({
    selector: 'app-pagar-debitos',
    templateUrl: './pagar-debitos.component.html',
    styleUrls: ['./pagar-debitos.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InlineSVGDirective]
})
export class PagarDebitosComponent implements OnInit {
  @ViewChild('fimDaPagina') fimDaPagina!: ElementRef;
  isRelatorioFixo = true;
  @HostListener('window:scroll', [])
  onScroll() {
    this.verificarPosicao();
  }

  verificarPosicao() {
    if (!this.fimDaPagina) return;

    const rect = this.fimDaPagina.nativeElement.getBoundingClientRect();

    // Se a parte superior da section estiver visível na viewport
    this.isRelatorioFixo = rect.top > window.innerHeight;
  }


  form: UntypedFormGroup;
  formPagamento: UntypedFormGroup;
  dadosDoVeiculo = null;
  debitosSelecionados = [];
  linkPagamento = "";
  buscandoDebitos = false;
  mostrarFormPagamento = false;
  gerandoLink = false;
  consultaAnterior = null;

  constructor(private fb: UntypedFormBuilder,
    private service: PagarDebitosService,
    private modalService: ModalService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // busca consulta pela consulta id passada no redirectlink
    const consultId = this.route.snapshot.paramMap.get('consultaId');
    if (consultId) {
      const consultaAnteriorSalva = JSON.parse(localStorage.getItem('consulta_anterior'));
      if (consultaAnteriorSalva && consultaAnteriorSalva.consult_id == consultId) {
        this.consultaAnterior = consultaAnteriorSalva;
        this.buscarPelaConsultaAnterior();
      }
    }

    // busca a ultima consulta feita
    const consultaAnteriorSalva = localStorage.getItem('consulta_anterior');
    if (consultaAnteriorSalva) {
      this.consultaAnterior = JSON.parse(consultaAnteriorSalva);
    }

    this.form = this.fb.group({
      uf: ['SP', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      placa: ['', Validators.required],
      renavam: ['', Validators.required]
    });

    this.formPagamento = this.fb.group({
      nome: ['', Validators.required],
      documento: ['', Validators.required],
    });
  }

  consultar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.scrollToTop();

    const dadosConsulta = this.form.value;
    dadosConsulta.placa = dadosConsulta.placa.replace('-', '');

    // chamar o serviço passando o form
    this.fazerConsulta(dadosConsulta);
  }

  fazerConsulta(dadosConsulta) {
    this.modalService.openLoading({ title: 'Aguarde...', text: 'Buscando débitos' });

    this.service.consultarDebitos(dadosConsulta).subscribe({
      next: (v: any) => {
        const consultId = v?.consult_id ?? v?.consultId ?? v?.consultID;

        if (consultId) {
          this.buscarRetornoDebitos(String(consultId));
          return;
        }

        this.finalizarConsultaComDados(v);
      },
      error: (err) => {
        this.modalService.closeLoading();
        this.modalService.openModalMsg({ status: 2, cancel: { show: false }, title: ' Erro ao buscar debitos, caso erro persistir, entre em contato nosso suporte.' })
        console.error('Erro ao buscar debitos:', err);
      },
    });
  }

  private finalizarConsultaComDados(dados: any) {
    this.dadosDoVeiculo = dados;

    if (dados) {
      const consultId = dados.consult_id ?? dados.consultId ?? dados.consultID;
      const vehicle = dados.vehicle ?? {};

      if (consultId) {
        const consultaAnterior = {
          consult_id: consultId,
          uf: vehicle?.uf,
          placa: vehicle?.license_plate,
          renavam: vehicle?.renavam,
        };

        this.consultaAnterior = consultaAnterior as any;
        localStorage.setItem('consulta_anterior', JSON.stringify(consultaAnterior));
      }
    }

    this.modalService.closeLoading();
  }

  buscarRetornoDebitos(consultId: string) {
    const consultIdNormalizado = consultId ? String(consultId) : '';

    if (!consultIdNormalizado) {
      this.modalService.closeLoading();
      this.modalService.openModalMsg({ status: 2, cancel: { show: false }, title: 'Não foi possível identificar a consulta. Tente novamente.' });
      return;
    }

    let tentativas = 0;
    const maxTentativas = 12;
    const intervalo = 5000; // 5 segundos
    let finalizado = false;

    const fazerRequisicao = () => {
      if (finalizado) {
        return;
      }

      if (tentativas >= maxTentativas) {
        finalizado = true;
        this.modalService.closeLoading();
        this.modalService.openModalMsg({ status: 2, cancel: { show: false }, title: 'Timeout: Não foi possível obter os débitos. Tente novamente mais tarde.' });
        return;
      }

      tentativas++;

      this.service.buscarRetorno(consultIdNormalizado).subscribe({
        next: (retorno: any) => {
          const status = retorno?.status?.toString().toLowerCase();

          if (retorno && status !== 'pending') {
            finalizado = true;
            this.finalizarConsultaComDados(retorno);
          } else if (!finalizado) {
            setTimeout(fazerRequisicao, intervalo);
          }
        },
        error: (err) => {
          if (!finalizado && err?.status === 404) {
            setTimeout(fazerRequisicao, intervalo);
            return;
          }

          finalizado = true;
          this.modalService.closeLoading();
          this.modalService.openModalMsg({ status: 2, cancel: { show: false }, title: 'Erro ao buscar retorno dos débitos. Tente novamente.' });
          console.error('Erro ao buscar retorno:', err);
        },
      });
    };

    fazerRequisicao();
  }

  buscarPelaConsultaAnterior() {
    const dadosConsulta = {
      uf: this.consultaAnterior.uf,
      placa: this.consultaAnterior.placa,
      renavam: this.consultaAnterior.renavam,
    }
    this.fazerConsulta(dadosConsulta);
  }

  pagarDebitos() {
    if (this.formPagamento.invalid) {
      this.formPagamento.markAllAsTouched();
      return;
    }

    this.gerandoLink = true;
    const consultId = this.dadosDoVeiculo.consult_id;
    const name = this.formPagamento.get('nome').value; // nome de quem ira realizar o pagamento
    const document = this.formPagamento.get('documento').value;; // documento de quem ira realizar o pagamento
    const intermediaryDocument = '49616085000126'; // cnpj da union cadastrada na pinpag
    const callbackUrl = 'https://ws.carcheckbrasil.com.br/pinpag/callbackPagamentos'; // a definir

    const totalAmount = this.calcularTotal();
    const serviceAmount = totalAmount * 0.035; // taxa de conveniência de 3,5% sobre o valor total

    const dadosPagamento = {
      consult_id: consultId,
      name: name,
      document: document,
      debits: this.debitosSelecionados.map(d => d.debit_id),
      total_amount: totalAmount + serviceAmount,
      service_amount: serviceAmount,
      intermediary_document: intermediaryDocument,
      callback_url: callbackUrl,
      redirect_url: ""
    };

    this.service.gerarLinkPagamento(dadosPagamento).subscribe({
      next: (v: any) => {
        this.linkPagamento = v.url;
        this.gerandoLink = false;
        window.location.href = this.linkPagamento;
      },
      error: (err) => {
        console.error('Erro ao gerar link:', err);
        this.gerandoLink = false;
        this.modalService.openModalMsg({ status: 2, cancel: { show: false }, title: ' Erro ao gerar link de pagamento, caso erro persistir, entre em contato nosso suporte.' })
      },
    });

  }

  isSelecionado(debito): boolean {
    return this.debitosSelecionados.some(d => d.debit_id === debito.debit_id);
  }

  toggleSelecionado(debito): void {
    const index = this.debitosSelecionados.findIndex(d => d.debit_id === debito.debit_id);

    if (index >= 0) {
      this.debitosSelecionados.splice(index, 1);
    } else {
      this.debitosSelecionados.push(debito);
    }
  }

  calcularTotal(): number {
    return this.debitosSelecionados.reduce((acc, debito) => acc + (debito.value || 0), 0);
  }

  mascaraPlaca(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input || !input.value) {
      return;
    }
    
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (value && value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3, 7);
    }
    
    if (input) {
      input.value = value;
    }
    
    if (this.form && this.form.controls['placa']) {
      this.form.controls['placa'].setValue(value);
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}


