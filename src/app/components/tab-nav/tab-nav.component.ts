import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "tab-nav",
  templateUrl: "./tab-nav.component.html",
  styleUrls: ["./tab-nav.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class TabNavComponent implements OnInit {
  @Input() currentTab = 0;
  @Input() tabs = [""];

  @Output() currentTabChange = new EventEmitter();

  //pra n da erro, verificar na lista pagamento, nao esta sendo usado
  @Input() listaPagamento: any[];

  constructor() {}

  ngOnInit() {}

  goToTab(i) {
    if (this.tabs.length > 1) {
      this.currentTab = i;
      this.currentTabChange.emit(this.currentTab);
    }
  }
}
