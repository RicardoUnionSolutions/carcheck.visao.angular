import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DepoimentosComponent } from './depoimentos.component';

describe('DepoimentosComponent', () => {
  let component: DepoimentosComponent;
  let fixture: ComponentFixture<DepoimentosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DepoimentosComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepoimentosComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have five default reviews', () => {
    expect(component.reviews.length).toBe(5);
  });

  it('should render a card for each review', () => {
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('.testimonial-card'));
    expect(cards.length).toBe(component.reviews.length);
  });

  it('should display review information correctly', () => {
    fixture.detectChanges();
    const firstCard = fixture.debugElement.query(By.css('.testimonial-card'));
    const img: HTMLImageElement = firstCard.query(By.css('img')).nativeElement;
    const nameEl: HTMLElement = firstCard.query(By.css('h3')).nativeElement;
    const commentEl: HTMLElement = firstCard.query(By.css('.comment')).nativeElement;

    expect(img.getAttribute('src')).toBe(component.reviews[0].photo);
    expect(img.getAttribute('alt')).toBe(component.reviews[0].name);
    expect(nameEl.textContent?.trim()).toBe(component.reviews[0].name);
    expect(commentEl.textContent?.trim()).toBe(`"${component.reviews[0].comment}"`);
  });

  it('should render the correct number of stars for each review', () => {
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('.testimonial-card'));
    cards.forEach((card, index) => {
      const stars = card.queryAll(By.css('.mdi-star'));
      expect(stars.length).toBe(component.reviews[index].stars.length);
    });
  });

  it('should render zero testimonials when reviews array is empty', () => {
    component.reviews = [];
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('.testimonial-card'));
    expect(cards.length).toBe(0);
  });

  it('should handle reviews with varying star counts', () => {
    component.reviews = [
      { photo: 'a', name: 'A', stars: [1, 1, 1], comment: 'a' },
      { photo: 'b', name: 'B', stars: [1], comment: 'b' },
    ];
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('.testimonial-card'));
    expect(cards.length).toBe(2);
    const firstStars = cards[0].queryAll(By.css('.mdi-star'));
    const secondStars = cards[1].queryAll(By.css('.mdi-star'));
    expect(firstStars.length).toBe(3);
    expect(secondStars.length).toBe(1);
  });
});

