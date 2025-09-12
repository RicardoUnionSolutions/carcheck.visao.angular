import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { tap, map, switchMap, catchError } from 'rxjs/operators';
import { Post } from '../classes/post';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private readonly API = `${environment.wsUrl}/painel/`;

  constructor(private http: HttpClient) { }

  getPosts(currentPage, qtdPerPage) {
    return this.http.get<Post[]>(this.API + "getPosts/?currentPage=" + currentPage + "&qtdPerPage=" + qtdPerPage).toPromise();
  }

  getCategories() {
    return this.http.get<any[]>(this.API + "getCategorias").toPromise();
  }

  getPostById(id){
    return this.http.get<Post>(this.API + "getPostById/" + id).toPromise();
  }

  getPostsByCategorias(categoriaSlug, currentPage, qtdPerPage) {
    return this.http.get<Post[]>(this.API +
      "getPostsByCategoria/?categoriaSlug=" + categoriaSlug
      + "&currentPage=" + currentPage
      + "&qtdPerPage=" + qtdPerPage).toPromise();
  }

}
