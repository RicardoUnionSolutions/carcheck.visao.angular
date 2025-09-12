import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGDirective } from '../../directives/inline-svg.directive';

@Component({
    selector: 'consulta-msg',
    templateUrl: './consulta-msg.component.html',
    styleUrls: ['./consulta-msg.component.scss'],
    standalone: true,
    imports: [CommonModule, InlineSVGDirective]
})
export class ConsultaMsgComponent implements OnInit {

  @Input() status:any=5; 
  @Input() statusReload:any=0;
  @Input() statusVeiculo:any=0;
  @Output() reloadClick = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  reload(){
    this.reloadClick.emit(); 
    
  }

}
