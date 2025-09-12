import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DemoNavigationComponent } from "../demo-navigation/demo-navigation.component";

@Component({
  selector: "app-ck-modal-demo",
  standalone: true,
  imports: [CommonModule, DemoNavigationComponent],
  templateUrl: "./ck-modal-demo.component.html",
  styleUrls: ["./ck-modal-demo.component.scss"],
})
export class CkModalDemoComponent {
  // Estados dos modais
  showBasicModal = false;
  showLargeModal = false;
  showConfirmModal = false;
  showFormModal = false;

  // Dados do formulário
  formData = {
    nome: "",
    email: "",
    mensagem: "",
  };

  openModal(modalType: string) {
    this.closeAllModals();

    switch (modalType) {
      case "basic":
        this.showBasicModal = true;
        break;
      case "large":
        this.showLargeModal = true;
        break;
      case "confirm":
        this.showConfirmModal = true;
        break;
      case "form":
        this.showFormModal = true;
        break;
    }
  }

  closeAllModals() {
    this.showBasicModal = false;
    this.showLargeModal = false;
    this.showConfirmModal = false;
    this.showFormModal = false;
  }

  confirmAction() {
    alert("Ação confirmada!");
    this.closeAllModals();
  }

  submitForm() {
    if (this.formData.nome && this.formData.email) {
      alert(
        `Formulário enviado!\nNome: ${this.formData.nome}\nEmail: ${this.formData.email}`
      );
      this.formData = { nome: "", email: "", mensagem: "" };
      this.closeAllModals();
    } else {
      alert("Por favor, preencha os campos obrigatórios.");
    }
  }
}
