import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CkInputComponent } from "../../ck-input/ck-input.component";
import { CkSelectComponent } from "../../ck-select/ck-select.component";
import { TabNavComponent } from "../../tab-nav/tab-nav.component";
import {
  Validators,
  UntypedFormControl,
  UntypedFormGroup,
  UntypedFormBuilder,
} from "@angular/forms";
import { UtilValidators } from "../../../utils/util-validators";
import { UtilMasks } from "../../../utils/util-masks";
import { UtilForms } from "../../../utils/util-forms";
import { LoginService } from "../../../service/login.service";
import { CepService } from "../../../service/cep.service";
import { PessoaService } from "../../../service/pessoa.service";
import { distinctUntilChanged, filter, debounceTime } from "rxjs/operators";

export interface CadastroUsuario {
  cnpj?: string;
  cpf?: string;
  cep?: string;
  numero?: string;
  endereco?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  telefone?: string;
  dataNascimento?: string;
  tipoPessoa?: number | string;
  formCadastro?: UntypedFormGroup | null;
}

  @Component({
      selector: "cadastrar-dados-usuario",
      templateUrl: "./cadastrar-dados-usuario.component.html",
      styleUrls: ["./cadastrar-dados-usuario.component.scss"],
      standalone: true,
      imports: [CommonModule, CkInputComponent, CkSelectComponent, TabNavComponent]
  })
export class CadastrarDadosUsuarioComponent implements OnInit {
  formMask: any;
  form: UntypedFormGroup;
  ufOptions: any = UtilForms.options.estado;
  loadingEndereco = false;

  usuario: any;
  currentTabTipoIndefinido: "0";
  logou = false;
  email: any;
  login: any;

  @Input() cadastro: CadastroUsuario = {
    cnpj: "",
    cpf: "",
    cep: "",
    numero: "",
    endereco: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    telefone: "",
    dataNascimento: "",
    tipoPessoa: 0,
    formCadastro: null,
  };

  @Output() cadastroChange = new EventEmitter<CadastroUsuario>();

  emailMarketing: any = { acao: "" };

  constructor(
    private loginService: LoginService,
    private cepService: CepService,
    private fb: UntypedFormBuilder,
    private pessoaService: PessoaService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      cep: ["", [Validators.required, Validators.minLength(10)]],
      endereco: ["", Validators.required],
      bairro: ["", Validators.required],
      uf: ["", Validators.required],
      cidade: ["", Validators.required],
      numero: ["", Validators.required],
      telefone: ["", Validators.required],
      complemento: [""],
      dataNascimento: ["", Validators.required],
    });

    this.cadastro.formCadastro = this.form;
    this.tipoPessoaChange();

    this.form.valueChanges.subscribe((v) => {
      Object.assign(this.cadastro, {
        cnpj: v.cnpj || this.cadastro.cnpj,
        cpf: v.cpf || this.cadastro.cpf,
        cep: v.cep || this.cadastro.cep,
        numero: v.numero || this.cadastro.numero,
        endereco: v.endereco || this.cadastro.endereco,
        complemento: v.complemento || this.cadastro.complemento,
        bairro: v.bairro || this.cadastro.bairro,
        cidade: v.cidade || this.cadastro.cidade,
        uf: v.uf || this.cadastro.uf,
        telefone: v.telefone || this.cadastro.telefone,
        dataNascimento: v.dataNascimento || this.cadastro.dataNascimento,
        tipoPessoa: this.cadastro.tipoPessoa,
        formCadastro: this.form,
      });

      this.cadastroChange.emit(this.cadastro);
    });

    this.loginService.getLogIn().subscribe((v) => {
      this.login = v;
    });

    this.cadastro.tipoPessoa =
      this.login?.cliente?.tipoPessoa === "JURIDICA" ? "1" : "0";
    this.email = this.login?.email;
    this.logou = this.loginService.getTokenLogin() != null;

    this.formMask = {
      cep: { mask: UtilMasks.cep, guide: false },
      telefone: { mask: UtilMasks.tel, guide: false },
      cpf: { mask: UtilMasks.cpf, guide: false },
      cnpj: { mask: UtilMasks.cnpj, guide: false },
      data: { mask: UtilMasks.dataBr, gruide: false },
    };

    this.ufOptions = UtilForms.options.estado;

    this.form.controls.cep.valueChanges
      .pipe(
        debounceTime(600),
        filter((v) => v && v.length >= 10),
        distinctUntilChanged()
      )
      .subscribe((v) => {
        this.loadingEndereco = true;
        this.cepService.search(v).then(
          (response) => {
            if (!response.erro) {
              const f = this.form.value;
              this.form.patchValue({
                endereco: response.logradouro ?? f.endereco,
                cidade: response.localidade ?? f.cidade,
                bairro: response.bairro ?? f.bairro,
                uf: response.uf ?? f.uf,
              });
            }
            this.loadingEndereco = false;
          },
          () => {
            this.loadingEndereco = false;
          }
        );
      });
  }

  tipoPessoaChange() {
    if (this.cadastro.tipoPessoa == 1) {
      this.form.setControl(
        "cnpj",
        new UntypedFormControl(this.cadastro.cnpj || "", UtilValidators.cnpj)
      );
      this.form.removeControl("cpf");
    } else {
      this.form.setControl(
        "cpf",
        new UntypedFormControl(this.cadastro.cpf || "", UtilValidators.cpf)
      );
      this.form.removeControl("cnpj");
    }
  }
}
