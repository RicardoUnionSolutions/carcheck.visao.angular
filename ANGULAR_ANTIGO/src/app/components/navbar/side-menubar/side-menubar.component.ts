import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LoginService } from '../../../service/login.service';

@Component({
  selector: 'side-menubar',
  templateUrl: './side-menubar.component.html',
  styleUrls: ['./side-menubar.component.scss']
})
export class SideMenubarComponent implements OnInit {
  @Input() options: any;
  @Input() userOptions: any[];
  @Input() menuUrl:any = {routerUrl:'/', url:''};
  @Input() active;
  @Output() activeChange = new EventEmitter();
  isOpen: boolean = false;

  constructor(private router: Router, private loginService: LoginService, private route: ActivatedRoute) {
    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {
        this.active = event.url;
        for (let i = 0; i < this.options.length; i++)
          if (this.options[i].url != null && event.url == this.options[i].url) {
            this.active = i;
            this.activeChange.emit(this.active);
          }

      }

    });
  }

  ngOnInit() {
    if (typeof this.active == 'undefined') {
      this.active = '0';
      this.activeChange.emit(this.active);
    }
  }

  ngOnChanges() { }

  selectItem(i) {
    this.active = i;
    this.activeChange.emit(i);
    this.isOpen = !this.isOpen;
    if (this.options[i].url != null) {
      this.router.navigate([this.options[i].url]);
    }
  }

  selectItemUser(i) {
    this.active = i;
    this.activeChange.emit(i);
    this.isOpen = !this.isOpen;
    if (this.userOptions[i].url != null) {
      this.router.navigate([this.userOptions[i].url]);
    }
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }
}
