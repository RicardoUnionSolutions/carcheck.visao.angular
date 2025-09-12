import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VistoriaComponent } from './vistoria.component';

describe('VistoriaComponent', () => {
  let component: VistoriaComponent;
  let fixture: ComponentFixture<VistoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VistoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VistoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
