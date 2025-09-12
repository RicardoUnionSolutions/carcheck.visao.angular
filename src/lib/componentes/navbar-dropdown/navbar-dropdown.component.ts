import {
  Component,
  OnInit,
  Input,
  HostBinding,
  Output,
  EventEmitter,
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

export interface UserOption {
  icon: string;
  label: string;
  url: string;
}

@Component({
  selector: "ck-navbar-dropdown",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar-dropdown.component.html",
  styleUrls: ["./navbar-dropdown.component.scss"],
})
export class CkNavbarDropdownComponent implements OnInit {
  @Input() options: UserOption[] = [];
  @Input() title: string = "";
  @Input() img: string = "./assets/images/usuario.png";
  @Input() disabled: boolean = false;
  @Input() menuUrl: any = { routerUrl: "/", url: "" };
  @Input() show: boolean = false;
  @Output() showChange = new EventEmitter<boolean>();

  @HostBinding("class.active") activeClass = "";

  constructor(private route: Router) {
    this.route.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((r) => {
        this.show = false;
        this.changeActiveClass();
      });
  }

  ngOnInit() {
    this.changeActiveClass();
  }

  toggleCollapse() {
    if (!this.disabled) {
      this.show = !this.show;
      this.changeActiveClass();
      this.showChange.emit(this.show);
    }
  }

  changeActiveClass() {
    if (this.show == true) {
      this.activeClass = "active";
    } else {
      this.activeClass = "";
    }
  }

  ngOnChanges() {
    this.changeActiveClass();
  }

  selectOption(option: UserOption) {
    if (option.url) {
      this.route.navigate([option.url]);
    }
    this.show = false;
    this.changeActiveClass();
    this.showChange.emit(this.show);
  }
}
