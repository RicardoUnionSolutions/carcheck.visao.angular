import { ViewportScroller, NgOptimizedImage } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { AppearOnScrollDirective } from "../../directives/appear-on-scroll.directive";

@Component({
  selector: "app-sobre",
  templateUrl: "./sobre.component.html",
  styleUrls: ["./sobre.component.scss"],
  standalone: true,
  imports: [AppearOnScrollDirective, RouterModule, NgOptimizedImage],
})
export class SobreComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private viewportScroller: ViewportScroller
  ) {}

  scrollToElement(): void {
    const element = document.querySelector("#como_funciona");
    if (element)
      element.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
