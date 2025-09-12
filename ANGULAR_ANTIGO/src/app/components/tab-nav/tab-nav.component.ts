import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tab-nav',
  templateUrl: './tab-nav.component.html',
  styleUrls: ['./tab-nav.component.scss']
})
export class TabNavComponent implements OnInit {

  @Input() currentTab = 0;
  @Input() tabs = [''];

  @Output() currentTabChange = new EventEmitter();

  //pra n da erro, verificar na lista pagamento, nao esta sendo usado
  @Input() listaPagamento: any[];

  constructor() { }

  ngOnInit() {
  }

  goToTab(i) {
    if (this.tabs.length > 1) {
      this.currentTab = i;
      this.currentTabChange.emit(this.currentTab);
    }
  }

}



/*import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tab-nav',
  templateUrl: './tab-nav.component.html',
  styleUrls: ['./tab-nav.component.scss']
})
export class TabNavComponent implements OnInit {

  @Input() currentTab = 0;
  @Input() tabs = [];
  @Input() listaPagamento:any[];

  @Output() currentTabChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  goToTab(i){
    
    console.log(i);
    if(this.listaPagamento[i].status){
      this.currentTab = i;
      this.currentTabChange.emit(this.currentTab);
    }
  }

}
*/