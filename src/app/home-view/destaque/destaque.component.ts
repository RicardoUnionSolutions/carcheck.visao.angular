import { Component, OnInit, Renderer2 } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { NgxCaptchaModule } from "ngx-captcha";
import { AppearRightOnScrollDirective } from "../../directives/appearRight-on-scroll.directive";

@Component({
  selector: "app-destaque",
  templateUrl: "./destaque.component.html",
  styleUrls: ["./destaque.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    AppearRightOnScrollDirective,
  ],
})
export class DestaqueComponent implements OnInit {
  compraTesteForm: FormGroup;
  modalForm: FormGroup;
  showModal = false;

  strings = [
    "Leilão.",
    "Batidas.",
    "Débitos.",
    "Multas.",
    "Recall.",
    "Restrições.",
  ];
  displayedText = "";
  currentStringIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;
  typingSpeed = 100;
  deletingSpeed = 50;
  pauseBetweenStrings = 1000;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.initializeTypingAnimation();
    this.addStructuredData();
  }

  private initializeForms(): void {
    this.compraTesteForm = this.fb.group({
      placa: [
        "",
        [Validators.required, Validators.pattern(/^[A-Z]{3}-\d[A-Z0-9]\d{2}$/)],
      ],
      tokenRecaptcha: ["", Validators.required],
    });

    this.modalForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  private initializeTypingAnimation(): void {
    this.type();
  }

  private addStructuredData(): void {
    try {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Carcheck Brasil",
        url: "https://carcheckbrasil.com.br/",
        potentialAction: {
          "@type": "SearchAction",
          target:
            "https://carcheckbrasil.com.br/consulta-placa-veiculo?placa={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };

      const script = this.renderer.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      this.renderer.appendChild(document.head, script);
    } catch (error) {
      console.warn("Erro ao adicionar dados estruturados:", error);
    }
  }

  onSubmit(): void {
    if (this.compraTesteForm.valid) {
      this.openModal();
    } else {
      this.compraTesteForm.markAllAsTouched();
    }
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onContinue(): void {
    if (this.modalForm.valid) {
      const formValue = this.compraTesteForm.value;
      const formUser = this.modalForm.value;
      this.closeModal();

      const route = [
        "/consulta-teste/",
        formValue.placa,
        "/",
        encodeURIComponent(formUser.email),
        "/",
        encodeURIComponent(formUser.name),
        "/",
        formValue.tokenRecaptcha,
      ].join("");

      this.router.navigate([route]);
    } else {
      this.modalForm.markAllAsTouched();
    }
  }

  comprar(): void {
    const formValue = this.compraTesteForm.value;
    const placa = formValue.placa?.trim();

    if (placa && placa.length > 0) {
      this.router.navigate(["/comprar-consulta-placa/", placa]);
    } else {
      this.router.navigate(["/comprar-consulta-placa"]);
    }
  }

  maskcaraPlaca(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (value.length > 3) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    }

    input.value = value;
    this.compraTesteForm.patchValue({ placa: value });
  }

  onCaptchaSuccess(token: string): void {
    this.compraTesteForm.patchValue({ tokenRecaptcha: token });
  }

  scrollToElement(): void {
    try {
      const element = document.querySelector("#premios");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } catch (error) {
      console.warn("Erro ao fazer scroll:", error);
    }
  }

  private type(): void {
    try {
      const currentString = this.strings[this.currentStringIndex];

      if (this.isDeleting) {
        this.displayedText = currentString.substring(
          0,
          this.currentCharIndex - 1
        );
        this.currentCharIndex--;
      } else {
        this.displayedText = currentString.substring(
          0,
          this.currentCharIndex + 1
        );
        this.currentCharIndex++;
      }

      if (!this.isDeleting && this.currentCharIndex === currentString.length) {
        setTimeout(() => (this.isDeleting = true), this.pauseBetweenStrings);
      } else if (this.isDeleting && this.currentCharIndex === 0) {
        this.isDeleting = false;
        this.currentStringIndex =
          (this.currentStringIndex + 1) % this.strings.length;
      }

      const speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
      setTimeout(() => this.type(), speed);
    } catch (error) {
      console.warn("Erro na animação de digitação:", error);
    }
  }
}
