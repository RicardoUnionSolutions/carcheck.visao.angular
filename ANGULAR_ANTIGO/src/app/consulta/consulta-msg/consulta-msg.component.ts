import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'consulta-msg',
  templateUrl: './consulta-msg.component.html',
  styleUrls: ['./consulta-msg.component.scss']
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
