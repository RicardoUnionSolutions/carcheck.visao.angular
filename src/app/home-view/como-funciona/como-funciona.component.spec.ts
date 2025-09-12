import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComoFuncionaComponent } from './como-funciona.component';

describe('ComoFuncionaComponent', () => {
  let component: ComoFuncionaComponent;
  let fixture: ComponentFixture<ComoFuncionaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ComoFuncionaComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComoFuncionaComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render section heading and id', () => {
    fixture.detectChanges();
    const section: HTMLElement = fixture.nativeElement.querySelector('section');
    expect(section).toBeTruthy();
    expect(section.id).toBe('como_funciona');
    const heading = section.querySelector('h2');
    expect(heading?.textContent).toContain('Como funciona');
  });

  it('should render four steps with correct titles', () => {
    fixture.detectChanges();
    const steps = fixture.nativeElement.querySelectorAll('.etapa');
    expect(steps.length).toBe(4);
    const expectedTitles = ['Consulta', 'Placa', 'Cadastro / Login', 'Pagamento'];
    steps.forEach((step: any, index: number) => {
      const title = step.querySelector('h3');
      expect(title.textContent.trim()).toBe(expectedTitles[index]);
    });
  });

  it('should render correct descriptions for each step', () => {
    fixture.detectChanges();
    const expectedDescriptions = [
      'Escolha a consulta mais adequada para sua necessidade.',
      'Informe apenas a placa ou chassi do carro.',
      'Faça seu cadastro no Carcheck Brasil ou realize login no sistema.',
      'Realize o pagamento da consulta e obtenha o resultado com as informações sobre o carro em pouco tempo.'
    ];
    const steps = fixture.nativeElement.querySelectorAll('.etapa');
    steps.forEach((step: any, index: number) => {
      const desc = step.querySelector('p');
      expect(desc.textContent.trim()).toBe(expectedDescriptions[index]);
    });
  });

  it('should display step numbers from 1 to 4', () => {
    fixture.detectChanges();
    const circles = fixture.nativeElement.querySelectorAll('.etapa_circulo');
    const numbers = Array.from(circles).map((c: any) => c.textContent.trim());
    expect(numbers).toEqual(['1', '2', '3', '4']);
  });
});
