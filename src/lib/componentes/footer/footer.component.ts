import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface FooterLink {
  label: string;
  url: string;
}

export interface SocialMediaLink {
  icon: string;
  url: string;
  label: string;
}

export interface PaymentMethod {
  icon: string;
  title: string;
}

@Component({
  selector: 'ck-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class CkFooterComponent implements OnInit {
  @Input() links: FooterLink[] = [];
  @Input() socialMedia: SocialMediaLink[] = [];
  @Input() paymentMethods: PaymentMethod[] = [];
  @Input() companyName: string = 'Carcheck Brasil';
  @Input() copyrightYear: number = new Date().getFullYear();
  @Input() showNewsletter: boolean = true;
  @Input() showApps: boolean = true;

  defaultLinks: FooterLink[] = [
    { label: 'Início', url: '/home' },
    { label: 'Consulta de Placa', url: '/consulta-placa-veiculo' },
    { label: 'Blog', url: '/blog' },
    { label: 'Dúvidas Frequentes', url: '/duvidas-frequentes' },
    { label: 'Fale Conosco', url: '/contato' },
    { label: 'Política de Privacidade', url: '/politica-de-privacidade' }
  ];

  defaultSocialMedia: SocialMediaLink[] = [
    { icon: 'mdi-facebook', url: '#', label: 'Facebook' },
    { icon: 'mdi-instagram', url: '#', label: 'Instagram' },
    { icon: 'mdi-twitter', url: '#', label: 'Twitter' },
    { icon: 'mdi-linkedin', url: '#', label: 'LinkedIn' }
  ];

  defaultPaymentMethods: PaymentMethod[] = [
    { icon: 'boleto.png', title: 'Boleto Bancário' },
    { icon: 'pix.png', title: 'PIX' },
    { icon: 'visa.png', title: 'VISA' },
    { icon: 'mastercard.png', title: 'MasterCard' },
    { icon: 'bradesco.png', title: 'Bradesco' },
    { icon: 'itau.png', title: 'Itaú' },
    { icon: 'banco-brasil.png', title: 'Banco do Brasil' }
  ];

  constructor() {}

  ngOnInit() {
    if (this.links.length === 0) {
      this.links = this.defaultLinks;
    }
    if (this.socialMedia.length === 0) {
      this.socialMedia = this.defaultSocialMedia;
    }
    if (this.paymentMethods.length === 0) {
      this.paymentMethods = this.defaultPaymentMethods;
    }
  }

  onNewsletterSubmit(event: Event) {
    event.preventDefault();
    // Implementar lógica de newsletter
    console.log('Newsletter submitted');
  }
}
