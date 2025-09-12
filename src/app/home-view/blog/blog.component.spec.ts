import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlogComponent } from './blog.component';
import { PostService } from '../../service/blog.service';
import { Post } from '../../classes/post';

describe('BlogComponent', () => {
  let component: BlogComponent;
  let fixture: ComponentFixture<BlogComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;

  const mockPosts = [
    {
      id: 1,
      titulo: 'Title 1',
      body: 'Body 1',
      descricao: 'Desc 1',
      categoria: 'Cat 1',
      linkImg: 'img1.jpg',
      slug: 'title-1',
      categoriaSlug: 'cat-1',
      dataCriacao: '2020-01-01',
      autor: 'Author 1',
    },
    {
      id: 2,
      titulo: 'Title 2',
      body: 'Body 2',
      descricao: 'Desc 2',
      categoria: 'Cat 2',
      linkImg: 'img2.jpg',
      slug: 'title-2',
      categoriaSlug: 'cat-2',
      dataCriacao: '2020-01-02',
      autor: 'Author 2',
    }
  ] as Post[];

  beforeEach(waitForAsync(() => {
    postServiceSpy = jasmine.createSpyObj('PostService', ['getPosts']);
    postServiceSpy.getPosts.and.returnValue(Promise.resolve(mockPosts));

    TestBed.configureTestingModule({
      declarations: [BlogComponent],
      providers: [{ provide: PostService, useValue: postServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts on init', fakeAsync(() => {
    spyOn(component, 'loadPosts').and.callThrough();
    fixture.detectChanges();
    expect(component.loadPosts).toHaveBeenCalled();
    expect(postServiceSpy.getPosts).toHaveBeenCalledWith(1, 2);
    tick();
    expect(component.posts).toEqual(mockPosts);
  }));

  it('should update posts when loadPosts is called', fakeAsync(() => {
    component.loadPosts();
    tick();
    expect(component.posts).toEqual(mockPosts);
  }));

  it('should handle error when service fails', fakeAsync(() => {
    const error = new Error('fail');
    postServiceSpy.getPosts.and.returnValue(Promise.reject(error));
    const consoleSpy = spyOn(console, 'error');
    component.loadPosts();
    tick();
    expect(consoleSpy).toHaveBeenCalledWith('Erro ao carregar posts:', error);
    expect(component.posts).toEqual([]);
  }));

  it('should use default pagination values', () => {
    expect(component.currentPage).toBe(1);
    expect(component.itemsPerPage).toBe(2);
  });
});

