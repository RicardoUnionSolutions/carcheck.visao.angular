import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ck-tag',
    templateUrl: './ck-tag.component.html',
    styleUrls: ['./ck-tag.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class CkTagComponent implements OnInit {

  constructor() { }
  @Input() status:any;
  @Input() text = '';
  @Input() @HostBinding('class') class = '';

  ngOnInit() {
    this.ngChanges();
  }

  ngChanges(){
    switch(this.status){
      case 0:
        this.class="bg-success";
        break;

      case 1:
        this.class="bg-orange-1";
        break;

      case 2:
        this.class="bg-danger"
        break;

      case 4:
        this.class="bg-blue";
    }
  }

}
