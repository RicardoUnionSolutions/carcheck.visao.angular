import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  computed,
} from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

export interface MenuOption {
  icon: string;
  label: string;
  url: string;
}

export interface UserOption {
  icon: string;
  label: string;
  url: string;
}

@Component({
  selector: "ck-side-menubar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./side-menubar.component.html",
  styleUrls: ["./side-menubar.component.scss"],
})
export class CkSideMenubarComponent implements OnInit {
  @Input() options: MenuOption[] = [];
  @Input() userOptions: UserOption[] = [];
  @Input() menuUrl: any = { routerUrl: "/", url: "" };
  @Input() active: any;
  @Output() activeChange = new EventEmitter();

  // Usando signals para reatividade
  isOpen = signal(false);
  isOpenComputed = computed(() => this.isOpen());

  constructor(private router: Router, private route: ActivatedRoute) {
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
    this.isOpen.set(!this.isOpen());
    if (this.options[i].url != null) {
      this.router.navigate([this.options[i].url]);
    }
  }

  selectItemUser(i: number) {
    this.active = i;
    this.activeChange.emit(i);
    this.isOpen.set(!this.isOpen());
    if (this.userOptions[i].url != null) {
      this.router.navigate([this.userOptions[i].url]);
    }
  }

  toggleMenu(): void {
    this.isOpen.set(!this.isOpen());
  }
}
