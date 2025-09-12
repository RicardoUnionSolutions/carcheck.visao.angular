import { Component, OnInit, Input, HostBinding, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskDirective } from '../../directives/text-mask.directive';

@Component({
    selector: 'ck-input',
    templateUrl: './ck-input.component.html',
    styleUrls: ['./ck-input.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TextMaskDirective]
})
export class CkInputComponent implements OnInit {

  static count: number = 0;

  @Input() value = "";
  @Input() label: string = "";
  @Input() type: string = "";
  @Input() control: AbstractControl;
  @Input() mask: any = { mask: false };
  @Input() loading: any = false;

  @Input() togglePassword = false;
  @Input() passwordShow = false;

  @Input() @HostBinding('class.no-box') noBox: boolean = false;

  @Output() valueChange = new EventEmitter();
  
  id:string = '';
  @Input() elementId:string = '';


  constructor() {
  }

  ngOnInit() {
    this.id = this.id == "" ? ++CkInputComponent.count + '-CkInputComponent' : this.id;
    
    if(this.elementId!=''){
      this.id = this.elementId;
    }
    this.control = this.control || new UntypedFormControl(this.value);


    this.control.valueChanges.subscribe(v => {
      this.valueChange.emit(v);
    });
  }

  /* similar ao ngOnchanges porem executa após o ngOnChanges(1) e ngOnInit(2) */
  ngDoCheck() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['loading']!=null && changes['loading'].currentValue!=changes['loading'].previousValue){
      if (this.control) {
        if (this.loading === true)
          this.control.disable();
        else if (this.loading === false)
          this.control.enable();
      }
    }
  }

  
 

}
