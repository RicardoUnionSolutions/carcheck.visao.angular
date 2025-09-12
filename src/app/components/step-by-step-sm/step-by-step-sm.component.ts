import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-step-by-step-sm',
    templateUrl: './step-by-step-sm.component.html',
    styleUrls: ['./step-by-step-sm.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class StepByStepSmComponent implements OnInit {

  constructor() { }

  @Input() steps: string[] = [];
  @Input() active = 0;

  calculateProgress(): number {
    if (this.steps.length <= 1) {
      return 0;
    }
    return (100 / (this.steps.length - 1)) * this.active;
  }

  ngOnInit(): void {
  }

}
