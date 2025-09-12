import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AplicativoComponent } from './aplicativo.component';

describe('AplicativoComponent', () => {
  let component: AplicativoComponent;
  let fixture: ComponentFixture<AplicativoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AplicativoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AplicativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render heading', () => {
    const heading = fixture.debugElement.query(By.css('h2')).nativeElement as HTMLElement;
    expect(heading.textContent).toContain('Agora também na App Store');
  });

  it('should have Google Play link with correct attributes', () => {
    const link = fixture.debugElement.queryAll(By.css('.app-links a'))[0]
      .nativeElement as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('https://play.google.com/store/apps/details?id=com.sazso.carcheck');
    expect(link.getAttribute('target')).toBe('_blank');
    const img = link.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('alt')).toBe('Disponível no Google Play');
    expect(img.getAttribute('src')).toContain('./assets/images/google-play-badge.png');
  });

  it('should have App Store link with correct attributes', () => {
    const link = fixture.debugElement.queryAll(By.css('.app-links a'))[1]
      .nativeElement as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('https://apps.apple.com/app/id6459511385');
    expect(link.getAttribute('target')).toBe('_blank');
    const img = link.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('alt')).toBe('Disponível na App Store');
    expect(img.getAttribute('src')).toContain('./assets/images/app-store-badge.png');
  });
});

