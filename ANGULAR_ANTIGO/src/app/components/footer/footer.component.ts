import { Component, OnInit } from '@angular/core';
import { VariableGlobal } from '../../service/variable.global.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  urlSite: any;

  formaPagamento:any = [
    {icon: 'boleto.png', title: 'Boleto Bancário'},
    {icon: 'pix.png', title: 'PIX'},
    {icon: 'visa.png', title: 'VISA'},
    {icon: 'mastercard.png', title: 'MasterCard'},
    {icon: 'bradesco.png', title: 'Bradesco'},
    {icon: 'itau.png', title: 'Itaú'},
    {icon: 'banco-brasil.png', title: 'Itaú'},
  ];

  constructor(private varGlobal: VariableGlobal) {
    this.urlSite = varGlobal.getUrlSite();
  }

  ngOnInit() {

  }

}
