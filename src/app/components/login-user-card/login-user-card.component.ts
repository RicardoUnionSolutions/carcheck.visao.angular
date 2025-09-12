import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'login-user-card',
    templateUrl: './login-user-card.component.html',
    styleUrls: ['./login-user-card.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule]
})
export class LoginUserCardComponent implements OnInit {

  login:any;

  @Output() continuar = new EventEmitter();

  constructor(private loginService: LoginService) {
    this.loginService.getLogIn().subscribe(v => this.login = v );
  }

  ngOnInit() {
  }

  next(){
    this.continuar.emit();
  }

}
