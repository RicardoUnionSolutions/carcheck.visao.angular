import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, Title, Meta } from '@angular/platform-browser';
import { DuvidasFrequentesComponent } from './duvidas-frequentes.component';
import { faqs } from '../utils/faqs';

describe('DuvidasFrequentesComponent', () => {
  let component: DuvidasFrequentesComponent;
  let fixture: ComponentFixture<DuvidasFrequentesComponent>;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuvidasFrequentesComponent],
      providers: [Title, Meta],
    }).compileComponents();

    fixture = TestBed.createComponent(DuvidasFrequentesComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);

    spyOn(titleService, 'setTitle').and.callThrough();
    spyOn(metaService, 'updateTag').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose FAQ data for the template', () => {
    expect(component.listaFaqs).toBe(faqs);

    const cards = fixture.debugElement.queryAll(By.css('.card'));
    expect(cards.length).toBe(faqs.length);

    const firstQuestion = cards[0]
      .query(By.css('.question-text'))
      .nativeElement as HTMLElement;
    expect(firstQuestion.textContent).toContain(faqs[0].question);

    cards.forEach(card => {
      const bodyWrapper = card.query(By.css('.accordion-body-wrapper'));
      expect(bodyWrapper.classes['open']).toBeFalsy();
    });
  });

  it('should set page metadata on init', () => {
    const expectedDescription =
      'Encontre respostas para as perguntas mais comuns sobre nossas consultas veiculares, planos e formas de pagamento.';

    expect(titleService.setTitle).toHaveBeenCalledWith(
      'Dúvidas Frequentes | CarCheck'
    );
    expect(titleService.getTitle()).toBe('Dúvidas Frequentes | CarCheck');

    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: expectedDescription,
    });

    const descriptionTag = metaService.getTag('name="description"');
    expect(descriptionTag?.getAttribute('content')).toBe(expectedDescription);
  });

  it('should toggle cards via the component method', () => {
    expect(component.activeCard).toBe('');

    component.toggleCard('collapse1');
    expect(component.activeCard).toBe('collapse1');

    component.toggleCard('collapse1');
    expect(component.activeCard).toBe('');

    component.toggleCard('collapse2');
    expect(component.activeCard).toBe('collapse2');

    component.toggleCard('collapse1');
    expect(component.activeCard).toBe('collapse1');
  });

  it('should reflect toggle interactions in the view', () => {
    const headers = fixture.debugElement.queryAll(By.css('.card-header'));
    const wrappers = fixture.debugElement.queryAll(
      By.css('.accordion-body-wrapper')
    );
    const firstIcon = headers[0].query(By.css('.icon')).nativeElement as HTMLElement;
    const secondIcon = headers[1].query(By.css('.icon')).nativeElement as HTMLElement;

    expect(wrappers[0].classes['open']).toBeFalsy();
    expect(firstIcon.classList.contains('rotar')).toBeFalse();
    expect(secondIcon.classList.contains('rotar')).toBeFalse();

    headers[0].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(wrappers[0].classes['open']).toBeTrue();
    expect(firstIcon.classList.contains('rotar')).toBeTrue();

    headers[1].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(wrappers[0].classes['open']).toBeFalse();
    expect(wrappers[1].classes['open']).toBeTrue();
    expect(firstIcon.classList.contains('rotar')).toBeFalse();
    expect(secondIcon.classList.contains('rotar')).toBeTrue();

    headers[1].triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(wrappers[1].classes['open']).toBeFalse();
    expect(secondIcon.classList.contains('rotar')).toBeFalse();
  });
});
