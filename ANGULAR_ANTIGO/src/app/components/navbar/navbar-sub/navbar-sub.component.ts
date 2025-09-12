import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../service/login.service';

@Component({
  selector: 'navbar-sub',
  templateUrl: './navbar-sub.component.html',
  styleUrls: ['./navbar-sub.component.scss']
})
export class NavbarSubComponent implements OnInit {

  @Input() options: any;
  @Input() active;
  @Output() activeChange = new EventEmitter();

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
    this.activeChange.emit(i);//
    if (this.options[i].url != null) {
      this.router.navigate([this.options[i].url]);
    }
  }

}
