import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { CommonModule } from '@angular/common';
import { CkInputComponent } from "../../ck-input/ck-input.component";
import { Validators, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { UtilForms } from "../../../utils/util-forms";
import { UtilMasks } from "../../../utils/util-masks";
import { CepService } from "../../../service/cep.service";
import { UtilValidators } from "../../../utils/util-validators";
import { PessoaService } from "../../../service/pessoa.service";
import { distinctUntilChanged } from "rxjs/operators";

interface CadastroAcesso {
  nome: string;
  email: string;
  senha: string;
  clienteTipoIndefinido: string;
  formAcesso: UntypedFormGroup;
}

@Component({
    selector: "cadastrar-acesso",
    templateUrl: "./cadastrar-acesso.component.html",
    styleUrls: ["./cadastrar-acesso.component.scss"],
    standalone: true,
    imports: [CommonModule, CkInputComponent]
})
export class CadastrarAcessoComponent implements OnInit, OnChanges {
  @Input() cadastro: CadastroAcesso = {
    nome: "",
    email: "",
    senha: "",
    clienteTipoIndefinido: "N",
    formAcesso: new UntypedFormGroup({}), // ✅ correção aqui
  };

  @Output() cadastroChange: EventEmitter<CadastroAcesso> = new EventEmitter();

  tipoClienteIndefinido: any;
  form: UntypedFormGroup;
  ufOptions: any = UtilForms.options.estado;
  formMask: any;
  logou = false;

  emailMarketing: any = {
    acao: "",
  };

  constructor(private fb: UntypedFormBuilder, private pessoaService: PessoaService) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome: [this.cadastro.nome, Validators.required],
      email: [this.cadastro.email, [Validators.required, Validators.email]],
      senha: [
        this.cadastro.senha,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(99),
        ],
      ],
      confirmarEmail: [
        "",
        [
          Validators.required,
          Validators.email,
          UtilValidators.equalValidator("email", false),
        ],
      ],
      confirmarSenha: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(99),
          UtilValidators.equalValidator("senha"),
        ],
      ],
    });

    this.cadastro.formAcesso = this.form;

    this.formMask = {
      cep: { mask: UtilMasks.cep, guide: false },
      telefone: { mask: UtilMasks.tel, guide: false },
      cpf: { mask: UtilMasks.cpf, guide: false },
      data: { mask: UtilMasks.dataBr, guide: false },
    };

    this.form.valueChanges.subscribe(() => {
      this.updateCadastro(this.form.value);
    });

    ["senha", "email", "confirmarSenha", "confirmarEmail"].forEach((field) => {
      this.form.controls[field].valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((v: string) => {
          this.form.controls[field].patchValue(v.replace(/\s/g, ""));
        });
    });

    this.tipoClienteIndefinido = "S";
  }

  ngOnChanges() {
    if (this.form && this.cadastro) this.updateForm(this.cadastro);
  }

  updateForm(v: CadastroAcesso) {
    this.form.patchValue({
      nome: v.nome || "",
      email: v.email || "",
      senha: v.senha || "",
    });
  }

  updateCadastro(v) {
    this.cadastro.nome = v.nome || this.cadastro.nome;
    this.cadastro.email = v.email || this.cadastro.email;
    this.cadastro.senha = v.senha || this.cadastro.senha;
    this.cadastro.formAcesso = this.form;

    this.cadastroChange.emit(this.cadastro);
  }
}
