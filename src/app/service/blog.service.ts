import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of, from } from "rxjs";
import { tap, map, switchMap, catchError } from "rxjs/operators";
import { Post } from "../classes/post";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private readonly API = `${environment.wsUrl}/painel/`;

  constructor(private http: HttpClient) {}

  getPosts(currentPage, qtdPerPage) {
    return this.http
      .get<Post[]>(
        this.API +
          "getPosts/?currentPage=" +
          currentPage +
          "&qtdPerPage=" +
          qtdPerPage
      )
      .pipe(
        catchError(() => {
          // Dados mock quando a conexão falhar
          const postsMock: Post[] = [
            {
              id: 1,
              titulo: "Como verificar a procedência de um veículo usado",
              slug: "como-verificar-procedencia-veiculo-usado",
              body: "Conteúdo completo do post sobre verificação de procedência...",
              descricao:
                "Aprenda os passos essenciais para verificar a procedência de um veículo usado antes da compra.",
              categoria: "Dicas",
              linkImg: "./assets/images/card-1.jpg",
              categoriaSlug: "dicas",
              dataCriacao: new Date().toISOString(),
              autor: "CarCheck Brasil",
            },
            {
              id: 2,
              titulo: "5 sinais de que um carro pode ter problemas",
              slug: "5-sinais-carro-problemas",
              body: "Conteúdo completo sobre sinais de problemas em veículos...",
              descricao:
                "Descubra os principais sinais que indicam que um veículo pode ter problemas ocultos.",
              categoria: "Dicas",
              linkImg: "./assets/images/card-3.jpg",
              categoriaSlug: "dicas",
              dataCriacao: new Date().toISOString(),
              autor: "CarCheck Brasil",
            },
          ];
          return of(postsMock);
        })
      )
      .toPromise();
  }

  getCategories() {
    return this.http
      .get<any[]>(this.API + "getCategorias")
      .pipe(
        catchError(() => {
          // Dados mock para categorias quando a conexão falhar
          const categoriasMock = {
            listaDeCategorias: [
              {
                categoria: "Dicas",
                categoriaSlug: "dicas"
              },
              {
                categoria: "Notícias",
                categoriaSlug: "noticias"
              },
              {
                categoria: "Tutoriais",
                categoriaSlug: "tutoriais"
              },
              {
                categoria: "Segurança",
                categoriaSlug: "seguranca"
              }
            ]
          };
          return of(categoriasMock);
        })
      )
      .toPromise();
  }

  getPostById(id) {
    return this.http.get<Post>(this.API + "getPostById/" + id).toPromise();
  }

  getPostsByCategorias(categoriaSlug, currentPage, qtdPerPage) {
    return this.http
      .get<Post[]>(
        this.API +
          "getPostsByCategoria/?categoriaSlug=" +
          categoriaSlug +
          "&currentPage=" +
          currentPage +
          "&qtdPerPage=" +
          qtdPerPage
      )
      .pipe(
        catchError(() => {
          // Dados mock para posts por categoria quando a conexão falhar
          const postsByCategoryMock = {
            posts: [
              {
                id: 1,
                titulo: `Post sobre ${categoriaSlug}`,
                slug: `post-${categoriaSlug}-1`,
                body: `Conteúdo completo do post sobre ${categoriaSlug}...`,
                descricao: `Descrição do post sobre ${categoriaSlug}`,
                categoria: categoriaSlug.charAt(0).toUpperCase() + categoriaSlug.slice(1),
                linkImg: "./assets/images/card-1.jpg",
                categoriaSlug: categoriaSlug,
                dataCriacao: new Date().toISOString(),
                autor: "CarCheck Brasil",
              },
              {
                id: 2,
                titulo: `Outro post sobre ${categoriaSlug}`,
                slug: `post-${categoriaSlug}-2`,
                body: `Conteúdo completo do segundo post sobre ${categoriaSlug}...`,
                descricao: `Segunda descrição do post sobre ${categoriaSlug}`,
                categoria: categoriaSlug.charAt(0).toUpperCase() + categoriaSlug.slice(1),
                linkImg: "./assets/images/card-2.jpg",
                categoriaSlug: categoriaSlug,
                dataCriacao: new Date().toISOString(),
                autor: "CarCheck Brasil",
              }
            ],
            totalDePosts: 2
          };
          return of(postsByCategoryMock);
        })
      )
      .toPromise();
  }
}
