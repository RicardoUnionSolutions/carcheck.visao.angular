import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLaudoComponent } from './form-laudo.component';

describe('FormLaudoComponent', () => {
  let component: FormLaudoComponent;
  let fixture: ComponentFixture<FormLaudoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLaudoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLaudoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
