import { Component, OnInit, Input, HostBinding, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoginService } from '../../../service/login.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGDirective } from '../../../directives/inline-svg.directive';

@Component({
    selector: 'navbar-dropdown',
    templateUrl: './navbar-dropdown.component.html',
    styleUrls: ['./navbar-dropdown.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, InlineSVGDirective]
})
export class NavbarDropdownComponent implements OnInit {

  @Input() options:any[];
  @Input() title:string;
  @Input() img:string;
  @Input() disabled:boolean = false;
  @Input() menuUrl:any = {routerUrl:'/', url:''};
  show = false;
  @Output() showChange = new EventEmitter();

  @HostBinding('class.active') activeClass = '';

  constructor(private route: Router, private login: LoginService) {
    this.route.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(r => {
      this.show = false;
      this.changeActiveClass();
    });

    this.login.getLogIn().subscribe(l => {
      this.show = false;
      this.changeActiveClass();
    });
  }

  ngOnInit() {
  }

  toggleCollapse(){
    this.show = !this.show;
    this.changeActiveClass();
    this.showChange.emit(this.show);
  }

  changeActiveClass(){
    if(this.show==true){
      this.activeClass = 'active';
    } else {
      this.activeClass = '';
    }
  }

  ngOnChanges(){
    this.changeActiveClass();
  }

}
