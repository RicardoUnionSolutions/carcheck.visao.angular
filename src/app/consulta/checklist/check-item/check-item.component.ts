/*
  Documentação dil+ pro compromente check-item:

    ** [hiddenDetail]="true" (default = false) Força ocultar o "ver detalhes" (sei la pq, mas vai q...):  

    ** [status] 0=ok, 1=alerta, 2=perigo, 4=status de informação (default = 4)

    ** [label] resumo do item, usar aspas simples seguido de aspas duplas quando for uma string e não uma variavel do tipo string ;)
    
    ** html dentro da tag check-item são inseridos dentro de "ver detalhes" como no primeiro exemplo
    
    ** "ver detalhes" não é exibido caso nao haja conteudo ¯\_(ツ)_/¯
*/

import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGDirective } from '../../../directives/inline-svg.directive';

@Component({
    selector: 'check-item',
    templateUrl: './check-item.component.html',
    styleUrls: ['./check-item.component.scss'],
    standalone: true,
    imports: [CommonModule, InlineSVGDirective]
})
export class CheckItemComponent implements OnInit {

  @Input() status:number=4;
  @Input() label:string='';
  @Input() hiddenDetail:boolean=false;

  static count:number = 0;
  static currentIndex:number = 0;

  preventDoubleClick:boolean = true;
  selfStatic:any;
  index:number;

  constructor() {
    this.index = ++CheckItemComponent.count;
    this.selfStatic = CheckItemComponent;
    
  }

  ngOnInit() {
  }

  toggle(){
    if(this.preventDoubleClick==false) return;
    this.preventDoubleClick=false;
    setTimeout(()=>{
      this.preventDoubleClick=true;
    },400);

    if(this.index == CheckItemComponent.currentIndex){
      CheckItemComponent.currentIndex=0;
      
    } else if(CheckItemComponent.currentIndex==0){
      CheckItemComponent.currentIndex=this.index;
      
    } else {
      CheckItemComponent.currentIndex = 0;
      setTimeout(()=>{
        CheckItemComponent.currentIndex = this.index;
      },300);

    }



  }

}
