import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";

interface ComponenteInfo {
  nome: string;
  descricao: string;
  categoria: string;
  rota: string;
  exemplo?: string;
  props?: { nome: string; tipo: string; descricao: string }[];
}

@Component({
  selector: "app-componentes-viewer",
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./componentes-viewer.component.html",
  styleUrls: ["./componentes-viewer.component.scss"],
})
export class ComponentesViewerComponent implements OnInit {
  constructor(private router: Router) {}

  componentes: ComponenteInfo[] = [
    {
      nome: "CK Input",
      descricao: "Componente de input customizado com validação e estilização",
      categoria: "Formulários",
      rota: "/lib/componentes/ck-input",
      props: [
        { nome: "label", tipo: "string", descricao: "Texto do label" },
        { nome: "placeholder", tipo: "string", descricao: "Texto placeholder" },
        {
          nome: "type",
          tipo: "string",
          descricao: "Tipo do input (text, email, password)",
        },
        { nome: "required", tipo: "boolean", descricao: "Campo obrigatório" },
      ],
    },
    {
      nome: "CK Select",
      descricao: "Componente de select customizado com opções",
      categoria: "Formulários",
      rota: "/lib/componentes/ck-select",
      props: [
        { nome: "label", tipo: "string", descricao: "Texto do label" },
        { nome: "options", tipo: "array", descricao: "Lista de opções" },
        { nome: "placeholder", tipo: "string", descricao: "Texto placeholder" },
      ],
    },
    {
      nome: "CK Modal",
      descricao: "Modal customizado para exibição de conteúdo",
      categoria: "Overlay",
      rota: "/lib/componentes/ck-modal",
      props: [
        { nome: "title", tipo: "string", descricao: "Título do modal" },
        {
          nome: "visible",
          tipo: "boolean",
          descricao: "Visibilidade do modal",
        },
        { nome: "size", tipo: "string", descricao: "Tamanho (sm, md, lg)" },
      ],
    },
    {
      nome: "CK Loading",
      descricao: "Componente de loading com animação",
      categoria: "Feedback",
      rota: "/lib/componentes/ck-loading",
      props: [
        { nome: "size", tipo: "string", descricao: "Tamanho do loading" },
        { nome: "text", tipo: "string", descricao: "Texto do loading" },
      ],
    },
    {
      nome: "CK Progress Bar",
      descricao: "Barra de progresso customizada",
      categoria: "Feedback",
      rota: "/lib/componentes/ck-progress-bar",
      props: [
        {
          nome: "value",
          tipo: "number",
          descricao: "Valor do progresso (0-100)",
        },
        { nome: "color", tipo: "string", descricao: "Cor da barra" },
      ],
    },
    {
      nome: "CK Tag",
      descricao: "Tag customizada para categorização",
      categoria: "Display",
      rota: "/lib/componentes/ck-tag",
      props: [
        { nome: "text", tipo: "string", descricao: "Texto da tag" },
        { nome: "color", tipo: "string", descricao: "Cor da tag" },
        {
          nome: "removable",
          tipo: "boolean",
          descricao: "Se pode ser removida",
        },
      ],
    },
    {
      nome: "CK Counter",
      descricao: "Contador com animação",
      categoria: "Display",
      rota: "/lib/componentes/ck-counter",
      props: [
        { nome: "value", tipo: "number", descricao: "Valor do contador" },
        { nome: "prefix", tipo: "string", descricao: "Prefixo do valor" },
        { nome: "suffix", tipo: "string", descricao: "Sufixo do valor" },
      ],
    },
    {
      nome: "CK Chart",
      descricao: "Gráfico customizado",
      categoria: "Data Visualization",
      rota: "/lib/componentes/ck-chart",
      props: [
        { nome: "data", tipo: "array", descricao: "Dados do gráfico" },
        { nome: "type", tipo: "string", descricao: "Tipo do gráfico" },
      ],
    },
    {
      nome: "Step by Step",
      descricao: "Componente de etapas para processos",
      categoria: "Navigation",
      rota: "/lib/componentes/step-by-step",
      props: [
        { nome: "steps", tipo: "array", descricao: "Lista de etapas" },
        { nome: "currentStep", tipo: "number", descricao: "Etapa atual" },
      ],
    },
    {
      nome: "Navbar",
      descricao: "Barra de navegação principal",
      categoria: "Navigation",
      rota: "/lib/componentes/navbar",
      props: [
        { nome: "logo", tipo: "string", descricao: "URL do logo" },
        { nome: "menuItems", tipo: "array", descricao: "Itens do menu" },
      ],
    },
    {
      nome: "Footer",
      descricao: "Rodapé da aplicação",
      categoria: "Layout",
      rota: "/lib/componentes/footer",
      props: [
        { nome: "links", tipo: "array", descricao: "Links do rodapé" },
        { nome: "socialMedia", tipo: "array", descricao: "Redes sociais" },
      ],
    },
    {
      nome: "Floating Chat",
      descricao: "Chat flutuante para suporte",
      categoria: "Communication",
      rota: "/lib/componentes/floating-chat",
      props: [
        { nome: "visible", tipo: "boolean", descricao: "Visibilidade do chat" },
        { nome: "position", tipo: "string", descricao: "Posição na tela" },
        {
          nome: "isOnline",
          tipo: "boolean",
          descricao: "Status online/offline",
        },
        { nome: "config", tipo: "object", descricao: "Configurações do chat" },
      ],
    },
    {
      nome: "CK Chart",
      descricao: "Gráfico customizado com Canvas",
      categoria: "Data Visualization",
      rota: "/lib/componentes/ck-chart",
      props: [
        { nome: "data", tipo: "array", descricao: "Dados do gráfico" },
        {
          nome: "type",
          tipo: "string",
          descricao: "Tipo do gráfico (bar, line, pie, doughnut)",
        },
        { nome: "width", tipo: "number", descricao: "Largura do gráfico" },
        { nome: "height", tipo: "number", descricao: "Altura do gráfico" },
        { nome: "title", tipo: "string", descricao: "Título do gráfico" },
      ],
    },
  ];

  categorias: string[] = [];
  componenteSelecionado: ComponenteInfo | null = null;
  filtroCategoria: string = "Todos";

  ngOnInit() {
    this.categorias = [
      "Todos",
      ...new Set(this.componentes.map((c) => c.categoria)),
    ];
  }

  filtrarPorCategoria(categoria: string) {
    this.filtroCategoria = categoria;
  }

  getComponentesFiltrados(): ComponenteInfo[] {
    if (this.filtroCategoria === "Todos") {
      return this.componentes;
    }
    return this.componentes.filter((c) => c.categoria === this.filtroCategoria);
  }

  selecionarComponente(componente: ComponenteInfo) {
    this.componenteSelecionado = componente;
  }

  fecharDetalhes() {
    this.componenteSelecionado = null;
  }

  abrirDemo(componente: ComponenteInfo) {
    const demoRoute = this.getDemoRoute(componente.nome);
    if (demoRoute) {
      this.router.navigate([demoRoute]);
    } else {
      alert("Demonstração não disponível para este componente ainda.");
    }
  }

  private getDemoRoute(nomeComponente: string): string | null {
    const demos: { [key: string]: string } = {
      "CK Input": "/lib/componentes/ck-input-demo",
      "CK Select": "/lib/componentes/ck-select-demo",
      "CK Modal": "/lib/componentes/ck-modal-demo",
      "CK Loading": "/lib/componentes/ck-loading-demo",
      "CK Progress Bar": "/lib/componentes/ck-progress-demo",
      "CK Tag": "/lib/componentes/ck-tag-demo",
      "CK Counter": "/lib/componentes/ck-counter-demo",
      "Step by Step": "/lib/componentes/step-demo",
    };
    return demos[nomeComponente] || null;
  }
}
