import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VariableGlobal } from './variable.global.service';
import { TokenService } from './token.service';
import { BehaviorSubject, Observable } from 'rxjs';

export type MODAL_BTN = {
  text?:string,status?:number|string,event?:any,show?:boolean
}

export type MODAL_MSG = {
  status?:number|string, 
  title:string, 
  text?:string,
  html?:any,
  cancel?:MODAL_BTN,
  ok?:MODAL_BTN
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: any[] = [];
  private msg;

  constructor(private http: HttpClient, private variableGlobal: VariableGlobal, private tokenService: TokenService){
    this.resetMsg();
  }

  add(modal: any) {
      // add modal to array of active modals
      this.modals.push(modal);
  }

  remove(id: string) {
      // remove modal from array of active modals
      this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string) {
      // open modal specified by id
      let modal: any = this.modals.filter(x => x.id === id)[0];
      modal.open();
  }

  close(id: string) {
      // close modal specified by id
      let modal: any = this.modals.filter(x => x.id === id)[0];
      modal.close();
  }

  getMsg():Observable<any>{
    return this.msg.asObservable();
  }

  resetMsg(){
    let msg = {
      status:'', 
      title:'', 
      text:'',
      html: false,
      cancel:{ 
        text:'Fechar',
        status: null,
        event: null,
        show: true
      },
      ok:{ 
        text:'Confirmar',
        status: null,
        event: null,
        show: true
      }
    };
    
    if(this.msg == null)
      this.msg = new BehaviorSubject(msg);
    else
      this.msg.next(msg);
  }


  setMsg(msg){
    let mensagem = {
      status: msg.status || 4, 
      title: msg.title || '', 
      text: msg.text || '',
      html: msg.html || false,
      cancel:{ 
        text:'Fechar',
        status: -1,
        event: null,
        show: true
      },
      ok:{ 
        text:'Confirmar',
        status: 0,
        event: null,
        show: true
      }
    }

    if(msg.cancel!=null)
      mensagem.cancel = { 
        text: msg.cancel.text || 'Fechar',
        status: msg.cancel.status || -1,
        event: msg.cancel.event || null,
        show: (msg.cancel.show===false || msg.cancel.show===true ? msg.cancel.show : true)
      };
  
    if(msg.ok!=null)
      mensagem.ok = { 
        text: msg.ok.text || 'Confirmar',
        status: msg.ok.status || 0,
        event: msg.ok.event || null,
        show: (msg.ok.show===false || msg.ok.show===true ? msg.ok.show : true)
      };
      this.msg.next(mensagem);
  }

  openLoading(desc){
    if(desc) this.setMsg(desc);
    this.open('default-loading');
  }

  closeLoading(){
    this.resetMsg();
    this.close('default-loading');
  }

  openModalMsg(desc:MODAL_MSG){
    if(desc) this.setMsg(desc);
    this.open('default-modal-msg');
  }

  closeModalMsg(){
    this.resetMsg();
    this.close('default-modal-msg');
  }
/*
  rdstationEvento(email:String, nomeEvento:String){
    return this.http.get(this.variableGlobal.getUrl("")+"rd/eventoPadrao?nomeEvento="+nomeEvento+"&email="+email).toPromise();
  }
  
  rdstationEventoPedido(email:String, nomeEvento:String, pedido:String){
    return this.http.get(this.variableGlobal.getUrl("")+"rd/eventoFechamentoPedido?nomeEvento="+nomeEvento+"&email="+email+"&pedido="+pedido).toPromise();
  }

  rdstationEventoComNome(email:String, nomeEvento:String, nome:String){
    return this.http.get(this.variableGlobal.getUrl("")+"rd/eventoTesteHomeComNome?nomeEvento="+nomeEvento+"&email="+email+"&nome="+nome).toPromise();
  }

  rdstationEventoOportunidade(email:String, nomeEvento:String, placa:String){
    return this.http.get(this.variableGlobal.getUrl("")+"rd/eventoOportunidade?nomeEvento="+nomeEvento+"&email="+email+"&placa="+placa).toPromise();
  }
*/
}