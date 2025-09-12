import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DemoNavigationComponent } from "../demo-navigation/demo-navigation.component";

@Component({
  selector: "app-ck-progress-demo",
  standalone: true,
  imports: [CommonModule, FormsModule, DemoNavigationComponent],
  templateUrl: "./ck-progress-demo.component.html",
  styleUrls: ["./ck-progress-demo.component.scss"],
})
export class CkProgressDemoComponent {
  // Valores das barras de progresso
  progressValue = 45;
  progressAnimated = 0;
  progressStriped = 30;
  progressMultiple = [25, 50, 75];

  // Configurações
  progressColor = "#ecda26";
  progressSize = "medium";
  showPercentage = true;
  isAnimated = false;

  // Simulação de progresso
  isSimulating = false;
  simulationProgress = 0;

  updateProgress(value: number) {
    this.progressValue = Math.max(0, Math.min(100, value));
  }

  startAnimation() {
    this.isAnimated = true;
    this.progressAnimated = 0;

    const interval = setInterval(() => {
      this.progressAnimated += 2;
      if (this.progressAnimated >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.isAnimated = false;
          this.progressAnimated = 0;
        }, 1000);
      }
    }, 50);
  }

  simulateProgress() {
    this.isSimulating = true;
    this.simulationProgress = 0;

    const interval = setInterval(() => {
      this.simulationProgress += 5;
      if (this.simulationProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.isSimulating = false;
          this.simulationProgress = 0;
        }, 1000);
      }
    }, 200);
  }

  resetAll() {
    this.progressValue = 0;
    this.progressAnimated = 0;
    this.progressStriped = 0;
    this.progressMultiple = [0, 0, 0];
    this.simulationProgress = 0;
    this.isAnimated = false;
    this.isSimulating = false;
  }

  getProgressColor(value: number): string {
    if (value < 30) return "#dc3545"; // Vermelho
    if (value < 70) return "#ffc107"; // Amarelo
    return "#28a745"; // Verde
  }
}
