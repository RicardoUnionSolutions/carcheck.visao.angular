import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../service/blog.service';
import { ModalService } from '../../service/modal.service';
import { Post } from '../../classes/post';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.scss']
})
export class PostViewComponent implements OnInit {

  post: any;
  posts: any;

  constructor(private meta: Meta,
    private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private modalService: ModalService) { }

  async ngOnInit() {
    this.modalService.openLoading({ title: "Aguarde...", text: "Carregando informações" });
    const id = this.route.snapshot.paramMap.get('id');

    try {
      const postagem = await this.postService.getPostById(id);
      this.post = postagem as Post;

      this.posts = history.state.posts || [];
      if (this.posts.length == 0) {
        const postagens = await this.postService.getPosts(1, 3);
        this.posts = postagens["posts"] as Post[];
      }
      this.posts = this.posts.filter(element => element.id !== this.post.id);
      this.limitPosts();
    } catch (error) {
      console.log(error);
    } finally {
      this.updateMetaTags();
      this.modalService.closeLoading();
    }

  }

  private limitPosts() {
    if (this.posts.length > 2) {
      this.posts = this.posts.slice(0, 2);
    }
  }

  openPost(post) {
    this.posts = [];
    this.post = post as Post;
    this.getDestaques();
    this.router.navigate(['/blog', post.id, post.slug], {
      relativeTo: this.route
    }).then((r)=>{
      this.updateMetaTags();
    });
  }

  async getDestaques() {

    const postagens = await this.postService.getPosts(1, 3);
    this.posts = postagens["posts"] as Post[];

    this.posts = this.posts.filter(element => element.id !== this.post.id);
    this.limitPosts();
  }

  updateMetaTags() {
    this.titleService.setTitle(this.post.titulo);
    this.meta.updateTag({ property: 'og:locale', content: 'pt_BR' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Carcheck Brasil' });
    this.meta.updateTag({ name: 'description', content: this.post.descricao });
    this.meta.updateTag({ name: 'author', content: `${this.post.autor}` });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({ property: 'og:title', content: this.post.titulo });
    this.meta.updateTag({ property: 'og:description', content: this.post.descricao });
    this.meta.updateTag({ property: 'og:image', content: this.post.linkImg });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/png' });
    this.meta.updateTag({ property: 'og:url', content: window.location.href });
    this.meta.updateTag({ property: 'published_time', content: this.post.dataCriacao })
  }

}
