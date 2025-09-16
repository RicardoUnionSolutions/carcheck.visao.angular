import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { convertToParamMap, ActivatedRoute, Router } from "@angular/router";
import { Meta, Title } from "@angular/platform-browser";

import { PostViewComponent } from "./post-view.component";
import { PostService } from "../../service/blog.service";
import { ModalService } from "../../service/modal.service";
import { Post } from "../../classes/post";

describe("PostViewComponent", () => {
  let component: PostViewComponent;
  let postService: jasmine.SpyObj<PostService>;
  let modalService: jasmine.SpyObj<ModalService>;
  let router: jasmine.SpyObj<Router>;
  let meta: jasmine.SpyObj<Meta>;
  let title: jasmine.SpyObj<Title>;
  let historyStateSpy: jasmine.Spy;
  let route: ActivatedRoute;

  const buildPost = (overrides: Partial<Post> = {}): Post => ({
    id: 1,
    titulo: "Como verificar a procedência de um veículo usado",
    body: "<p>Conteúdo do post</p>",
    descricao: "Descrição do post",
    categoria: "Dicas",
    linkImg: "./assets/images/card-1.jpg",
    slug: "como-verificar",
    categoriaSlug: "dicas",
    dataCriacao: "2024-01-01T00:00:00.000Z",
    autor: "Carcheck Brasil",
    ...overrides,
  });

  beforeEach(async () => {
    const postServiceSpy = jasmine.createSpyObj("PostService", [
      "getPostById",
      "getPosts",
    ]);
    const modalServiceSpy = jasmine.createSpyObj("ModalService", [
      "openLoading",
      "closeLoading",
    ]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    const metaSpy = jasmine.createSpyObj("Meta", ["updateTag"]);
    const titleSpy = jasmine.createSpyObj("Title", ["setTitle"]);

    await TestBed.configureTestingModule({
      imports: [PostViewComponent],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: "1" }),
            },
          },
        },
        { provide: Meta, useValue: metaSpy },
        { provide: Title, useValue: titleSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    const fixture = TestBed.createComponent(PostViewComponent);
    component = fixture.componentInstance;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    modalService = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    meta = TestBed.inject(Meta) as jasmine.SpyObj<Meta>;
    title = TestBed.inject(Title) as jasmine.SpyObj<Title>;
    route = TestBed.inject(ActivatedRoute);

    router.navigate.and.returnValue(Promise.resolve(true));
    historyStateSpy = spyOnProperty(window.history, "state", "get");
  });

  it("carrega a postagem atual e utiliza o histórico para destaques", async () => {
    const mainPost = buildPost();
    const historyPosts = [
      buildPost({ id: 1, titulo: "Duplicado" }),
      buildPost({ id: 2, titulo: "Post relacionado 1", slug: "relacionado-1" }),
      buildPost({ id: 3, titulo: "Post relacionado 2", slug: "relacionado-2" }),
      buildPost({ id: 4, titulo: "Post relacionado 3", slug: "relacionado-3" }),
    ];
    historyStateSpy.and.returnValue({ posts: historyPosts });
    postService.getPostById.and.returnValue(Promise.resolve(mainPost));

    await component.ngOnInit();

    expect(component.post).toEqual(mainPost);
    expect(component.posts.length).toBe(2);
    expect(component.posts.every((post) => post.id !== mainPost.id)).toBeTrue();
    expect(postService.getPosts).not.toHaveBeenCalled();
    expect(modalService.openLoading).toHaveBeenCalledWith({
      title: "Aguarde...",
      text: "Carregando informações",
    });
    expect(modalService.closeLoading).toHaveBeenCalled();
    expect(title.setTitle).toHaveBeenCalledWith(mainPost.titulo);
    expect(meta.updateTag).toHaveBeenCalledWith({ property: "og:locale", content: "pt_BR" });
    expect(meta.updateTag).toHaveBeenCalledWith({
      property: "og:site_name",
      content: "Carcheck Brasil",
    });
  });

  it("carrega destaques do serviço quando o histórico está vazio", async () => {
    const mainPost = buildPost();
    const fallbackPosts = [
      buildPost({ id: 5, titulo: "Sugestão 1", slug: "sugestao-1" }),
      buildPost({ id: 6, titulo: "Sugestão 2", slug: "sugestao-2" }),
    ];
    historyStateSpy.and.returnValue({});
    postService.getPostById.and.returnValue(Promise.resolve(mainPost));
    postService.getPosts.and.returnValue(
      Promise.resolve(fallbackPosts)
    );

    await component.ngOnInit();

    expect(postService.getPosts).toHaveBeenCalledOnceWith(1, 3);
    expect(component.posts).toEqual(fallbackPosts);
  });

  it("abre um novo post e atualiza as meta tags após a navegação", fakeAsync(() => {
    const newPost = buildPost({ id: 10, slug: "novo-post", titulo: "Novo Post" });
    const updateSpy = spyOn(component, "updateMetaTags");
    const destaquesSpy = spyOn(component, "getDestaques").and.returnValue(
      Promise.resolve()
    );

    component.openPost(newPost);

    expect(component.posts).toEqual([]);
    expect(component.post).toEqual(newPost);
    expect(destaquesSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([
      "/blog",
      newPost.id,
      newPost.slug,
    ], {
      relativeTo: route,
    });

    tick();

    expect(updateSpy).toHaveBeenCalled();
  }));

  it("obtém destaques atualizados do serviço", async () => {
    const mainPost = buildPost();
    component.post = mainPost;
    const highlightPosts = [
      buildPost({ id: 1 }),
      buildPost({ id: 7, titulo: "Outro post 1", slug: "outro-1" }),
      buildPost({ id: 8, titulo: "Outro post 2", slug: "outro-2" }),
      buildPost({ id: 9, titulo: "Outro post 3", slug: "outro-3" }),
    ];
    postService.getPosts.and.returnValue(
      Promise.resolve(highlightPosts)
    );

    await component.getDestaques();

    expect(postService.getPosts).toHaveBeenCalledOnceWith(1, 3);
    expect(component.posts.length).toBe(2);
    expect(component.posts.some((post) => post.id === mainPost.id)).toBeFalse();
  });

  it("atualiza corretamente as meta tags", () => {
    const mainPost = buildPost();
    component.post = mainPost;

    component.updateMetaTags();

    expect(title.setTitle).toHaveBeenCalledWith(mainPost.titulo);
    expect(meta.updateTag).toHaveBeenCalledWith({ property: "og:locale", content: "pt_BR" });
    expect(meta.updateTag).toHaveBeenCalledWith({
      property: "og:site_name",
      content: "Carcheck Brasil",
    });
    expect(meta.updateTag).toHaveBeenCalledWith({
      name: "description",
      content: mainPost.descricao,
    });
    expect(meta.updateTag).toHaveBeenCalledWith({
      name: "author",
      content: `${mainPost.autor}`,
    });
    expect(meta.updateTag).toHaveBeenCalledWith({
      property: "og:type",
      content: "article",
    });
    expect(meta.updateTag).toHaveBeenCalledWith({
      property: "og:title",
      content: mainPost.titulo,
    });
    expect(meta.updateTag).toHaveBeenCalledWith({
      property: "og:description",
      content: mainPost.descricao,
    });
    expect(meta.updateTag).toHaveBeenCalledWith({
      property: "og:image",
      content: mainPost.linkImg,
    });
    expect(meta.updateTag).toHaveBeenCalledWith({
      property: "og:image:type",
      content: "image/png",
    });
    expect(meta.updateTag).toHaveBeenCalledWith({
      property: "og:url",
      content: window.location.href,
    });
    expect(meta.updateTag).toHaveBeenCalledWith({
      property: "published_time",
      content: mainPost.dataCriacao,
    });
  });

  it("registra erro ao carregar a postagem e mantém o fechamento do loading", async () => {
    const fallbackPosts = [buildPost({ id: 5 })];
    historyStateSpy.and.returnValue({ posts: fallbackPosts });
    component.post = buildPost();
    postService.getPostById.and.returnValue(Promise.reject("Erro"));
    const consoleSpy = spyOn(console, "log");

    await component.ngOnInit();

    expect(consoleSpy).toHaveBeenCalledWith("Erro");
    expect(modalService.closeLoading).toHaveBeenCalled();
  });
});
