import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepByStepSmComponent } from './step-by-step-sm.component';

describe('StepByStepSmComponent', () => {
  let component: StepByStepSmComponent;
  let fixture: ComponentFixture<StepByStepSmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepByStepSmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepByStepSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
