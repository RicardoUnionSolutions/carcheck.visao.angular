import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DemoNavigationComponent } from "../demo-navigation/demo-navigation.component";

@Component({
  selector: "app-ck-counter-demo",
  standalone: true,
  imports: [CommonModule, DemoNavigationComponent],
  templateUrl: "./ck-counter-demo.component.html",
  styleUrls: ["./ck-counter-demo.component.scss"],
})
export class CkCounterDemoComponent {
  // Contadores
  counter1 = 0;
  counter2 = 150;
  counter3 = 2500;
  counter4 = 0;

  // Configurações
  prefix = "";
  suffix = "";
  duration = 2000;
  isAnimating = false;

  // Contadores de exemplo
  stats = [
    { label: "Usuários", value: 1250, prefix: "", suffix: "+" },
    { label: "Vendas", value: 45, prefix: "R$ ", suffix: "K" },
    { label: "Produtos", value: 89, prefix: "", suffix: "" },
    { label: "Avaliações", value: 4.8, prefix: "", suffix: " ⭐" },
  ];

  animateCounter(counter: string) {
    this.isAnimating = true;

    const targetValue = parseInt(counter);
    const startValue = 0;
    const increment = targetValue / 50;
    let currentValue = startValue;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(timer);
        this.isAnimating = false;
      }

      switch (counter) {
        case "counter1":
          this.counter1 = Math.floor(currentValue);
          break;
        case "counter2":
          this.counter2 = Math.floor(currentValue);
          break;
        case "counter3":
          this.counter3 = Math.floor(currentValue);
          break;
        case "counter4":
          this.counter4 = Math.floor(currentValue);
          break;
      }
    }, 40);
  }

  resetCounters() {
    this.counter1 = 0;
    this.counter2 = 0;
    this.counter3 = 0;
    this.counter4 = 0;
  }

  animateAll() {
    this.resetCounters();
    setTimeout(() => this.animateCounter("150"), 100);
    setTimeout(() => this.animateCounter("2500"), 200);
    setTimeout(() => this.animateCounter("89"), 300);
    setTimeout(() => this.animateCounter("4.8"), 400);
  }
}
