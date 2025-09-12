import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaDuasEtapasService {

  private subject = null;

  constructor() {
    this.subject = new Subject<any>();
  }

  publicarAtualizacaoConsultaDuasEtapas( obj ) {
    this.subject.next( obj );
  }

  atualizacoesConsultaDuasEtapas(): Observable<any> {
    return this.subject.asObservable();
  }
}
