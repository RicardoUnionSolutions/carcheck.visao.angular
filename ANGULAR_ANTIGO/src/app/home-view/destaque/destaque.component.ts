import { Component, OnInit, TemplateRef,Renderer2  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-destaque',
  templateUrl: './destaque.component.html',
  styleUrls: ['./destaque.component.scss']
})
export class DestaqueComponent implements OnInit {
  compraTesteForm: FormGroup;
  modalForm: FormGroup;
  modalRef?: BsModalRef;


  strings = ["Leilão.", "Batidas.", "Débitos.", "Multas.", "Recall.", "Restrições."];
  displayedText = '';
  currentStringIndex = 0;
  currentCharIndex = 0;
  isDeleting = false;
  typingSpeed = 100;
  deletingSpeed = 50;
  pauseBetweenStrings = 1000;



  constructor(private fb: FormBuilder,  private router: Router, private modalService: BsModalService, private renderer: Renderer2) {}

  ngOnInit(): void {

    this.type();

    this.compraTesteForm = this.fb.group({
      placa: ['', [Validators.required, Validators.pattern(/[A-z]{3}-\d[A-j0-9]\d{2}/)]],
      tokenRecaptcha: ['', Validators.required]
    });

    this.modalForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Carcheck Brasil",
      "url": "https://carcheckbrasil.com.br/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://carcheckbrasil.com.br/consulta-placa-veiculo?placa={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    };

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    this.renderer.appendChild(document.head, script);
  }

  onSubmit(template: TemplateRef<any>): void {
    if (this.compraTesteForm.valid) {

      this.openModal(template);

      // const formValue = this.compraTesteForm.value;
      // this.router.navigate(['/consulta-teste/'+formValue.placa+'/'+formValue.tokenRecaptcha]);
    }
  }

  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
  }

  onContinue(): void {
    if (this.modalForm.valid) {
      const formValue = this.compraTesteForm.value;
      const formUser = this.modalForm.value;
      this.modalRef?.hide();
      this.router.navigate(['/consulta-teste/'+formValue.placa+'/'+ formUser.email + '/' + formUser.name + '/' + formValue.tokenRecaptcha]);
    } else {
      this.modalForm.markAllAsTouched();
  }
  }

  comprar(): void {
    const formValue = this.compraTesteForm.value;
    if(formValue.placa != ""){
      this.router.navigate(['/comprar-consulta-placa/'+formValue.placa]);
    } else {
      this.router.navigate(['/comprar-consulta-placa'])
    }
  }

  maskcaraPlaca(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3);
    }
    input.value = value;
    this.compraTesteForm.controls['placa'].setValue(value);
  }

  onCaptchaSuccess(token: string): void {
    this.compraTesteForm.controls['tokenRecaptcha'].setValue(token);
  }

  scrollToElement(): void {
    const element = document.querySelector("#premios")
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  type() {
    const currentString = this.strings[this.currentStringIndex];

    if (this.isDeleting) {
      this.displayedText = currentString.substring(0, this.currentCharIndex - 1);
      this.currentCharIndex--;
    } else {
      this.displayedText = currentString.substring(0, this.currentCharIndex + 1);
      this.currentCharIndex++;
    }

    if (!this.isDeleting && this.currentCharIndex === currentString.length) {
      setTimeout(() => this.isDeleting = true, this.pauseBetweenStrings);
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentStringIndex = (this.currentStringIndex + 1) % this.strings.length;
    }

    const speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
    setTimeout(() => this.type(), speed);
  }


}
