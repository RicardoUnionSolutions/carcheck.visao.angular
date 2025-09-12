import { Component, OnInit, Input, HostBinding, OnChanges } from '@angular/core';

@Component({
  selector: 'step-bar',
  templateUrl: './step-bar.component.html',
  styleUrls: ['./step-bar.component.scss']
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
