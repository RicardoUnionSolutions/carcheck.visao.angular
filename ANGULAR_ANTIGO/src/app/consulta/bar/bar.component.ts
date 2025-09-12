import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'consulta-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.scss']
})
export class BarComponent implements OnInit {

  @Input() step:number=0;
  @Output() stepChange = new EventEmitter(); 

  constructor() { }

  ngOnInit() {
  }

  stepBtnClick(step){
    this.step = step;
    this.stepChange.emit(this.step);
  }

}
