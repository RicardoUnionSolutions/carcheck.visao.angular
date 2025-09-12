import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { startWith, distinctUntilChanged } from 'rxjs/operators';
import { UtilMasks } from '../../utils/util-masks';
import { LaudoService } from '../../service/laudo.service';

@Component({
  selector: 'app-form-laudo-adicional',
  templateUrl: './form-laudo-adicional.component.html',
  styleUrls: ['./form-laudo-adicional.component.scss']
})
export class FormLaudoAdicionalComponent implements OnInit {

  form = new FormGroup({
    placa: new FormControl('', [Validators.required, Validators.minLength(7)]),
    proprietario: new FormControl('', [Validators.required]),
    telefone: new FormControl('', [Validators.required]),
    uf: new FormControl('', [Validators.required]),
    cidade: new FormControl('', [Validators.required]),
  });

  mask = {
    telefone: {mask: UtilMasks.tel, guide: false}
  }
  
  @Input() valor;
  @Output() formValueChange = new EventEmitter();
  @Input() formValue = {
    placa: '',
    proprietario: '',
    telefone: '',
    uf: '',
    cidade: '',
  };
  @Input() adicionarLaudo = false;
  @Output() adicionarLaudoChange = new EventEmitter();
  @Output() formStatus = new EventEmitter();

  ufOptions = this.laudoService.getUfOptions();

  cidadeOptions = [];


  constructor(private laudoService: LaudoService) { }

  ngOnInit(): void {
    this.form.patchValue(this.formValue);
    this.form.controls.uf.valueChanges
      .pipe(startWith(this.form.value.uf))
      .subscribe(uf => this.formatarOptionscidade(uf) );
    this.form.valueChanges.pipe().subscribe(v => this.formValueChange.emit(this.formValue = v));
    this.form.statusChanges.pipe(distinctUntilChanged()).subscribe( v => this.formStatus.emit(v) );
  }

  formatarOptionscidade(uf:string) {
    this.cidadeOptions = this.laudoService.getCidadeOptions(uf);
    if(!this.cidadeOptions.find(c => c.value == this.form.value.cidade)) {
      this.form.controls.cidade.patchValue('');
    }
  }

  toggleAdicionarLaudo() {
    this.adicionarLaudoChange.emit(this.adicionarLaudo = !this.adicionarLaudo);
  }

}
