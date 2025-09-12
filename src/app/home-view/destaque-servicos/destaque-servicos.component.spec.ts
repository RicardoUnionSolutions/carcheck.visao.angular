import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DestaqueServicosComponent } from './destaque-servicos.component';

describe('DestaqueServicosComponent', () => {
  let component: DestaqueServicosComponent;
  let fixture: ComponentFixture<DestaqueServicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DestaqueServicosComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DestaqueServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render heading with correct text', () => {
    const heading = fixture.debugElement.query(By.css('h2.titulo'))
      .nativeElement as HTMLElement;
    expect(heading.textContent?.trim()).toBe('Tá pensando em comprar um carro?');
  });

  it('should render description paragraph', () => {
    const desc = fixture.debugElement.query(By.css('p.descricao'))
      .nativeElement as HTMLElement;
    expect(desc.textContent).toContain('A gente te ajuda a fazer isso');
  });

  it('should display partner logos', () => {
    const logos = fixture.debugElement.queryAll(By.css('.parceiros img'));
    expect(logos.length).toBe(2);
    expect(logos[0].nativeElement.getAttribute('src')).toBe('https://carcheckbrasil.com.br/assets/images/seguralta.png');
    expect(logos[1].nativeElement.getAttribute('src')).toBe('https://pinpag.com.br/assets/images/logo.svg');
  });

  it('should list service titles and descriptions', () => {
    const titles = fixture.debugElement.queryAll(By.css('.servico h3'));
    const descriptions = fixture.debugElement.queryAll(By.css('.servico p'));
    expect(titles.length).toBe(3);
    expect(descriptions.length).toBe(3);
    expect(titles[0].nativeElement.textContent).toContain('Seguro de Veículos');
    expect(titles[1].nativeElement.textContent).toContain('Financiamento');
    expect(titles[2].nativeElement.textContent).toContain('Pagamento de débitos');
  });

  it('should contain a link to /servicos', () => {
    const link = fixture.debugElement.query(By.css('a[href="/servicos"]'))
      .nativeElement as HTMLAnchorElement;
    expect(link.textContent?.trim()).toBe('Ver serviços');
  });
});

