import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";

@Component({
  selector: "app-demo-navigation",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./demo-navigation.component.html",
  styleUrls: ["./demo-navigation.component.scss"],
})
export class DemoNavigationComponent {
  constructor(private router: Router) {}

  voltarParaBiblioteca() {
    this.router.navigate(["/lib/componentes"]);
  }
}
