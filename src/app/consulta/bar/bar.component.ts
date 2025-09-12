import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'consulta-bar',
    templateUrl: './bar.component.html',
    styleUrls: ['./bar.component.scss'],
    standalone: true,
    imports: [CommonModule]
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
