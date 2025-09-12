import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-by-step-sm',
  standalone: true,
  template: `
    <div class="step-by-step">
      <ng-container *ngFor="let step of steps; let i = index">
        <span [class.active]="i === active">{{ step }}</span>
      </ng-container>
    </div>
  `,
  styles: [
    `.step-by-step span { margin-right: 4px; }
     .step-by-step span.active { font-weight: bold; }
    `
  ]
})
export class StepByStepSmComponent {
  @Input() steps: string[] = [];
  @Input() active = 0;
}
