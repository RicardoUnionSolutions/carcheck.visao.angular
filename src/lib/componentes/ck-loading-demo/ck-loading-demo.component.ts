import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DemoNavigationComponent } from "../demo-navigation/demo-navigation.component";
import { CkLoadingComponent } from "../../../app/components/ck-loading/ck-loading.component";
import { ModalService } from "../../../app/service/modal.service";

@Component({
  selector: "app-ck-loading-demo",
  standalone: true,
  imports: [CommonModule, DemoNavigationComponent, CkLoadingComponent],
  templateUrl: "./ck-loading-demo.component.html",
  styleUrls: ["./ck-loading-demo.component.scss"],
})
export class CkLoadingDemoComponent {
  // Estados dos loadings
  showSpinner = false;
  showDots = false;
  showBars = false;
  showPulse = false;
  showOverlay = false;
  showOriginalLoading = false;

  // Configurações
  loadingText = "Carregando...";
  loadingSize = "medium";
  loadingColor = "#ecda26";

  // Simulação de carregamento
  isLoading = false;
  progress = 0;

  constructor(private modalService: ModalService) {}

  toggleSpinner() {
    this.showSpinner = !this.showSpinner;
  }

  toggleDots() {
    this.showDots = !this.showDots;
  }

  toggleBars() {
    this.showBars = !this.showBars;
  }

  togglePulse() {
    this.showPulse = !this.showPulse;
  }

  toggleOverlay() {
    this.showOverlay = !this.showOverlay;
  }

  simulateLoading() {
    this.isLoading = true;
    this.progress = 0;

    const interval = setInterval(() => {
      this.progress += 10;
      if (this.progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.isLoading = false;
          this.progress = 0;
        }, 500);
      }
    }, 200);
  }

  toggleOriginalLoading() {
    this.showOriginalLoading = !this.showOriginalLoading;
    if (this.showOriginalLoading) {
      this.modalService.openLoading({
        title: "Carregando...",
        text: "Aguarde enquanto processamos sua solicitação",
      });
    } else {
      this.modalService.closeLoading();
    }
  }

  resetAll() {
    this.showSpinner = false;
    this.showDots = false;
    this.showBars = false;
    this.showPulse = false;
    this.showOverlay = false;
    this.isLoading = false;
    this.progress = 0;
    if (this.showOriginalLoading) {
      this.modalService.closeLoading();
      this.showOriginalLoading = false;
    }
  }
}
