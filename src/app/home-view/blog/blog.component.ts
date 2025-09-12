import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Post } from "../../classes/post";
import { PostService } from "../../service/blog.service";
import { AppearOnScrollDirective } from "../../directives/appear-on-scroll.directive";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
  standalone: true,
  imports: [CommonModule, AppearOnScrollDirective],
})
export class BlogComponent implements OnInit {
  posts: Post[] = [];

  currentPage = 1;
  itemsPerPage = 2;

  constructor(private blogService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts() {
    try {
      const posts = await this.blogService.getPosts(
        this.currentPage,
        this.itemsPerPage
      );
      this.posts = posts["posts"] as Post[];
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
      this.posts = [];
    }
  }
}
