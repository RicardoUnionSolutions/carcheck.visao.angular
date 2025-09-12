import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'dados-bloco-multa',
  templateUrl: './dados-bloco-multa.component.html',
  styleUrls: ['./dados-bloco-multa.component.scss']
})
export class DadosBlocoMultaComponent implements OnInit {

  @Input() dadosDetalhamento: any;
  
  constructor() { 
  

  }

  ngOnInit() {
  }


  
}
