import { Component, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-aplicativo',
    templateUrl: './aplicativo.component.html',
    styleUrls: ['./aplicativo.component.scss'],
    standalone: true,
    imports: [NgOptimizedImage]
})
export class AplicativoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
