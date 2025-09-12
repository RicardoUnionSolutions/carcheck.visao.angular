import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { startWith, distinctUntilChanged } from 'rxjs/operators';
import { UtilMasks } from '../../utils/util-masks';
import { LaudoService } from '../../service/laudo.service';

@Component({
  selector: 'app-form-laudo',
  templateUrl: './form-laudo.component.html',
  styleUrls: ['./form-laudo.component.scss']
})
export class FormLaudoComponent implements OnInit {



  form = new FormGroup({
    placa: new FormControl('', [Validators.required, Validators.minLength(7)]),
    proprietario: new FormControl('', [Validators.required]),
    telefone: new FormControl('', [Validators.required]),
    uf: new FormControl('', [Validators.required]),
    cidade: new FormControl('', [Validators.required]),
  });

  @Output() formValueChange = new EventEmitter();
  @Input() formValue = {
    placa: '',
    proprietario: '',
    telefone: '',
    uf: '',
    cidade: '',
  };
  @Output() formStatus = new EventEmitter();


  ufOptions = this.laudoService.getUfOptions();

  cidadeOptions = [];

  mask = {
    placa: {mask: UtilMasks.placa, guide: false},
    telefone: {mask: UtilMasks.tel, guide: false}
  }

  constructor(private laudoService: LaudoService) { }

  ngOnInit(): void {
    this.form.patchValue(this.formValue);
    this.form.controls.uf.valueChanges.subscribe(uf => this.formatarOptionscidade(uf) );
    this.form.valueChanges.pipe().subscribe(v => this.formValueChange.emit(this.formValue = v));
    this.form.statusChanges.pipe(distinctUntilChanged()).subscribe( v => this.formStatus.emit(v) );
  }

  formatarOptionscidade(uf:string) {
    this.cidadeOptions = this.laudoService.getCidadeOptions(uf);
    if(!this.cidadeOptions.find(c => c.value == this.form.value.cidade)) {
      this.form.controls.cidade.patchValue('');
    }
  }

}
