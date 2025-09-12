import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-step-by-step-sm',
  templateUrl: './step-by-step-sm.component.html',
  styleUrls: ['./step-by-step-sm.component.scss']
})
export class StepByStepSmComponent implements OnInit {

  constructor() { }

  @Input() steps:string[] = [];
  @Input() active = 0;

  ngOnInit(): void {
  }

}
