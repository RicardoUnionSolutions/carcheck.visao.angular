import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkChartComponent } from './ck-chart.component';

describe('CkChartComponent', () => {
  let component: CkChartComponent;
  let fixture: ComponentFixture<CkChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CkChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
