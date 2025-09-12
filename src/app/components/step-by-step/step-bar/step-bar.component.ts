import { Component, OnInit, Input, HostBinding, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'step-bar',
  templateUrl: './step-bar.component.html',
  styleUrls: ['./step-bar.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class StepBarComponent implements OnInit, OnChanges {

  @Input() state:any;
  @HostBinding('class.done') stateClass = '';

  constructor() { }

  ngOnInit() {}

  ngOnChanges(){
    this.stateClass = this.state == 1 ? 'done' : '';
  }
}
