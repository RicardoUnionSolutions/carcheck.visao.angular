import { Component, OnInit, HostBinding, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class StepComponent implements OnInit, OnChanges {

  @Input() state:number;
  @Input() icon:string = '';
  @Input() image:string = '';
  @HostBinding('class') private stateClass:string = '';

  constructor() {}

  ngOnInit() {
    this.setStateClass();
  }

  ngOnChanges(){
    this.setStateClass();
  }

  setStateClass(){
    switch(this.state){
      case 0:
       this.stateClass = this.stateClass== 'active' ? 'active-return' : '';
       break;
      
      case 1:
       this.stateClass = 'done';
       break;
      
      case 2:
       this.stateClass = this.stateClass== 'done' ? 'done-to-active' : 'active';
       break;
    }
  }

}
