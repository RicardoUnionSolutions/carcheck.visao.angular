import { Component, OnInit } from '@angular/core';
import { dadosConsultaService } from '../../service/dados-consulta.service';

@Component({
  selector: 'consulta-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  radioExpectativa:any = null;
  msgFeedback:string = '';
  loading:boolean = false;
  statusEnvio:number = 0;

  constructor( private dadosConsultaService: dadosConsultaService) { }

  ngOnInit() {
  }

  enviarFeedback(){
    this.loading = true;

    this.dadosConsultaService.feedback(this.radioExpectativa, this.msgFeedback).subscribe(
      result =>{
        this.loading = false;
        this.statusEnvio = 1;
        this.msgFeedback = '';
      }, 
      error => {
        this.loading = false;
        this.statusEnvio = -1;
      }
    );
  }


}
