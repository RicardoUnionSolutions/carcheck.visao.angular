import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DemoNavigationComponent } from "../demo-navigation/demo-navigation.component";

@Component({
  selector: "app-step-demo",
  standalone: true,
  imports: [CommonModule, DemoNavigationComponent],
  templateUrl: "./step-demo.component.html",
  styleUrls: ["./step-demo.component.scss"],
})
export class StepDemoComponent {
  currentStep = 1;
  totalSteps = 4;

  steps = [
    {
      id: 1,
      title: "Informações Básicas",
      description: "Preencha seus dados pessoais",
      completed: false,
      active: true,
    },
    {
      id: 2,
      title: "Verificação",
      description: "Confirme suas informações",
      completed: false,
      active: false,
    },
    {
      id: 3,
      title: "Pagamento",
      description: "Escolha a forma de pagamento",
      completed: false,
      active: false,
    },
    {
      id: 4,
      title: "Confirmação",
      description: "Finalize seu cadastro",
      completed: false,
      active: false,
    },
  ];

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.steps[this.currentStep - 1].completed = true;
      this.steps[this.currentStep - 1].active = false;
      this.currentStep++;
      this.steps[this.currentStep - 1].active = true;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.steps[this.currentStep - 1].active = false;
      this.currentStep--;
      this.steps[this.currentStep - 1].active = true;
      this.steps[this.currentStep - 1].completed = false;
    }
  }

  goToStep(stepNumber: number) {
    if (
      stepNumber <= this.currentStep ||
      this.steps[stepNumber - 1].completed
    ) {
      this.steps.forEach((step, index) => {
        step.active = index === stepNumber - 1;
        step.completed = index < stepNumber - 1;
      });
      this.currentStep = stepNumber;
    }
  }

  resetSteps() {
    this.currentStep = 1;
    this.steps.forEach((step, index) => {
      step.completed = false;
      step.active = index === 0;
    });
  }
}
