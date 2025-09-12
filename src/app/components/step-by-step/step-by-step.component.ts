import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepComponent } from './step/step.component';
import { StepBarComponent } from './step-bar/step-bar.component';

@Component({
  selector: 'step-by-step',
  templateUrl: './step-by-step.component.html',
  styleUrls: ['./step-by-step.component.scss'],
  standalone: true,
  imports: [CommonModule, StepComponent, StepBarComponent]
})
export class StepByStepComponent implements OnInit, OnChanges {

  @Input() steps:any;
  @Input() currentStep:number = 2;
  @Input() doneSteps:number = 2;
  @Output() currentStepChange = new EventEmitter();

  

  constructor() {
    this.steps = [{title:'Step 1', state:'0'}, {title:'Step 2', state:'0'}, {title:'Step 3', state:'1'}, {title:'Step 4', state:'0'}, {title:'Step 5', state:'1'}];  
  }

  ngOnInit() {
    this.updateStepState();
  }

  ngOnChanges(){
    this.updateStepState();
  }

  updateStepState(){
    let active = this.currentStep <= this.steps.length ? this.currentStep : this.steps.length-1;
    active = active < 0 ? 0 : active;
    
    for(let i = 0; i < this.steps.length; i++){
      this.steps[i].state = (i == active) ? 2 : (i <= this.doneSteps) ? 1 : 0;
    }
  }

  goToStep(step){
    if(step <= this.doneSteps) 
      this.currentStep = step;
    this.updateStepState();
    this.currentStepChange.emit(this.currentStep);
  }

}
