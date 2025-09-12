import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';

@Injectable()
export class TokenService {
  private log = new Subject();
  jwtHelper:any;
  constructor() { 
    this.jwtHelper = new JwtHelperService();
  }

  decodeToken(valor: any){
    let token = localStorage.getItem(valor);
    if(token == null || token == 'null') 
      return null;
    else
      return this.jwtHelper.decodeToken(token).iss;
  }



  getTokenLogin(){
    return localStorage.getItem("tokenLogin");
  }

}
