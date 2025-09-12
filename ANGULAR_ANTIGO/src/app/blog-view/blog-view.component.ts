import { Component, OnInit } from '@angular/core';
import { PostService } from '../service/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../service/modal.service';
import { Post } from '../classes/post';

@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.scss']
})
export class BlogViewComponent implements OnInit {

  posts: Post[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  totalItems = 0;
  categories: any[];
  loading = false;
  categoria = "";
  categoriaSlug = "";

  constructor(private postService: PostService, private route: ActivatedRoute, private modalService: ModalService, private router: Router) { }

  ngOnInit() {
    this.modalService.openLoading({ title: "Aguarde...", text: "Carregando Postagens" });

    this.loadPosts();

  }

  async loadPosts() {
    try {
      var category = this.route.snapshot.paramMap.get('categoriaSlug');
      if (category || this.categoriaSlug) {
        this.categoriaSlug != "" ? category = this.categoriaSlug : category = category;
        const postagensByCategoria = await this.postService.getPostsByCategorias(category, this.currentPage, this.itemsPerPage);
        this.posts = postagensByCategoria["posts"] as Post[];
        this.totalItems = postagensByCategoria["totalDePosts"];
      } else {
        this.categoria = "";
        const posts = await this.postService.getPosts(this.currentPage, this.itemsPerPage);
        this.posts = posts["posts"] as Post[];
        this.totalItems = posts["totalDePosts"];
      }

      const categorias =  await this.postService.getCategories();
      this.categories = categorias["listaDeCategorias"];

    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      this.modalService.closeLoading();
      this.loading = false;
    }
  }

  pageChanged(event: any): void {
    this.loading = true;
    this.currentPage = event.page;
    this.loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.posts = [];
  }
  navigateToPost(slug: string, id: number) {
    this.router.navigate(['/blog', id, slug], { state: { posts: this.posts } });
  }

  isBlogRoute() {
    return this.router.url === '/blog' && this.categoria === "";
  }

  async getPostsByCategory(categoriaSlug, categoria){
    this.posts = [];
    this.categoria = categoria;
    this.categoriaSlug = categoriaSlug;
    this.loading = true;
    this.currentPage = 1;
    this.itemsPerPage = 4;
    try {
      const postagensByCategoria = await this.postService.getPostsByCategorias(categoriaSlug, this.currentPage, this.itemsPerPage);
      this.posts = postagensByCategoria["posts"] as Post[];
      this.totalItems = postagensByCategoria["totalDePosts"];
    } catch (error) {
      this.loadPosts();
      console.error(error);
    } finally{
      this.loading = false
    }
  }

  loadAllPosts(){
    this.posts = [];
    this.currentPage = 1;
    this.categoria = "";
    this.categoriaSlug = "";
    this.loadPosts();
  }

}
