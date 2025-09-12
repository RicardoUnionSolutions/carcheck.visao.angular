import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DemoNavigationComponent } from "../demo-navigation/demo-navigation.component";

@Component({
  selector: "app-ck-select-demo",
  standalone: true,
  imports: [CommonModule, FormsModule, DemoNavigationComponent],
  templateUrl: "./ck-select-demo.component.html",
  styleUrls: ["./ck-select-demo.component.scss"],
})
export class CkSelectDemoComponent {
  // Estados dos selects
  selectedOption = "";
  selectedMultiple: string[] = [];
  selectedDisabled = "opcao2";
  selectedError = "";

  // Opções para os selects
  options = [
    { value: "opcao1", label: "Opção 1" },
    { value: "opcao2", label: "Opção 2" },
    { value: "opcao3", label: "Opção 3" },
    { value: "opcao4", label: "Opção 4" },
  ];

  countries = [
    { value: "br", label: "Brasil" },
    { value: "us", label: "Estados Unidos" },
    { value: "ca", label: "Canadá" },
    { value: "mx", label: "México" },
    { value: "ar", label: "Argentina" },
  ];

  states = [
    { value: "sp", label: "São Paulo" },
    { value: "rj", label: "Rio de Janeiro" },
    { value: "mg", label: "Minas Gerais" },
    { value: "rs", label: "Rio Grande do Sul" },
    { value: "pr", label: "Paraná" },
  ];

  // Estados para demonstração
  hasError = false;
  isDisabled = false;

  onSelectChange(value: string) {
    console.log("Select changed:", value);
    this.hasError = false;
  }

  onMultipleChange(values: string[]) {
    console.log("Multiple select changed:", values);
  }

  validateRequired() {
    this.hasError = !this.selectedError.trim();
  }

  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }
}
