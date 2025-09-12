import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'login-user-card',
  templateUrl: './login-user-card.component.html',
  styleUrls: ['./login-user-card.component.scss']
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
