import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DemoNavigationComponent } from "../demo-navigation/demo-navigation.component";

@Component({
  selector: "app-ck-tag-demo",
  standalone: true,
  imports: [CommonModule, FormsModule, DemoNavigationComponent],
  templateUrl: "./ck-tag-demo.component.html",
  styleUrls: ["./ck-tag-demo.component.scss"],
})
export class CkTagDemoComponent {
  // Tags existentes
  tags = [
    { id: 1, text: "Angular", color: "primary", removable: true },
    { id: 2, text: "TypeScript", color: "secondary", removable: true },
    { id: 3, text: "JavaScript", color: "success", removable: true },
    { id: 4, text: "CSS", color: "warning", removable: true },
    { id: 5, text: "HTML", color: "danger", removable: true },
  ];

  // Tags de exemplo
  exampleTags = [
    { text: "Frontend", color: "primary" },
    { text: "Backend", color: "secondary" },
    { text: "Database", color: "info" },
    { text: "API", color: "success" },
    { text: "Mobile", color: "warning" },
    { text: "DevOps", color: "danger" },
  ];

  // Nova tag
  newTagText = "";
  newTagColor = "primary";
  tagIdCounter = 6;

  // Cores disponíveis
  colors = [
    { value: "primary", label: "Primário", class: "primary" },
    { value: "secondary", label: "Secundário", class: "secondary" },
    { value: "success", label: "Sucesso", class: "success" },
    { value: "warning", label: "Aviso", class: "warning" },
    { value: "danger", label: "Perigo", class: "danger" },
    { value: "info", label: "Info", class: "info" },
    { value: "light", label: "Claro", class: "light" },
    { value: "dark", label: "Escuro", class: "dark" },
  ];

  addTag() {
    if (this.newTagText.trim()) {
      this.tags.push({
        id: this.tagIdCounter++,
        text: this.newTagText.trim(),
        color: this.newTagColor,
        removable: true,
      });
      this.newTagText = "";
    }
  }

  removeTag(tagId: number) {
    this.tags = this.tags.filter((tag) => tag.id !== tagId);
  }

  clearAllTags() {
    this.tags = [];
  }

  addRandomTag() {
    const randomTexts = [
      "React",
      "Vue",
      "Node.js",
      "Python",
      "Java",
      "C#",
      "PHP",
      "Ruby",
    ];
    const randomColors = [
      "primary",
      "secondary",
      "success",
      "warning",
      "danger",
      "info",
    ];

    const randomText =
      randomTexts[Math.floor(Math.random() * randomTexts.length)];
    const randomColor =
      randomColors[Math.floor(Math.random() * randomColors.length)];

    this.tags.push({
      id: this.tagIdCounter++,
      text: randomText,
      color: randomColor,
      removable: true,
    });
  }
}
