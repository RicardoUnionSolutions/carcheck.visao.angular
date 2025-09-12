import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ck-progress-bar',
  templateUrl: './ck-progress-bar.component.html',
  styleUrls: ['./ck-progress-bar.component.scss']
})
export class CkProgressBarComponent implements OnInit {

  @Input() progress:number=0;
  @Input() color:any = {danger: "#d60000", warning: "#ecda26", success: "#3daf35", info: "#0067E0"};
  @Input() range:any = {danger: 33, warning: 66, success: 100};
  @Input() type:string = "";
  constructor() { }

  ngOnInit() {}

  ngOnChanges() {
    switch(this.type){
      case "danger":
        this.color.success = this.color.danger;
        this.color.warning = this.color.danger;
        break;

      case "warning":
        this.color.success = this.color.warning;
        this.color.danger = this.color.warning;
        break;

      case "success":
        this.color.warning = this.color.success;
        this.color.danger = this.color.success;
        break;

      case "info":
        this.color.warning = this.color.info;
        this.color.danger = this.color.info;
        this.color.success = this.color.info;
        break;

      case "color":
        let color = {
        warning: this.color,
        danger: this.color,
        success: this.color,
      };
      this.color = color;
    }
  }

}
