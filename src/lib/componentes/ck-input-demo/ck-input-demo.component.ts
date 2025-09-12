import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DemoNavigationComponent } from "../demo-navigation/demo-navigation.component";

@Component({
  selector: "app-ck-input-demo",
  standalone: true,
  imports: [CommonModule, FormsModule, DemoNavigationComponent],
  templateUrl: "./ck-input-demo.component.html",
  styleUrls: ["./ck-input-demo.component.scss"],
})
export class CkInputDemoComponent {
  // Exemplos de uso do CK Input
  inputValue = "";
  emailValue = "";
  passwordValue = "";
  requiredValue = "";

  // Estados para demonstração
  showPassword = false;
  inputError = false;

  onInputChange(value: string) {
    console.log("Input changed:", value);
  }

  onEmailBlur() {
    // Validação simples de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.inputError = !emailRegex.test(this.emailValue);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  validateRequired() {
    this.inputError = !this.requiredValue.trim();
  }
}
