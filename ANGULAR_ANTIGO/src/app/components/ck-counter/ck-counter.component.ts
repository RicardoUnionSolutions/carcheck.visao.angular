import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ck-counter',
  templateUrl: './ck-counter.component.html',
  styleUrls: ['./ck-counter.component.scss']
})
export class CkCounterComponent implements OnInit {
  
  @Input() minValue:number = 0;
  @Input() maxValue:number = 99999;
  @Input() value:any = 0;

  @Output() valueChange = new EventEmitter();

  mask = {mask:[/[0-9]/,/[0-9]/,/[0-9]/], guide: false};

  constructor() { }

  ngOnInit() {
  }

  add(){
    if(this.value < this.maxValue){
      this.value++;
      this.valueChange.emit(this.value);
      return true;
    } else {
      return false;
    } 
  }

  remove(){
    if(this.value > this.minValue){
      this.value--;
      this.valueChange.emit(this.value);
      return true;
    } else {
      return false;
    } 
  }

  validate(){
    if(this.value < this.minValue) 
      this.value = this.minValue;
    if(this.value > this.maxValue)
      this.value = this.maxValue;
  }

  modelChange(){
    if(/([0-9]+|Infinity)$/.test(this.value))
      this.value = parseInt(this.value);
    else
      this.value = 0;
    
    this.valueChange.emit(this.value);
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    let nextValue = this.value + event.key;
    //console.log(event);
    if(event.key!="Backspace"){
      if (!pattern.test(inputChar) || nextValue > this.maxValue) {
        event.preventDefault();
      } else {
        if(this.value==0) this.value="";
      }
    }    
  }
  
  keyDown(event){
    if(event.key=="ArrowUp"){
      this.add();
      event.preventDefault();
      return;
    }

    if(event.key=="ArrowDown"){
      this.remove();
      event.preventDefault();
      return;
    }
  }

  blur(){
    if(this.value=='') this.value='0';
  }
  
}
