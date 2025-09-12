import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

export interface MenuOption {
  icon: string;
  label: string;
  url: string;
}

@Component({
  selector: "ck-navbar-sub",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar-sub.component.html",
  styleUrls: ["./navbar-sub.component.scss"],
})
export class CkNavbarSubComponent implements OnInit {
  @Input() options: MenuOption[] = [];
  @Input() active: any;
  @Output() activeChange = new EventEmitter();

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.active = event.url;
        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i].url != null && event.url == this.options[i].url) {
            this.active = i;
            this.activeChange.emit(this.active);
          }
        }
      }
    });
  }

  ngOnInit() {
    if (typeof this.active == "undefined") {
      this.active = "0";
      this.activeChange.emit(this.active);
    }
  }

  ngOnChanges() {}

  selectItem(i: number) {
    this.active = i;
    this.activeChange.emit(i);
    if (this.options[i].url != null) {
      this.router.navigate([this.options[i].url]);
    }
  }
}
