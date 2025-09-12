import { Component, OnInit } from "@angular/core";
import { AppearOnScrollDirective } from "../../directives/appear-on-scroll.directive";

@Component({
  selector: "app-como-funciona",
  templateUrl: "./como-funciona.component.html",
  styleUrls: ["./como-funciona.component.scss"],
  standalone: true,
  imports: [AppearOnScrollDirective],
})
export class ComoFuncionaComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
