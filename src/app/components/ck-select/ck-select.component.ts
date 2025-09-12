import { Component, OnInit, Input, HostBinding, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'ck-select',
    templateUrl: './ck-select.component.html',
    styleUrls: ['./ck-select.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class CkSelectComponent implements OnInit {

  static count: number = 0;

  @Input() id: string = "0";
  @Input() value: any = '';
  @Input() label: string = "";
  @Input() options: any = [];
  @Input() control: AbstractControl;
  @Input() loading: any = null;

  @Output() valueChange = new EventEmitter();

  @Input() @HostBinding('class.no-box') noBox: boolean = false;

  constructor() { }

  ngOnInit() {
    this.id = this.id == "0" ? ++CkSelectComponent.count + '-CkSelectComponent' : this.id;
    this.control = this.control || new UntypedFormControl(this.value);

    this.control.valueChanges.subscribe(v => {
      if (v == this.value) return;

      this.value = v;
      this.valueChange.emit(v);
    });
  }

  /* similar ao ngOnchanges porem executa após o ngOnChanges(1) e ngOnInit(2) */
  ngDoCheck() {
    if(this.control){
       if (this.loading===true)
         this.control.disable();
       else if (this.loading===false)
         this.control.enable();
     }
   // this.control.patchValue(this.value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading'] != null && changes['loading'].currentValue != changes['loading'].previousValue) {
      if (this.control) {
        if (this.loading === true)
          this.control.disable();
        else if (this.loading === false)
          this.control.enable();
      }
    }
  }


}
