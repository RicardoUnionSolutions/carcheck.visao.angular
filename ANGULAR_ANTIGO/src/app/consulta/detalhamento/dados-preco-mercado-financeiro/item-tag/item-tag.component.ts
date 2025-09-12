import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'preco-item-tag',
  templateUrl: './item-tag.component.html',
  styleUrls: ['./item-tag.component.scss']
})
export class ItemTagComponent implements OnInit {
 
  @Input() label:String = '';
  
  @Input() active:boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
