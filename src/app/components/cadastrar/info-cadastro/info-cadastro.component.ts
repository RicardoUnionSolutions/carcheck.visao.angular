import { Component, OnInit, Input } from '@angular/core';
import { TokenService } from '../../../service/token.service';

@Component({
    selector: 'info-cadastro',
    templateUrl: './info-cadastro.component.html',
    styleUrls: ['./info-cadastro.component.scss'],
    standalone: true
})
export class InfoCadastroComponent implements OnInit {

  
  @Input() dadosUsuario = {
    email:'',
    nome:'',
    status:'',
    documento:'',
    bairro:'',
    cep:'',
    cidade:'',
    complemento:'',
    endereco:'',
    estado:'',
    numero:'',
    razaoSocial:'',
    tipoPessoa:''
  } 

  constructor(private tokenService:TokenService) { 
    this.carregarDadosUsuarioLogado();
  }

 
  
  //Carregar dados Usuario

  ngOnInit() {
  }

    //Carrega o token e decodifica
    carregarDadosUsuarioLogado(){

      const token = this.tokenService.getToken();
      if(token){
        const dados = this.tokenService.decodeToken();
        if(!dados) return;
        this.dadosUsuario.email = dados.email;
        this.dadosUsuario.nome = dados.nome;
        this.dadosUsuario.status = dados.status;
        this.dadosUsuario.documento = dados.cliente.documento;
        this.dadosUsuario.bairro = dados.endereco.bairro;
        this.dadosUsuario.cep= dados.endereco.cep;
        this.dadosUsuario.cidade= dados.endereco.cidade;
        this.dadosUsuario.complemento= dados.endereco.complemento;
        this.dadosUsuario.endereco= dados.endereco.endereco;
        this.dadosUsuario.estado= dados.endereco.estado;
        this.dadosUsuario.numero= dados.endereco.numero;

        this.dadosUsuario.tipoPessoa = dados.cliente.tipoPessoa;
        this.dadosUsuario.razaoSocial = dados.razaoSocial;

      }
    }

}