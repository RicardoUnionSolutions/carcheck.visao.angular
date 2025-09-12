import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'preco-item-tag',
    templateUrl: './item-tag.component.html',
    styleUrls: ['./item-tag.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class ItemTagComponent implements OnInit {
 
  @Input() label:String = '';
  
  @Input() active:boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
