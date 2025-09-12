import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ck-chart',
    templateUrl: './ck-chart.component.html',
    styleUrls: ['./ck-chart.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class CkChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
