import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLaudoAdicionalComponent } from './form-laudo-adicional.component';

describe('FormLaudoAdicionalComponent', () => {
  let component: FormLaudoAdicionalComponent;
  let fixture: ComponentFixture<FormLaudoAdicionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLaudoAdicionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLaudoAdicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
