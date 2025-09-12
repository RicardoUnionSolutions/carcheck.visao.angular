import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PostService } from './blog.service';
import { environment } from '../../environments/environment';
import { Post } from '../classes/post';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [PostService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch posts', async () => {
    const mockPosts: Post[] = [
      {
        id: 1,
        titulo: 't1',
        body: 'body',
        descricao: 'desc',
        categoria: 'cat',
        linkImg: 'img',
        slug: 'slug',
        categoriaSlug: 'cslug',
        dataCriacao: '2020-01-01',
        autor: 'author'
      }
    ];
    const promise = service.getPosts(1, 10);
    const req = httpMock.expectOne(`${environment.wsUrl}/painel/getPosts/?currentPage=1&qtdPerPage=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
    const posts = await promise;
    expect(posts).toEqual(mockPosts);
  });

  it('should handle error when fetching posts fails', async () => {
    const promise = service.getPosts(1, 10);
    const req = httpMock.expectOne(`${environment.wsUrl}/painel/getPosts/?currentPage=1&qtdPerPage=10`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    try {
      await promise;
      fail('expected error');
    } catch (error) {
      expect(error.status).toBe(500);
    }
  });

  it('should fetch categories', async () => {
    const mockCategories = [{ id: 1, nome: 'c1' }];
    const promise = service.getCategories();
    const req = httpMock.expectOne(`${environment.wsUrl}/painel/getCategorias`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
    const categories = await promise;
    expect(categories).toEqual(mockCategories);
  });

  it('should handle error when fetching categories fails', async () => {
    const promise = service.getCategories();
    const req = httpMock.expectOne(`${environment.wsUrl}/painel/getCategorias`);
    req.flush('Error', { status: 404, statusText: 'Not Found' });
    try {
      await promise;
      fail('expected error');
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });

  it('should fetch post by id', async () => {
    const mockPost: Post = {
      id: 1,
      titulo: 't1',
      body: 'body',
      descricao: 'desc',
      categoria: 'cat',
      linkImg: 'img',
      slug: 'slug',
      categoriaSlug: 'cslug',
      dataCriacao: '2020-01-01',
      autor: 'author'
    };
    const promise = service.getPostById(1);
    const req = httpMock.expectOne(`${environment.wsUrl}/painel/getPostById/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
    const post = await promise;
    expect(post).toEqual(mockPost);
  });

  it('should handle error when fetching post by id fails', async () => {
    const promise = service.getPostById(1);
    const req = httpMock.expectOne(`${environment.wsUrl}/painel/getPostById/1`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    try {
      await promise;
      fail('expected error');
    } catch (error) {
      expect(error.status).toBe(500);
    }
  });

  it('should fetch posts by category', async () => {
    const mockPosts: Post[] = [
      {
        id: 2,
        titulo: 't2',
        body: 'body',
        descricao: 'desc',
        categoria: 'cat',
        linkImg: 'img',
        slug: 'slug',
        categoriaSlug: 'cslug',
        dataCriacao: '2020-01-01',
        autor: 'author'
      }
    ];
    const promise = service.getPostsByCategorias('news', 1, 5);
    const req = httpMock.expectOne(`${environment.wsUrl}/painel/getPostsByCategoria/?categoriaSlug=news&currentPage=1&qtdPerPage=5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
    const posts = await promise;
    expect(posts).toEqual(mockPosts);
  });

  it('should handle error when fetching posts by category fails', async () => {
    const promise = service.getPostsByCategorias('news', 1, 5);
    const req = httpMock.expectOne(`${environment.wsUrl}/painel/getPostsByCategoria/?categoriaSlug=news&currentPage=1&qtdPerPage=5`);
    req.flush('Error', { status: 400, statusText: 'Bad Request' });
    try {
      await promise;
      fail('expected error');
    } catch (error) {
      expect(error.status).toBe(400);
    }
  });
});
